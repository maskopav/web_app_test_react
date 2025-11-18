// src/context/AppProvider.jsx
import React from "react";
//import { UserProvider } from "./UserContext";
import { MappingProvider } from "./MappingContext";
import { ProtocolProvider } from "./ProtocolContext";
//import { RecorderProvider } from "./RecorderContext";
//import { UIStateProvider } from "./UIStateContext";

export const AppProvider = ({ children }) => {
  const mappingTables = ["projects", "protocols", "task_types", "languages", "tasks"]; // mapping tables called globally once

  return (
      <MappingProvider tables={mappingTables}>
        <ProtocolProvider>
          {/*<RecorderProvider> */}
            {/*<UIStateProvider> */}
              {children}
            {/*</UIStateProvider> */}
          {/*</RecorderProvider> */}
        </ProtocolProvider>
      </MappingProvider>
  );
};
