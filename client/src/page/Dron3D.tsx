import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { io } from "socket.io-client"; // Import io from socket.io-client

// Cargar modelo OBJ
function Drone() {
  const droneRef = useRef<THREE.Group>(null);
  const obj = useLoader(OBJLoader, "/src/models/base(2).obj"); // Update the path to the model file
  const [angles, setAngles] = useState({ roll: 0, pitch: 0, yaw: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const socket = io("http://localhost:3002"); // Ensure this matches the server port
        socket.on("angles", (data) => {
          setAngles({
            roll: THREE.MathUtils.degToRad(data.AngleRoll),
            pitch: THREE.MathUtils.degToRad(data.AnglePitch),
            yaw: THREE.MathUtils.degToRad(data.AngleYaw),
          });
        });
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    };

    const interval = setInterval(fetchData, 100);
    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    if (droneRef.current) {
      droneRef.current.rotation.set(angles.pitch, angles.yaw, angles.roll);
    }
  });

  useEffect(() => {
    if (obj) {
      console.log("Model loaded:", obj);
    } else {
      console.error("Failed to load model");
    }
  }, [obj]);

  return (
    <primitive ref={droneRef} object={obj} scale={1} position={[0, 0, 0]} />
  );
}

// Escena principal
export default function Dron3D() {
  return (
<<<<<<< HEAD
    <div style={{ width: "70vw", height: "70vh" }}>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
=======
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 75 }}>
>>>>>>> 5f824acfbbc60441a94b55e5f2cfa71d368d0975
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} castShadow intensity={1.5} />
        <OrbitControls />
        <Drone />
      </Canvas>
    </div>
  );
}
