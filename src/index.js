import express, { json } from 'express';
import cors from 'cors';
import { connect } from 'mqtt';
import { createServer } from 'http';
import { envs } from './config/env.js';
import { Server } from 'socket.io';
import sensorRoutes from './server/server.js';
import {
    writeSensorData,
    closeConnection,
    getCurrentMode,
} from './service/database.js';

const app = express();
const server = createServer(app);

// Configurar middlewares
app.use(cors({
    origin: 'http://localhost:5174',
    methods: ['GET', 'POST'],
}));
app.use(json());

// Rutas
app.use('/api/sensor', sensorRoutes);

// Inicializar Socket.IO
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5174',
        methods: ['GET', 'POST'],
    },
});

// Puerto del servidor
const PORT = envs.PORT || 3000;

// Configuración del broker MQTT
const mqttClient = connect(envs.MQTT_BROKER_URL);
const {
    CONTROL_TOPIC,
    ANGLES_TOPIC,
    RATES_TOPIC,
    ACC_TOPIC,
    GYRO_TOPIC,
    KALMAN_TOPIC,
    MOTORS_TOPIC,
    MODE_TOPIC
} = envs;

let modo = 1;
let anglesData = {}, ratesData = {}, accData = {}, gyroData = {}, kalmanData = {}, motorsData = {};

mqttClient.on('connect', () => {
    console.log('✅ Conectado al broker MQTT');
    mqttClient.subscribe([
        ANGLES_TOPIC,
        RATES_TOPIC,
        ACC_TOPIC,
        GYRO_TOPIC,
        KALMAN_TOPIC,
        MOTORS_TOPIC,
        MODE_TOPIC
    ]);
});

mqttClient.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());

    switch (topic) {
        case ANGLES_TOPIC: anglesData = data; break;
        case RATES_TOPIC: ratesData = data; break;
        case ACC_TOPIC: accData = data; break;
        case GYRO_TOPIC: gyroData = data; break;
        case KALMAN_TOPIC: kalmanData = data; break;
        case MOTORS_TOPIC: motorsData = data; break;
        case MODE_TOPIC:
            const nuevoModo = parseInt(message.toString());
            if ([0, 1, 2].includes(nuevoModo)) {
                modo = nuevoModo;
                io.emit('modo', modo);
                console.log(`📢 Modo cambiado a: ${modo}`);
            }
            break;
    }
    if (topic === ANGLES_TOPIC && data.AngleRoll !== undefined && data.AnglePitch !== undefined) {
        io.emit("sensorData", {
            time: new Date().toISOString(),
            value: data.AngleRoll,
            pitch: data.AnglePitch,
        });
    }
    const combinedData = {
        ...anglesData,
        ...ratesData,
        ...accData,
        ...gyroData,
        ...kalmanData,
        ...motorsData,
        modo,
    };

    writeSensorData(combinedData);
    io.emit('angles', combinedData);
});

io.on('connection', (socket) => {
    socket.emit('modo', modo);
});

// Endpoints para LED y motores
app.get('/led/on', (req, res) => {
    mqttClient.publish(CONTROL_TOPIC, 'ON_LED');
    res.json({ message: "LED encendido" });
});

app.get('/led/off', (req, res) => {
    mqttClient.publish(CONTROL_TOPIC, 'OFF_LED');
    res.json({ message: "LED apagado" });
});

app.get('/motores/on', (req, res) => {
    mqttClient.publish(CONTROL_TOPIC, 'ON_MOTORS');
    res.json({ message: 'MOTORES ENCENDIDOS' });
});

app.get('/motores/off', (req, res) => {
    mqttClient.publish(CONTROL_TOPIC, 'OFF_MOTORS');
    res.json({ message: 'MOTORES APAGADOS' });
});

// Endpoint para cambiar modo
app.get('/modo/:numero', (req, res) => {
    const nuevoModo = parseInt(req.params.numero);
    if (![0, 1, 2].includes(nuevoModo)) {
        return res.status(400).json({ error: 'Modo inválido. Usa 0, 1 o 2' });
    }

    if (modo !== nuevoModo) {
        modo = nuevoModo;
        mqttClient.publish(MODE_TOPIC, String(modo), { qos: 1 });
        io.emit('modo', modo);
        console.log(`📢 Modo cambiado a: ${modo}`);
    }

    res.json({ message: `Modo actual: ${modo}` });
});

// Endpoint para obtener modo actual
app.get('/modo/actual', async (req, res) => {
    try {
        const current = await getCurrentMode();
        res.json({ modo: current });
    } catch (error) {
        console.error('Error al consultar el modo:', error);
        res.status(500).json({ error: 'Error al consultar el modo' });
    }
});

// Endpoint de acción por modo
app.get('/accion', (req, res) => {
    switch (modo) {
        case 0: return res.json({ message: 'Modo 0: Activando motores' });
        case 1: return res.json({ message: 'Modo 1: En espera' });
        case 2: return res.json({ message: 'Modo 2: Apagando motores' });
    }
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('❌ Error del servidor:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
});

// Cerrar la conexión de InfluxDB al salir
process.on('SIGINT', () => {
    closeConnection();
    process.exit(0);
});
