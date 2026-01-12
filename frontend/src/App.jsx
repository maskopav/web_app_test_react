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
import OnboardingPage from "./pages/OnboardingPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      {/* Default Route*/}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Admin login */}
      <Route path="/login" element={<AdminLoginPage />} />
      <Route path="/setup-account" element={<OnboardingPage />} />

      {/* Admin routes*/} 
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/management" element={<AdminManagementPage />} />
      <Route path="/admin/projects/:projectId" element={<ProjectDashboardPage />} />
      <Route path="/admin/projects/:projectId/participants" element={<ParticipantDashboardPage />} />
      <Route path="/admin/projects/:projectId/protocols" element={<ProtocolDashboardPage />} />
      <Route path="/admin/projects/:projectId/protocols/:protocolId" element={<ProtocolEditorPage />} />
      <Route path="/participant/test" element={<ParticipantInterfacePage />} />
      <Route path="/participant/interface" element={<ParticipantInterfacePage />} />

      {/* Public Protocol Link for participants */}
      <Route path="/protocol/:token" element={<ParticipantAuthPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordModal />} />
      <Route path="/participant/:token" element={<ParticipantInterfaceLoader />} />

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage/>} />
    </Routes>
  );
}
