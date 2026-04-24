import React, { useState } from "react";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { MobileMenu } from "./components/MobileMenu";
import { useSensorData } from "./hooks/useSensorData";
export function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: sensorData, loading, error, refetch } = useSensorData();
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <Header
        onMenuClick={() => setIsMobileMenuOpen(true)}
        onRefresh={refetch}
        hasError={!!error} />
      
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)} />
      
      <Dashboard sensorData={sensorData} isLoading={loading} error={error} />
    </div>);

}