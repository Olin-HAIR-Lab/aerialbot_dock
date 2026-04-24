import React from "react";
import { Sidebar } from "./Sidebar";
import { MetricCards } from "./MetricCards";
import { FieldMap } from "./FieldMap";
import { DataTable } from "./DataTable";
import { SystemStatus } from "./SystemStatus";
import { SensorData } from "../types/sensorData";
import { AlertCircle, Loader2 } from "lucide-react";
interface DashboardProps {
  sensorData: SensorData[];
  isLoading: boolean;
  error: string | null;
}
export const Dashboard = ({ sensorData, isLoading, error }: DashboardProps) => {
  if (error) {
    return (
      <div className="flex flex-1 w-full items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Error loading data
          </h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      </div>);

  }
  if (isLoading) {
    return (
      <div className="flex flex-1 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>);

  }
  return (
    <div className="flex flex-1 w-full">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 w-full overflow-x-hidden">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
          Farm Overview
        </h2>
        <MetricCards sensorData={sensorData} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Field Map
              </h3>
              <div className="h-[300px] sm:h-[400px]">
                <FieldMap sensorData={sensorData} />
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                System Status
              </h3>
              <SystemStatus />
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-6">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Sensor Readings
            </h3>
            <DataTable data={sensorData} />
          </div>
        </div>
      </main>
    </div>);

};