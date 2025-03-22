import AnglesDisplay from "./AnglesDisplay";
<<<<<<< HEAD
import SensorChart from "./data_rec";
=======
>>>>>>> 5f824acfbbc60441a94b55e5f2cfa71d368d0975

export default function Graphics() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold">📊 Gráficos de Telemetría</h1>
      <p>Monitoriza datos como altura, velocidad y orientación.</p>
      <div>
        <h2>Visualización de Ángulos</h2>
        <AnglesDisplay />
      </div>
<<<<<<< HEAD
      <div>
        <h2>Dashboards</h2>
        <SensorChart />
      </div>
=======
>>>>>>> 5f824acfbbc60441a94b55e5f2cfa71d368d0975
    </div>
  );
}
