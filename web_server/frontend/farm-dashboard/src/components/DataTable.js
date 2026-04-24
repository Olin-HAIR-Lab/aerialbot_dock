export const DataTable = ({ sensorData }) => {
  if (!sensorData.length) {
    return <p className="text-center text-gray-400 py-10">No sensor data available.</p>;
  }

  const statusStyle = (status) => {
    if (status === "Normal") return "bg-green-100 text-green-800";
    if (status === "Low")    return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["Timestamp", "Location", "Temp (°C)", "Moisture (%)", "Humidity (%)", "pH", "Battery (%)", "Signal (%)", "Status"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {sensorData.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                {new Date(row.timestamp).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-800">{row.location_id ?? "—"}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.temperature ?? "—"}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.soil_moisture ?? "—"}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.humidity ?? "—"}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.ph_level ?? "—"}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.battery_level ?? "—"}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{row.signal_strength ?? "—"}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusStyle(row.status)}`}>
                  {row.status ?? "—"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
