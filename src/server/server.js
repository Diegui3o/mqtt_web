// routes/sensor.js
import express from 'express';
import { querySensorData } from '../service/database.js';

const router = express.Router();

router.get('/datos', async (req, res) => {
    const query = `from(bucket: "Drone_IRIS")
    |> range(start: -2m)
    |> filter(fn: (r) => r._measurement == "sensor_data")
    |> filter(fn: (r) => r._field == "AngleRoll")
    |> aggregateWindow(every: 1s, fn: mean, createEmpty: false)
    |> yield(name: "mean")
  `;

    try {
        const rows = await querySensorData(query);
        res.json(rows); // 👈 Esto retorna datos que tu frontend puede usar
    } catch (error) {
        console.error('Error al consultar datos de InfluxDB:', error);
        res.status(500).json({ error: 'Error al consultar InfluxDB' });
    }
});

export default router;
