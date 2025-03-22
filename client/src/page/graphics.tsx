import AnglesDisplay from "./AnglesDisplay";
import SensorChart from "./data_rec";

export default function Graphics() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold">📊 Gráficos de Telemetría</h1>
      <p>Monitoriza datos como altura, velocidad y orientación.</p>
      <div>
        <h2>Visualización de Ángulos</h2>
        <AnglesDisplay />
      </div>
      <div>
        <h2>Dashboards</h2>
        <SensorChart />
      </div>
    </div>
  );
}
