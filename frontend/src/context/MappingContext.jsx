// src/context/MappingContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getMappings } from "../api/mappings";

const MappingContext = createContext();

export function MappingProvider({ children, tables = [] }) {
  const [mappings, setMappings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMappings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMappings(tables);
      setMappings(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [tables]);

  useEffect(() => {
    loadMappings();
  }, [loadMappings]);

  // Expose manual refresh
  const refreshMappings = async (customTables) => {
    try {
      const data = await getMappings(customTables || tables);
      setMappings(data);
    } catch (err) {
      console.error("Error refreshing mappings:", err);
      setError(err);
    }
  };

  return (
    <MappingContext.Provider value={{ mappings, loading, error, refreshMappings }}>
      {children}
    </MappingContext.Provider>
  );
}

export function useMappings() {
  return useContext(MappingContext);
}
