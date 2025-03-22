import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3002");

const ModeSwitch = () => {
  const [modo, setModo] = useState<number>(1);

<<<<<<< HEAD
  const fetchCurrentMode = async () => {
    try {
      const response = await fetch("http://localhost:3002/modo/actual", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const data = await response.json();

      // Verifica si la respuesta es un objeto y si tiene la propiedad "modo"
      if (data && typeof data === "object" && "modo" in data) {
        setModo(data.modo);
        console.log("Modo actual:", data.modo);
      } else {
        throw new Error("Respuesta del servidor no válida");
      }
    } catch (error) {
      console.error("Error obteniendo el modo actual:", error);
    }
  };

  const cambiarModo = async (nuevoModo: number) => {
    try {
      console.log(`Enviando solicitud para cambiar a modo ${nuevoModo}...`);

      const response = await fetch(`http://localhost:3002/modo/${nuevoModo}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const data = await response.json();

      // Verifica si la respuesta es un objeto y si tiene la propiedad "message"
      if (data && typeof data === "object" && "message" in data) {
        console.log("Respuesta del servidor:", data.message);
      } else {
        throw new Error("Respuesta del servidor no válida");
      }
=======
  const cambiarModo = async (nuevoModo: number) => {
    try {
      const response = await fetch(`http://localhost:3002/modo/${nuevoModo}`);
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Respuesta del servidor:", data.message);
      // No es necesario llamar a setModo aquí, ya que el servidor emitirá el nuevo modo a través de WebSocket
>>>>>>> 5f824acfbbc60441a94b55e5f2cfa71d368d0975
    } catch (error) {
      console.error("Error cambiando el modo:", error);
    }
  };

  useEffect(() => {
<<<<<<< HEAD
    fetchCurrentMode();
    console.log("📡 Suscribiéndose al evento 'modo'...");

    socket.on("modo", (nuevoModo: number | null) => {
      // Verifica si el nuevoModo es un número válido (0, 1 o 2)
      if (nuevoModo !== null && [0, 1, 2].includes(nuevoModo)) {
        console.log("✅ Modo actualizado desde el servidor:", nuevoModo);
        setModo(nuevoModo);
      } else {
        console.warn("⚠️ Se recibió un modo inválido o null, ignorando...");
      }
    });

    return () => {
      console.log("🔄 Desuscribiéndose del evento 'modo'");
=======
    socket.on("modo", (nuevoModo: number) => {
      console.log("Modo actualizado desde el servidor:", nuevoModo);
      setModo(nuevoModo);
    });

    return () => {
>>>>>>> 5f824acfbbc60441a94b55e5f2cfa71d368d0975
      socket.off("modo");
    };
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-white mb-4">
        Modo Actual: {modo}
      </h2>
      <select
        className="bg-gray-700 text-white p-2 border border-gray-600 rounded-md"
<<<<<<< HEAD
        value={modo}
        onChange={(e) => {
          const nuevoModo = Number(e.target.value);

          // Verifica si el nuevoModo es válido
          if ([0, 1, 2].includes(nuevoModo)) {
            console.log("🔄 Modo seleccionado:", nuevoModo);
            cambiarModo(nuevoModo);
          } else {
            console.warn("⚠️ Modo seleccionado no válido, ignorando...");
          }
=======
        value={modo !== null && modo !== undefined ? modo : 1}
        onChange={(e) => {
          console.log("Modo seleccionado:", e.target.value);
          cambiarModo(Number(e.target.value));
>>>>>>> 5f824acfbbc60441a94b55e5f2cfa71d368d0975
        }}
      >
        <option value={0}>Modo 0 - Encender Motores</option>
        <option value={1}>Modo 1 - Espera</option>
        <option value={2}>Modo 2 - Apagar Motores</option>
      </select>
    </div>
  );
};

export default ModeSwitch;
