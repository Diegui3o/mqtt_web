import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Card, CardContent } from "../components/ui/Card"; // Corrected import path

const DroneAngles = () => {
  const [angles, setAngles] = useState<{
    roll: number;
    pitch: number;
    yaw: number;
    RateRoll: number;
    RatePitch: number;
    RateYaw: number;
    AccX: number;
    AccY: number;
    AccZ: number;
    GyroXdps: number;
    GyroYdps: number;
    GyroZdps: number;
    KalmanAngleRoll: number;
    KalmanAnglePitch: number;
    MotorInput1: number;
    MotorInput2: number;
    MotorInput3: number;
    MotorInput4: number;
    distancia: number;
    modo: number;
  }>({
    roll: 0,
    pitch: 0,
    yaw: 0,
    RateRoll: 0,
    RatePitch: 0,
    RateYaw: 0,
    AccX: 0,
    AccY: 0,
    AccZ: 0,
    GyroXdps: 0,
    GyroYdps: 0,
    GyroZdps: 0,
    KalmanAngleRoll: 0,
    KalmanAnglePitch: 0,
    MotorInput1: 0,
    MotorInput2: 0,
    MotorInput3: 0,
    MotorInput4: 0,
    distancia: 0,
    modo: 0,
  });

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("angles", (data) => {
      // console.log("📡 Datos recibidos:", data);
      setAngles((prevAngles) => ({
        ...prevAngles,
        roll: data?.AngleRoll ?? prevAngles.roll,
        pitch: data?.AnglePitch ?? prevAngles.pitch,
        yaw: data?.AngleYaw ?? prevAngles.yaw,
        RateRoll: data?.RateRoll ?? prevAngles.RateRoll,
        RatePitch: data?.RatePitch ?? prevAngles.RatePitch,
        RateYaw: data?.RateYaw ?? prevAngles.RateYaw,
        AccX: data?.AccX ?? prevAngles.AccX,
        AccY: data?.AccY ?? prevAngles.AccY,
        AccZ: data?.AccZ ?? prevAngles.AccZ,
        GyroXdps: data?.GyroXdps ?? prevAngles.GyroXdps,
        GyroYdps: data?.GyroYdps ?? prevAngles.GyroYdps,
        GyroZdps: data?.GyroZdps ?? prevAngles.GyroZdps,
        KalmanAngleRoll: data?.KalmanAngleRoll ?? prevAngles.KalmanAngleRoll,
        KalmanAnglePitch: data?.KalmanAnglePitch ?? prevAngles.KalmanAnglePitch,
        MotorInput1: data?.MotorInput1 ?? prevAngles.MotorInput1,
        MotorInput2: data?.MotorInput2 ?? prevAngles.MotorInput2,
        MotorInput3: data?.MotorInput3 ?? prevAngles.MotorInput3,
        MotorInput4: data?.MotorInput4 ?? prevAngles.MotorInput4,
        distancia: data?.distancia ?? prevAngles.distancia,
        modo: data?.modo ?? prevAngles.modo,
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Card className="p-4 shadow-lg rounded-lg bg-white">
      <CardContent>
        <p>Roll: {angles.roll.toFixed(2)}</p>
        <p>Pitch: {angles.pitch.toFixed(2)}</p>
        <p>Yaw: {angles.yaw.toFixed(2)}</p>
        <p>Acceleration X [g]: {angles.AccX.toFixed(2)}</p>
        <p>Acceleration Y [g]: {angles.AccY.toFixed(2)}</p>
        <p>Acceleration Z [g]: {angles.AccZ.toFixed(2)}</p>
        <p>Rate Roll: {angles.RateRoll.toFixed(2)}</p>
        <p>Rate Pitch: {angles.RatePitch.toFixed(2)}</p>
        <p>Rate Yaw: {angles.RateYaw.toFixed(2)}</p>
        <p>GyroXdps: {angles.GyroXdps.toFixed(2)}</p>
        <p>GyroYdps: {angles.GyroYdps.toFixed(2)}</p>
        <p>GyroZdps: {angles.GyroZdps.toFixed(2)}</p>
        <p>KalmanAngleRoll: {angles.KalmanAngleRoll.toFixed(2)}</p>
        <p>KalmanAnglePitch: {angles.KalmanAnglePitch.toFixed(2)}</p>
        <p>MotorInput1: {angles.MotorInput1.toFixed(2)}</p>
        <p>MotorInput2: {angles.MotorInput2.toFixed(2)}</p>
        <p>MotorInput3: {angles.MotorInput3.toFixed(2)}</p>
        <p>MotorInput4: {angles.MotorInput4.toFixed(2)}</p>
        <p>Altura actual: {angles.distancia.toFixed(2)}</p>
        <p>Modo actual: {angles.modo.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
};

export default DroneAngles;
