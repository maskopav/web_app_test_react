// src/context/AppProvider.jsx
import React from "react";
//import { UserProvider } from "./UserContext";
import { MappingProvider } from "./MappingContext";
import { ProtocolProvider } from "./ProtocolContext";
//import { RecorderProvider } from "./RecorderContext";
//import { UIStateProvider } from "./UIStateContext";
import { ConfirmDialogProvider } from "../components/ConfirmDialog/ConfirmDialogContext";

export const AppProvider = ({ children }) => {
  const mappingTables = ["projects", "protocols", "task_types", "languages", "tasks"]; // mapping tables called globally once

  return (
      <MappingProvider tables={mappingTables}>
        <ProtocolProvider>
          {/*<RecorderProvider> */}
            {/*<UIStateProvider> */}
            <ConfirmDialogProvider>
              {children}
            </ConfirmDialogProvider>
            {/*</UIStateProvider> */}
          {/*</RecorderProvider> */}
        </ProtocolProvider>
      </MappingProvider>
  );
};
