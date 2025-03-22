import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  LineChart,
  Line,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const socket = io("http://localhost:3002");

interface SensorData {
  time: string;
  value: number;
  pitch: number;
}

const SensorChart = () => {
  const [data, setData] = useState<SensorData[]>([]);

  useEffect(() => {
    socket.on(
      "sensorData",
      (newPoint: { time: number; value: number; pitch: number }) => {
        const formattedPoint = {
          time: new Date(newPoint.time).toLocaleTimeString(),
          value: newPoint.value,
          pitch: newPoint.pitch,
        };

        setData((prev) => {
          const updated = [...prev, formattedPoint];
          return updated.slice(-100); // Mantener solo los últimos 100 puntos
        });
      }
    );

    return () => {
      socket.off("sensorData");
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "350px", marginTop: "20px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 40, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: "#555" }}
            angle={-25}
            textAnchor="end"
            height={60}
          />
          <YAxis
            yAxisId="left"
            label={{
              value: "Roll (°)",
              angle: -90,
              position: "insideLeft",
              offset: -5,
              style: { fill: "#007acc", fontSize: 12 },
            }}
            tick={{ fill: "#007acc", fontSize: 12 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: "Pitch (°)",
              angle: 90,
              position: "insideRight",
              offset: -5,
              style: { fill: "#d84315", fontSize: 12 },
            }}
            tick={{ fill: "#d84315", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ fontSize: 12 }}
            labelStyle={{ fontWeight: "bold" }}
            formatter={(value: number, name: string) => [
              `${value.toFixed(2)}°`,
              name,
            ]}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="value"
            stroke="#007acc"
            strokeWidth={2.5}
            isAnimationActive={false}
            dot={false}
            name="Roll"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="pitch"
            stroke="#d84315"
            strokeWidth={2.5}
            isAnimationActive={false}
            dot={false}
            name="Pitch"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SensorChart;
