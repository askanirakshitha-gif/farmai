import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

const BackendStatusContext = createContext({
  isOnline: false,
  isChecking: true,
  latency: null,
  healthData: null,
  error: null,
  apiUrl: '',
  checkStatus: () => {},
});

export const BackendStatusProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [latency, setLatency] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [error, setError] = useState(null);
  const apiUrl = apiService.getBaseUrl();

  const checkStatus = useCallback(async () => {
    setIsChecking(true);
    try {
      const result = await apiService.checkHealth();
      setIsOnline(result.online);
      setLatency(result.latency);
      if (result.online) {
        setHealthData(result.data);
        setError(null);
      } else {
        setHealthData(null);
        setError(result.error);
      }
    } catch (err) {
      setIsOnline(false);
      setLatency(null);
      setHealthData(null);
      setError(err.message || 'Connection failed');
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
    // Periodically re-ping every 25 seconds
    const interval = setInterval(checkStatus, 25000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  return (
    <BackendStatusContext.Provider
      value={{
        isOnline,
        isChecking,
        latency,
        healthData,
        error,
        apiUrl,
        checkStatus,
      }}
    >
      {children}
    </BackendStatusContext.Provider>
  );
};

export const useBackendStatus = () => useContext(BackendStatusContext);
