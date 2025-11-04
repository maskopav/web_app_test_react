//src/context/ProtocolContext.jsx
import { createContext, useState } from "react";

export const ProtocolContext = createContext();

export function ProtocolProvider({ children }) {
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  return (
    <ProtocolContext.Provider value={{ selectedProtocol, setSelectedProtocol }}>
      {children}
    </ProtocolContext.Provider>
  );
}
