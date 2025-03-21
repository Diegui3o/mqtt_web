export const influxConfig = {
    url: process.env.INFLUX_URL || 'http://localhost:8086',
    token: process.env.INFLUX_TOKEN || 'OkMPY3kYx5m9FIRvgLkBZjX_EbiZ187lZWkoX2HY3Oi4heONcNgogn8RlF_JChqnVOY0nJQrqNpc5lvmpPg_2A==',
    org: process.env.INFLUX_ORG || 'UNSA',
    bucket: process.env.INFLUX_BUCKET || 'Drone_IRIS',
};
