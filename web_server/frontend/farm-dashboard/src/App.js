import { useState, useEffect } from "react";
import "./App.css";  // Importing external CSS

function App() {
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/data`)
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);
        
        if (Array.isArray(data)) {
          setSensorData(data);
        } else {
          console.error("Unexpected API response:", data);
          setSensorData([]);
        }
      })
      .catch((error) => console.error("Error fetching sensor data:", error));
  }, []);

  return (
    <div className="container">
      <h1 className="heading">🌱 Farm Sensor Data Dashboard</h1>
      
      {sensorData.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Temperature (°C)</th>
              <th>Soil Moisture (%)</th>
              <th>Humidity (%)</th>
              <th>pH Level</th>
            </tr>
          </thead>
          <tbody>
            {sensorData.map((sensor, index) => (
              <tr key={index}>
                <td>{sensor.timestamp.replace("T", " ")}</td>  {/* Format Timestamp */}
                <td>{sensor.temperature ?? "No data"}</td>
                <td>{sensor.soil_moisture ?? "No data"}</td>
                <td>{sensor.humidity ?? "No data"}</td>
                <td>{sensor.ph_level ?? "No data"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-data-text">No sensor data available.</p>
      )}
    </div>
  );
}

export default App;
