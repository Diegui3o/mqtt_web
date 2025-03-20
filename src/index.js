const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const http = require('http');
const { envs } = require('./config/env');
const { Server } = require('socket.io');

const PORT = envs.PORT;

// Configuración del broker MQTT
const mqttBrokerUrl = envs.MQTT_BROKER_URL;
const controlTopic = envs.CONTROL_TOPIC;
const anglesTopic = envs.ANGLES_TOPIC;
const ratesTopic = envs.RATES_TOPIC;
const accTopic = envs.ACC_TOPIC;
const gyroTopic = envs.GYRO_TOPIC;
const kalmanTopic = envs.KALMAN_TOPIC;
const motorsTopic = envs.MOTORS_TOPIC;
const modeTopic = envs.MODE_TOPIC;

// Crear servidor Express
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Update to match the client origin
        methods: ['GET', 'POST'],
    },
});

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Update to match the client origin
    methods: ['GET', 'POST'],
}));

// Conectar al broker MQTT
const mqttClient = mqtt.connect(mqttBrokerUrl);

// Variable global para el modo (modo predeterminado = 1)
let modo = 1;

// Variables para almacenar los datos recibidos
let anglesData = {};
let ratesData = {};
let accData = {};
let gyroData = {};
let kalmanData = {};
let motorsData = {};

mqttClient.on('error', (error) => {
    console.error('❌ Error en la conexión MQTT:', error);
});

mqttClient.on('connect', () => {
    console.log('✅ Conectado al broker MQTT');

    // Suscribirse a los tópicos relevantes
    mqttClient.subscribe([anglesTopic, ratesTopic, accTopic, gyroTopic, kalmanTopic, motorsTopic, modeTopic], (err) => {
        if (!err) {
            console.log(`✅ Suscrito a los tópicos: ${anglesTopic}, ${ratesTopic}, ${accTopic}, ${gyroTopic}, ${kalmanTopic}, ${motorsTopic}, ${modeTopic}`);
        } else {
            console.error('❌ Error al suscribirse a los tópicos:', err);
        }
    });
});

// Escuchar mensajes desde MQTT
mqttClient.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());

    if (topic === anglesTopic) {
        // console.log('📡 Ángulos recibidos:', data);
        anglesData = data;
    } else if (topic === ratesTopic) {
        // console.log('📡 Tasas recibidas:', data);
        ratesData = data;
    } else if (topic === accTopic) {
        // console.log('📡 Aceleraciones recibidas:', data);
        accData = data;
    } else if (topic === gyroTopic) {
        // console.log('📡 Datos del giroscopio recibidos:', data);
        gyroData = data;
    } else if (topic === kalmanTopic) {
        // console.log('📡 Ángulos de Kalman recibidos:', data);
        kalmanData = data;
    } else if (topic === motorsTopic) {
        // console.log('📡 Estado de motores recibido:', data);
        motorsData = data;
    } else if (topic === modeTopic) {
        modo = parseInt(message.toString());
        // console.log(`🔄 Modo actualizado desde MQTT: ${modo}`);
        io.emit('modo', modo);
    }

    // Emitir todos los datos combinados
    io.emit('angles', {
        ...anglesData,
        ...ratesData,
        ...accData,
        ...gyroData,
        ...kalmanData,
        ...motorsData,
        modo: modo,
    });
});

// WebSockets
io.on('connection', (socket) => {
    // console.log('🔌 Cliente conectado:', socket.id);
    socket.emit('modo', modo); // Enviar el modo actual al cliente

    socket.on('disconnect', () => {
        // console.log('🔌 Cliente desconectado:', socket.id);
    });
});

// Rutas para controlar el LED y motores
app.get("/led/on", (req, res) => {
    console.log("LED Encendido");
    mqttClient.publish(controlTopic, 'ON_LED');
    res.json({ message: "LED encendido" });
});

app.get("/led/off", (req, res) => {
    console.log("LED Apagado");
    mqttClient.publish(controlTopic, 'OFF_LED');
    res.json({ message: "LED apagado" });
});

app.get('/motores/on', (req, res) => {
    console.log("MOTORES Encendido");
    mqttClient.publish(controlTopic, 'ON_MOTORS');
    res.json({ message: 'MOTORES ENCENDIDOS' });
});

app.get('/motores/off', (req, res) => {
    mqttClient.publish(controlTopic, 'OFF_MOTORS');
    res.json({ message: 'MOTORES APAGADOS' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('❌ Error en el servidor:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// 🔄 Ruta para cambiar el modo
app.get('/modo/:numero', (req, res) => {
    const nuevoModo = parseInt(req.params.numero);

    if (![0, 1, 2].includes(nuevoModo)) {
        return res.status(400).json({ error: 'Modo inválido. Usa 0, 1 o 2' });
    }

    modo = nuevoModo;
    console.log(`🔄 Modo cambiado a: ${modo}`);

    // Publicar el nuevo modo en MQTT
    mqttClient.publish(modeTopic, String(modo), { qos: 1 }, (err) => {
        if (err) {
            console.error('❌ Error al publicar en MQTT:', err);
            return res.status(500).json({ error: 'Error al publicar en MQTT' });
        }

        // Notificar a los clientes WebSocket
        io.emit('modo', modo); // Asegúrate de que esto se esté ejecutando
        console.log(`📢 Evento 'modo' emitido a los clientes: ${modo}`);
        res.json({ message: `Modo cambiado a ${modo}` });
    });
});

// ⚡ Acciones según el modo
app.get('/accion', (req, res) => {
    switch (modo) {
        case 0:
            console.log("🔴 Modo 0: Activando motores");
            res.json({ message: 'Modo 0:' });
            break;

        case 1:
            console.log("🟡 Modo 1: No hacer nada (predeterminado)");
            res.json({ message: 'Modo 1: En espera' });
            break;

        case 2:
            console.log("🟢 Modo 2: Apagando motores");
            mqttClient.publish(controlTopic, 'OFF_MOTORS');
            res.json({ message: 'Modo 2:' });
            break;
    }
});

// Iniciar el servidor HTTP
server.listen(PORT, () => {
    console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
});