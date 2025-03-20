import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import axios from "axios";

// Extend the JSX namespace to include Three.js elements
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: JSX.IntrinsicElements["mesh"];
      planeGeometry: JSX.IntrinsicElements["planeGeometry"];
      meshPhongMaterial: JSX.IntrinsicElements["meshPhongMaterial"];
      directionalLight: JSX.IntrinsicElements["directionalLight"];
      group: JSX.IntrinsicElements["group"];
      ambientLight: JSX.IntrinsicElements["ambientLight"];
      primitive: JSX.IntrinsicElements["primitive"];
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

// Componente para cargar el modelo 3D del dron
function DroneModel() {
  const [model, setModel] = useState<THREE.Object3D | null>(null);
  const droneRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const loader = new THREE.ObjectLoader();
    loader.load("/models/base(2).json", (obj) => setModel(obj));
  }, []);

  // Actualizar la rotación del dron
  useFrame(({ clock }: { clock: THREE.Clock }) => {
    if (droneRef.current) {
      droneRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return model ? <primitive object={model} ref={droneRef} scale={1} /> : null;
}

// Componente principal de la escena 3D
export default function Dron3DView() {
  const [angles, setAngles] = useState({ roll: 0, pitch: 0, yaw: 0 });

  // Cargar textura del suelo
  const groundTexture = useTexture("/images/grass.jpg");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/receive_data/");
        if (response.status === 200) {
          setAngles({
            roll: THREE.MathUtils.degToRad(response.data.AngleRoll),
            pitch: THREE.MathUtils.degToRad(response.data.AnglePitch),
            yaw: THREE.MathUtils.degToRad(response.data.AngleYaw),
          });
        }
      } catch (error) {
        console.error("Error fetching drone data:", error);
      }
    };

    const interval = setInterval(fetchData, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
        <OrbitControls enableDamping dampingFactor={0.05} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
        {/* Suelo */}
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshPhongMaterial map={groundTexture} />
        </mesh>
        {/* Modelo del dron */}
        <group rotation={[angles.pitch, angles.yaw, angles.roll]}>
          <DroneModel />
        </group>
      </Canvas>
      {/* Panel de información */}
      <div className="info-panel">
        <h3>Estado del DRON</h3>
        <p>Roll: {angles.roll.toFixed(2)}°</p>
        <p>Pitch: {angles.pitch.toFixed(2)}°</p>
        <p>Yaw: {angles.yaw.toFixed(2)}°</p>
      </div>
    </div>
  );
}
