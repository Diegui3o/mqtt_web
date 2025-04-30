import express, { json } from 'express';
import cors from 'cors';
import { connect } from 'mqtt';
import { createServer } from 'http';
import { envs } from './config/env.js';
import { Server } from 'socket.io';
import { insertSensorData, insertControlState, insertNewFlight } from './server/questdb.js';

const app = express();
const server = createServer(app);

// Configurar middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
}));
app.use(json());

// Inicializar Socket.IO
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
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
let estadoControl = {
    led: false,
    motor: false
};
let anglesData = {}, ratesData = {}, accData = {}, gyroData = {}, kalmanData = {}, motorsData = {};
let isRecording = false;
let flightId = null;

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
        case ANGLES_TOPIC:
            anglesData = {
                roll: data.AngleRoll,
                pitch: data.AnglePitch,
                yaw: data.AngleYaw,
            };
            break;
        case RATES_TOPIC: ratesData = data; break;
        case ACC_TOPIC: accData = data; break;
        case GYRO_TOPIC: gyroData = data; break;
        case KALMAN_TOPIC:
            kalmanData = {
                KalmanAngleRoll: data.KalmanAngleRoll,
                KalmanAnglePitch: data.KalmanAnglePitch,
                error_phi: data.error_phi,
                error_theta: data.error_theta,
                InputThrottle: data.InputThrottle, // Asegúrate de incluirlo
                InputRoll: data.InputRoll,
                InputPitch: data.InputPitch,
                InputYaw: data.InputYaw,
            };
            break;
        case MOTORS_TOPIC:
            motorsData = {
                MotorInput1: data.MotorInput1,
                MotorInput2: data.MotorInput2,
                MotorInput3: data.MotorInput3,
                MotorInput4: data.MotorInput4,
                Altura: data.T, // Asegúrate de incluirlo
            };
        case MODE_TOPIC:
            const nuevoModo = parseInt(message.toString());
            if ([0, 1, 2].includes(nuevoModo)) {
                modo = nuevoModo;
                io.emit('modo', modo);
                console.log(`📢 Modo cambiado a: ${modo}`);
            }
            break;
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

    io.emit('angles', combinedData);

    if (isRecording && flightId) {
        const keys = Object.keys(combinedData);
        const hasValidData = keys.length > 0 && keys.some(key => {
            const value = combinedData[key];
            return typeof value === 'number' && !isNaN(value);
        });

        if (hasValidData) {
            //console.log("✅ Insertando datos válidos:", combinedData);
            //console.log("Kalman Data recibido:", kalmanData);
            insertSensorData(combinedData, flightId).catch(err => {
                console.error("❌ Error al insertar sensor data:", err.message);
            });
        } else {
            console.warn("⚠️ Datos no válidos, no se insertó nada:", combinedData);
        }
    }

    io.emit("datosCompleto", {
        time: new Date().toISOString(),
        ...combinedData
    });
});


io.on('connection', (socket) => {
    socket.emit('modo', modo);
});

// Endpoints para LED y motores
app.get('/led/on', (req, res) => {
    mqttClient.publish(CONTROL_TOPIC, 'ON_LED');
    insertControlState(modo, estadoControl.led, true);
    res.json({ message: "LED encendido" });
});

app.get('/led/off', (req, res) => {
    mqttClient.publish(CONTROL_TOPIC, 'OFF_LED');
    insertControlState(modo, estadoControl.led, false);
    res.json({ message: "LED apagado" });
});

app.get('/motores/on', (req, res) => {
    mqttClient.publish(CONTROL_TOPIC, 'ON_MOTORS');
    insertControlState(modo, true, estadoControl.motor);
    res.json({ message: "MOTORES ENCENDIDOS" });
});

app.get('/motores/off', (req, res) => {
    mqttClient.publish(CONTROL_TOPIC, 'OFF_MOTORS');
    insertControlState(modo, false, estadoControl.motor);
    res.json({ message: "MOTORES APAGADOS" });
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
app.get('/modo/actual', (req, res) => {
    try {
        if (typeof modo === 'number' && [0, 1, 2].includes(modo)) {
            res.status(200).json({ modo });
        } else {
            res.status(400).json({ error: 'Modo actual no válido' });
        }
    } catch (error) {
        console.error('❌ Error al obtener el modo actual:', error.message);
        res.status(500).json({ error: 'Error al obtener el modo actual' });
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

function convertObjectToMatrix(obj, rows = 3, cols = 6) {
    const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (const [key, value] of Object.entries(obj)) {
        const match = key.match(/\[(\d+)\]\[(\d+)\]/);
        if (match) {
            const row = parseInt(match[1], 10);
            const col = parseInt(match[2], 10);
            matrix[row][col] = value;
        }
    }
    return matrix;
}

app.post('/start-recording', async (req, res) => {
    try {
        const { Kc, Ki, mass, armLength, inputThrottle } = req.body || {};
        console.log('🌟 Recibido en /start-recording:', { Kc, Ki, mass, armLength, inputThrottle });

        // Convierte los objetos Kc y Ki a matrices
        const kcMatrix = convertObjectToMatrix(Kc);
        const kiMatrix = convertObjectToMatrix(Ki, 3, 3); // Ki es 3x3

        // Inserta el nuevo vuelo y obtiene el flightId
        flightId = await insertNewFlight(Kc, Ki, mass, armLength, inputThrottle);
        console.log(`🌟 Nuevo vuelo registrado con flightId: ${flightId}`);

        // Establecer que estamos grabando
        isRecording = true;

        // Detener la grabación automáticamente después de 20 segundos
        setTimeout(() => {
            isRecording = false;
            flightId = null; // Limpia el flightId después de detener la grabación
            console.log("⏹️ Grabación detenida automáticamente después de 20 segundos");
        }, 20000); // 20 segundos en milisegundos

        // Envía la respuesta al cliente
        res.status(200).json({ message: 'Recording started', flightId });
    } catch (error) {
        console.error('❌ Error al iniciar grabación:', error.message);
        res.status(500).json({ error: 'Error al iniciar grabación', details: error.message });
    }
});


// Iniciar servidor
server.listen(PORT, () => {
    console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
});