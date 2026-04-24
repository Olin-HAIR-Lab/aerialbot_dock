import { useState, useEffect, useCallback } from "react";
import { AlertCircle } from "lucide-react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { MobileMenu } from "./components/MobileMenu";
import { MetricCards } from "./components/MetricCards";
import { SystemStatus } from "./components/SystemStatus";
import { DataTable } from "./components/DataTable";
import { FieldMap } from "./components/FieldMap";
import { AnalyticsCharts } from "./components/AnalyticsCharts";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000";
const REFRESH_INTERVAL = 30000;

export default function App() {
  const [view, setView] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [sensorData, setSensorData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [stats, setStats] = useState([]);
  const [pingData, setPingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setError(null);
      const [dataRes, locRes, statsRes, pingRes] = await Promise.all([
        fetch(`${API}/api/data?limit=100`),
        fetch(`${API}/api/locations?active_only=false`),
        fetch(`${API}/api/stats/daily`),
        fetch(`${API}/ping`),
      ]);
      const [data, locs, dailyStats, ping] = await Promise.all([
        dataRes.json(),
        locRes.json(),
        statsRes.json(),
        pingRes.json(),
      ]);
      setSensorData(Array.isArray(data) ? data : []);
      setLocations(Array.isArray(locs) ? locs : []);
      setStats(Array.isArray(dailyStats) ? [...dailyStats].reverse() : []);
      setPingData(ping);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [fetchAll]);

  const latest = sensorData[0] ?? null;
  const alertCount = sensorData.filter((d) => d.status && d.status !== "Normal").length;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-5 text-red-700">
          <AlertCircle size={20} />
          <div>
            <p className="font-semibold">Failed to load data</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </div>
      );
    }

    if (view === "Dashboard") {
      return (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Farm Overview</h1>
            <p className="text-sm text-gray-500">Live sensor data from all field locations</p>
          </div>
          <MetricCards sensorData={sensorData} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <FieldMap locations={locations} sensorData={sensorData} />
            </div>
            <div className="lg:col-span-1">
              <SystemStatus latest={latest} pingData={pingData} alertCount={alertCount} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
              Recent Readings
            </h2>
            <DataTable sensorData={sensorData.slice(0, 10)} />
          </div>
        </div>
      );
    }

    if (view === "Fields") {
      return (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Field Locations</h1>
            <p className="text-sm text-gray-500">{locations.length} active sites</p>
          </div>
          <FieldMap locations={locations} sensorData={sensorData} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((loc) => {
              const latest = sensorData.find((d) => d.location_id === loc.id);
              return (
                <div key={loc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{loc.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{loc.crop_type} · {loc.area_size} ha</p>
                      <p className="text-xs text-gray-400">{loc.description}</p>
                    </div>
                    {latest && (
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        latest.status === "Normal" ? "bg-green-100 text-green-700" :
                        latest.status === "Low"    ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {latest.status}
                      </span>
                    )}
                  </div>
                  {latest && (
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <span>🌡 {parseFloat(latest.temperature).toFixed(1)}°C</span>
                      <span>💧 {parseFloat(latest.soil_moisture).toFixed(1)}%</span>
                      <span>💨 {parseFloat(latest.humidity).toFixed(1)}%</span>
                      <span>⚗️ pH {parseFloat(latest.ph_level).toFixed(1)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (view === "Analytics") {
      return (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Analytics</h1>
            <p className="text-sm text-gray-500">Daily averages over the last {stats.length} days</p>
          </div>
          {stats.length > 0 ? (
            <AnalyticsCharts stats={stats} />
          ) : (
            <p className="text-center text-gray-400 py-10">No analytics data available yet.</p>
          )}
        </div>
      );
    }

    if (view === "Data") {
      return (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Sensor Data</h1>
            <p className="text-sm text-gray-500">{sensorData.length} records</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <DataTable sensorData={sensorData} />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setMobileOpen(true)} onRefresh={fetchAll} />

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        active={view}
        onNavigate={setView}
      />

      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-20">
          <Sidebar active={view} onNavigate={setView} />
        </aside>

        {/* Main content */}
        <main className="flex-1 md:ml-64 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
