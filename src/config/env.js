import { config } from 'dotenv';
import pkg from 'env-var';
const { get } = pkg;

config();

export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    PUBLIC_PATH: get('PUBLIC_PATH').default('public').asString(),
    MQTT_BROKER_URL: get('MQTT_BROKER_URL').required().asString(),
    CONTROL_TOPIC: get('CONTROL_TOPIC').required().asString(),
    ANGLES_TOPIC: get('ANGLES_TOPIC').required().asString(),
    RATES_TOPIC: get('RATES_TOPIC').required().asString(),
    ACC_TOPIC: get('ACC_TOPIC').required().asString(),
    GYRO_TOPIC: get('GYRO_TOPIC').required().asString(),
    KALMAN_TOPIC: get('KALMAN_TOPIC').required().asString(),
    MOTORS_TOPIC: get('MOTORS_TOPIC').required().asString(),
    MODE_TOPIC: get('MODE_TOPIC').required().asString(),
};