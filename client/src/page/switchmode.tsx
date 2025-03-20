import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3002");

const ModeSwitch = () => {
  const [modo, setModo] = useState<number>(1);

  const cambiarModo = async (nuevoModo: number) => {
    try {
      const response = await fetch(`http://localhost:3002/modo/${nuevoModo}`);
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Respuesta del servidor:", data.message);
      // No es necesario llamar a setModo aquí, ya que el servidor emitirá el nuevo modo a través de WebSocket
    } catch (error) {
      console.error("Error cambiando el modo:", error);
    }
  };

  useEffect(() => {
    socket.on("modo", (nuevoModo: number) => {
      console.log("Modo actualizado desde el servidor:", nuevoModo);
      setModo(nuevoModo);
    });

    return () => {
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
        value={modo !== null && modo !== undefined ? modo : 1}
        onChange={(e) => {
          console.log("Modo seleccionado:", e.target.value);
          cambiarModo(Number(e.target.value));
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
