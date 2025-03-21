// services/database.js
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { influxConfig } from '../config/influxConfig.js';

const { url, token, org, bucket } = influxConfig;

// Configurar el cliente de InfluxDB
const influxDB = new InfluxDB({ url, token });
const writeApi = influxDB.getWriteApi(org, bucket);
const queryApi = influxDB.getQueryApi(org);

// Función para consultar el modo actual desde InfluxDB
export const getCurrentMode = async () => {
    const query = `from(bucket: "${bucket}")
      |> range(start: -5m)  // Asegurar que revisamos un rango suficiente
      |> filter(fn: (r) => r._measurement == "sensor_data")
      |> filter(fn: (r) => r._field == "switch_state")
      |> sort(columns: ["_time"], desc: true)  // Ordenar por tiempo descendente
      |> limit(n:1)`;  // Obtener el valor más reciente

    const rows = await queryApi.collectRows(query);
    const modo = rows.length > 0 ? parseInt(rows[0]._value) : 1;
    // console.log('🔹 Modo recuperado desde InfluxDB:', modo);
    return modo;
};

// Función para escribir datos en InfluxDB
export const writeSensorData = (data) => {
    const modo = Number.isInteger(data.modo) ? data.modo : Math.round(data.modo);

    const point = new Point('sensor_data')
        .floatField('AngleRoll', data.AngleRoll || 0)
        .floatField('AnglePitch', data.AnglePitch || 0)
        .floatField('AngleYaw', data.AngleYaw || 0)
        .floatField('RateRoll', data.RateRoll || 0)
        .floatField('RatePitch', data.RatePitch || 0)
        .floatField('RateYaw', data.RateYaw || 0)
        .floatField('AccX', data.AccX || 0)
        .floatField('AccY', data.AccY || 0)
        .floatField('AccZ', data.AccZ || 0)
        .floatField('GyroXdps', data.GyroXdps || 0)
        .floatField('GyroYdps', data.GyroYdps || 0)
        .floatField('GyroZdps', data.GyroZdps || 0)
        .floatField('KalmanAngleRoll', data.KalmanAngleRoll || 0)
        .floatField('KalmanAnglePitch', data.KalmanAnglePitch || 0)
        .floatField('MotorInput1', data.MotorInput1 || 0)
        .floatField('MotorInput2', data.MotorInput2 || 0)
        .floatField('MotorInput3', data.MotorInput3 || 0)
        .floatField('MotorInput4', data.MotorInput4 || 0)
        .intField('switch_state', modo) // Ahora asegura que el modo se almacene correctamente
        .booleanField('led_status', data.led_status || false)
        .booleanField('motor_status', data.motor_status || false);

    // Escribir en InfluxDB
    writeApi.writePoint(point);
    console.log('🔹 Modo almacenado en InfluxDB:', modo);
};

// Función para cerrar la conexión de escritura
export const closeConnection = () => {
    writeApi.close().then(() => {
        console.log('Conexión de escritura a InfluxDB cerrada.');
    });
};

// Opcional: Función para leer datos de InfluxDB (si es necesario)
export const querySensorData = async (query) => {
    const rows = await queryApi.collectRows(query);
    console.log('Datos consultados desde InfluxDB:', rows);
    return rows;
};