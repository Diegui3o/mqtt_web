import React from "react";

export default function Settings() {
  return (
    <div className="p-6 text-white max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">⚙️ Configuración del Dron</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sección de Conexión */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">🔗 Conexión</h2>
          <div className="space-y-3">
            <div>
              <label className="block mb-1">Dirección IP</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-700 text-white"
                defaultValue="192.168.1.1"
              />
            </div>
            <div>
              <label className="block mb-1">Puerto</label>
              <input
                type="number"
                className="w-full p-2 rounded bg-gray-700 text-white"
                defaultValue="3002"
              />
            </div>
          </div>
        </div>

        {/* Sección de Controles */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">🎮 Controles</h2>
          <div className="space-y-3">
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                Invertir eje Y
              </label>
            </div>
            <div>
              <label className="block mb-1">Sensibilidad</label>
              <input
                type="range"
                min="1"
                max="10"
                defaultValue="5"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Sección de Motores */}
        <div className="bg-gray-800 p-4 rounded-lg md:col-span-2">
          <h2 className="text-xl font-semibold mb-3">
            ✈️ Configuración de Motores
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((motor) => (
              <div key={motor} className="bg-gray-700 p-3 rounded">
                <h3 className="font-medium mb-2">Motor {motor}</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm">Velocidad mínima</label>
                    <input
                      type="number"
                      className="w-full p-1 rounded bg-gray-600 text-white"
                      defaultValue="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Velocidad máxima</label>
                    <input
                      type="number"
                      className="w-full p-1 rounded bg-gray-600 text-white"
                      defaultValue="2000"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition">
          Guardar Configuración
        </button>
      </div>
    </div>
  );
}
