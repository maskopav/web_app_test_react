// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminManagementPage from "./pages/AdminManagementPage";
import ProjectDashboardPage from "./pages/ProjectDashboardPage";
import ProtocolDashboardPage from "./pages/ProtocolDashboardPage";
import ProtocolEditorPage from "./pages/ProtocolEditorPage";
// import DataExplorerPage from "./pages/DataExplorerPage";
import ParticipantInterfacePage from "./pages/ParticipantInterfacePage";
import ParticipantInterfaceLoader from "./pages/ParticipantInterfaceLoader";
import ParticipantDashboardPage from "./pages/ParticipantDashboardPage";
import ParticipantAuthPage from "./pages/ParticipantAuthPage"; 
import ResetPasswordModal from "./components/AuthForm/ResetPasswordModal";
import AdminLoginPage from "./pages/AdminLoginPage";
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

      {/* Public Protocol Link (Login/Signup) */}
      <Route path="/protocol/:token" element={<ParticipantAuthPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordModal />} />

      {/* Admin login */}
      <Route path="/login" element={<AdminLoginPage />} />
      {/* Generic Admin Dashboard (Role-aware) */}
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/management" element={<AdminManagementPage />} />

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
