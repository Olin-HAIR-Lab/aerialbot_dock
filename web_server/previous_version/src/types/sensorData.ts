export interface SensorData {
  id: number;
  location: string;
  type: string;
  value: string;
  status: "Normal" | "Low" | "High";
  timestamp: string;
}
export interface ApiResponse {
  data: SensorData[];
  success: boolean;
  error?: string;
}