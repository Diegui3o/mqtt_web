import pg from 'pg';

const pool = new pg.Pool({
    host: 'localhost',
    port: 8812,
    user: 'admin',
    password: 'quest',
    database: 'qdb',
});

function safe(value) {
    return value === undefined || value === null ? 'NULL' : value;
}

async function executeQueryWithRetry(query, retries = 5, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            await pool.query(query);
            return;
        } catch (error) {
            if (error.code === '00000' && error.message.includes('table busy')) {
                console.warn(`⚠️ Table busy, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                //console.error('❌ Insert error:', error.message);
                throw error;
            }
        }
    }
    throw new Error('❌ Max retries reached, could not execute query');
}

// Exporta la función insertSensorData solo una vez
export async function insertSensorData(data, modo) {
    const time = new Date().toISOString();

    const {
        AngleRoll, AnglePitch, AngleYaw,
        RateRoll, RatePitch, RateYaw,
        AccX, AccY, AccZ,
        GyroXdps, GyroYdps, GyroZdps,
        KalmanAngleRoll, KalmanAnglePitch,
        MotorInput1, MotorInput2, MotorInput3, MotorInput4
    } = data;

    const query = `
        INSERT INTO sensor_data (
            time, roll, pitch, yaw,
            rate_roll, rate_pitch, rate_yaw,
            acc_x, acc_y, acc_z,
            gyro_x, gyro_y, gyro_z,
            kalman_roll, kalman_pitch,
            motor_1, motor_2, motor_3, motor_4,
            modo
        ) VALUES (
            '${time}', ${safe(AngleRoll)}, ${safe(AnglePitch)}, ${safe(AngleYaw)},
            ${safe(RateRoll)}, ${safe(RatePitch)}, ${safe(RateYaw)},
            ${safe(AccX)}, ${safe(AccY)}, ${safe(AccZ)},
            ${safe(GyroXdps)}, ${safe(GyroYdps)}, ${safe(GyroZdps)},
            ${safe(KalmanAngleRoll)}, ${safe(KalmanAnglePitch)},
            ${safe(MotorInput1)}, ${safe(MotorInput2)}, ${safe(MotorInput3)}, ${safe(MotorInput4)},
            ${safe(modo)}
        )
    `;
    try {
        await executeQueryWithRetry(query);
    } catch (err) {
        //console.error("❌ Insert error:", err.message);
    }
}

// Exporta la función insertControlState
export async function insertControlState(modo, ledStatus, motorStatus) {
    const time = new Date().toISOString();
    const query = `
        INSERT INTO control_state (time, modo, led_status, motor_status)
        VALUES ('${time}', ${safe(modo)}, ${safe(ledStatus)}, ${safe(motorStatus)})
    `;
    try {
        await executeQueryWithRetry(query);
    } catch (err) {
        //console.error("❌ Insert error:", err.message);
    }
}