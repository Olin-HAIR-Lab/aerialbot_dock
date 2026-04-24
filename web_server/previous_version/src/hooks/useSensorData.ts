import { useState, useEffect } from 'react';
import { SensorData, ApiResponse } from '../types/sensorData';

const API_URL = "/api/data"; // This will work with the Nginx proxy configuration
const REFRESH_INTERVAL = 30000; // Refresh every 30 seconds

export const useSensorData = () => {
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: ApiResponse = await response.json();
      if (Array.isArray(result)) {
        // Handle case where API returns direct array
        setData(result);
      } else if (result.data && Array.isArray(result.data)) {
        // Handle case where API returns wrapped response
        setData(result.data);
      } else {
        throw new Error('Invalid data format received');
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Set up polling interval
    const intervalId = setInterval(fetchData, REFRESH_INTERVAL);
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return { data, loading, error, refetch: fetchData };
};