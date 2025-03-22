<<<<<<< HEAD
import { config } from 'dotenv';
import env from 'env-var';

config();

export const envs = {
    PORT: env.get('PORT').required().asPortNumber(),
    MQTT_BROKER_URL: env.get('MQTT_BROKER_URL').required().asString(),
    CONTROL_TOPIC: env.get('CONTROL_TOPIC').required().asString(),
    ANGLES_TOPIC: env.get('ANGLES_TOPIC').required().asString(),
    RATES_TOPIC: env.get('RATES_TOPIC').required().asString(),
    ACC_TOPIC: env.get('ACC_TOPIC').required().asString(),
    GYRO_TOPIC: env.get('GYRO_TOPIC').required().asString(),
    KALMAN_TOPIC: env.get('KALMAN_TOPIC').required().asString(),
    MOTORS_TOPIC: env.get('MOTORS_TOPIC').required().asString(),
    MODE_TOPIC: env.get('MODE_TOPIC').required().asString(),
};
=======
require('dotenv').config();
const { get } = require('env-var');

const envs = {
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

module.exports = { envs };
>>>>>>> 5f824acfbbc60441a94b55e5f2cfa71d368d0975
