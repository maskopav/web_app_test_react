// src/context/MappingContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getMappings } from "../api/mappings";

const MappingContext = createContext();

export function MappingProvider({ children, tables = [] }) {
  const [mappings, setMappings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMappings(tables);
        setMappings(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tables]);

  return (
    <MappingContext.Provider value={{ mappings, loading, error }}>
      {children}
    </MappingContext.Provider>
  );
}

export function useMappings() {
  return useContext(MappingContext);
}
