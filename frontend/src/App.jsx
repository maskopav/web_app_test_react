// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import ProjectDashboard from "./pages/ProjectDashboard";
import ProtocolDashboard from "./pages/ProtocolDashboard";
import ProtocolEditor from "./pages/ProtocolEditor";
// import ParticipantManager from "./pages/ParticipantManager";
// import DataExplorer from "./pages/DataExplorer";
// import MasterDashboard from "./pages/MasterDashboard";
import ParticipantInterface from "./pages/ParticipantInterface";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Temporary testing routes */}
      <Route path="/" element={<Navigate to="/projects/demo" replace />} />
      <Route path="/projects/:projectId" element={<ProjectDashboard />} />
      <Route path="/projects/:projectId/protocols" element={<ProtocolDashboard />} />
      <Route path="/projects/:projectId/protocols/:protocolId" element={<ProtocolEditor />} />
      <Route path="/participant/test" element={<ParticipantInterface />} />

      {/* Public routes  
      <Route path="/login" element={<Login />} />
      <Route path="/participant/:token" element={<ParticipantInterface />} />

      {/* Admin routes
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/project/:projectId" element={<ProjectDashboard />} />
      <Route path="/admin/project/:projectId/protocols/:protocolId" element={<ProtocolEditorPage />} />
      <Route path="/data" element={<DataExplorer />} />
      <Route path="/participants" element={<ParticipantManager />} />

      {/* Master routes 
      <Route path="/master" element={<MasterDashboard />} />

      */}


      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
