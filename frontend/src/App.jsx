// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProjectDashboardPage from "./pages/ProjectDashboardPage";
import ProtocolDashboardPage from "./pages/ProtocolDashboardPage";
import ProtocolEditorPage from "./pages/ProtocolEditorPage";
// import ParticipantManagerPage from "./pages/ParticipantManagerPage";
// import DataExplorerPage from "./pages/DataExplorerPage";
// import MasterDashboardPage from "./pages/MasterDashboardPage";
import ParticipantInterfacePage from "./pages/ParticipantInterfacePage";
import ParticipantInterfaceLoader from "./pages/ParticipantInterfaceLoader";
import ParticipantDashboardPage from "./pages/ParticipantDashboardPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      {/* Temporary testing routes */}
      <Route path="/" element={<Navigate to="/projects/1" replace />} />
      <Route path="/projects/:projectId" element={<ProjectDashboardPage />} />
      <Route path="/projects/:projectId/participants" element={<ParticipantDashboardPage />} />
      <Route path="/projects/:projectId/protocols" element={<ProtocolDashboardPage />} />
      <Route path="/projects/:projectId/protocols/:protocolId" element={<ProtocolEditorPage />} />
      <Route path="/participant/test" element={<ParticipantInterfacePage />} />
      <Route path="/participant/interface" element={<ParticipantInterfacePage />} />
      <Route path="/participant/:token" element={<ParticipantInterfaceLoader />} />


      {/* Public routes  
      <Route path="/login" element={<Login />} />
      <Route path="/participant/:token" element={<ParticipantInterfacePage />} />

      {/* Admin routes
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/project/:projectId" element={<ProjectDashboardPage />} />
      <Route path="/admin/project/:projectId/protocols/:protocolId" element={<ProtocolEditorPage />} />
      <Route path="/data" element={<DataExplorerPage />} />
      <Route path="/participants" element={<ParticipantManagerPage />} />

      {/* Master routes 
      <Route path="/master" element={<MasterDashboardPage />} />

      */}


      {/* Fallback */}
      <Route path="*" element={<NotFoundPage/>} />
    </Routes>
  );
}
