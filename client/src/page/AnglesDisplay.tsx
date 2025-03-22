import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Card, CardContent } from "../components/ui/Card"; // Corrected import path
<<<<<<< HEAD
import "./AnglesDisplay.css"; // Import the CSS file for neon styling
=======
>>>>>>> 5f824acfbbc60441a94b55e5f2cfa71d368d0975

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
<<<<<<< HEAD
    const socket = io("http://localhost:3002");
=======
    const socket = io("http://localhost:3000");
>>>>>>> 5f824acfbbc60441a94b55e5f2cfa71d368d0975

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
<<<<<<< HEAD
    <Card className="p-4 shadow-lg rounded-lg bg-black neon-card">
      <CardContent>
        <h2 className="neon-text">Drone Angles</h2>
        <p className="label-text">
          Roll: <span className="value-text">{angles.roll.toFixed(2)}</span>
        </p>
        <p className="label-text">
          Pitch: <span className="value-text">{angles.pitch.toFixed(2)}</span>
        </p>
        <p className="label-text">
          Yaw: <span className="value-text">{angles.yaw.toFixed(2)}</span>
        </p>
        <p className="label-text">
          Acceleration X [g]:{" "}
          <span className="value-text">{angles.AccX.toFixed(2)}</span>
        </p>
        <p className="label-text">
          Acceleration Y [g]:{" "}
          <span className="value-text">{angles.AccY.toFixed(2)}</span>
        </p>
        <p className="label-text">
          Acceleration Z [g]:{" "}
          <span className="value-text">{angles.AccZ.toFixed(2)}</span>
        </p>
        <p className="label-text">
          Rate Roll:{" "}
          <span className="value-text">{angles.RateRoll.toFixed(2)}</span>
        </p>
        <p className="label-text">
          Rate Pitch:{" "}
          <span className="value-text">{angles.RatePitch.toFixed(2)}</span>
        </p>
        <p className="label-text">
          Rate Yaw:{" "}
          <span className="value-text">{angles.RateYaw.toFixed(2)}</span>
        </p>
        <p className="label-text">
          GyroXdps:{" "}
          <span className="value-text">{angles.GyroXdps.toFixed(2)}</span>
        </p>
        <p className="label-text">
          GyroYdps:{" "}
          <span className="value-text">{angles.GyroYdps.toFixed(2)}</span>
        </p>
        <p className="label-text">
          GyroZdps:{" "}
          <span className="value-text">{angles.GyroZdps.toFixed(2)}</span>
        </p>
        <p className="label-text">
          KalmanAngleRoll:{" "}
          <span className="value-text">
            {angles.KalmanAngleRoll.toFixed(2)}
          </span>
        </p>
        <p className="label-text">
          KalmanAnglePitch:{" "}
          <span className="value-text">
            {angles.KalmanAnglePitch.toFixed(2)}
          </span>
        </p>
        <p className="label-text">
          MotorInput1:{" "}
          <span className="value-text">{angles.MotorInput1.toFixed(2)}</span>
        </p>
        <p className="label-text">
          MotorInput2:{" "}
          <span className="value-text">{angles.MotorInput2.toFixed(2)}</span>
        </p>
        <p className="label-text">
          MotorInput3:{" "}
          <span className="value-text">{angles.MotorInput3.toFixed(2)}</span>
        </p>
        <p className="label-text">
          MotorInput4:{" "}
          <span className="value-text">{angles.MotorInput4.toFixed(2)}</span>
        </p>
        <p className="label-text">
          Altura actual:{" "}
          <span className="value-text">{angles.distancia.toFixed(2)}</span>
        </p>
        <p className="label-text">
          Modo actual:{" "}
          <span className="value-text">{angles.modo.toFixed(2)}</span>
        </p>
=======
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
>>>>>>> 5f824acfbbc60441a94b55e5f2cfa71d368d0975
      </CardContent>
    </Card>
  );
};

export default DroneAngles;
