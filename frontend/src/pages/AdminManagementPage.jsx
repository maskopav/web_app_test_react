import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DashboardTopBar from "../components/DashboardTopBar/DashboardTopBar";
import UserTable from "../components/AdminManagement/UserTable";
import UserProjectTable from "../components/AdminManagement/UserProjectTable";
import AssignProjectModal from "../components/AdminManagement/AssignProjectModal";
import AddAdminModal from "../components/AdminManagement/AddAdminModal";
import { fetchProjectsList } from "../api/projects";
import { fetchAllAdmins, toggleAdminActive} from "../api/users";
import { fetchAdminAssignments, assignProjectToUser } from "../api/userProjects";
import "./Pages.css";

export default function AdminManagementPage() {
  const { t } = useTranslation(["admin", "common"]);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserForProject, setSelectedUserForProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);

  const loadData = async () => {
    try {
      const [uData, aData, pData] = await Promise.all([
        fetchAllAdmins(),
        fetchAdminAssignments(),
        fetchProjectsList()
      ]);
      setUsers(uData);
      setAssignments(aData);
      setAllProjects(pData);
    } catch (err) {
      console.error("Management data error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleToggleStatus = async (user_id, current_status) => {
    try {
      await toggleAdminActive(user_id, current_status === 1 ? 0 : 1);
      await loadData(); // Refresh both tables
    } catch (err) {
      alert("Failed to update user status.");
    }
  };

  const handleRemoveAssignment = async (id) => {
    if (window.confirm("Remove this project assignment?")) {
      // API call logic for removal would go here
      console.log("Removing assignment:", id);
    }
  };

  const handleAssignProject = async (user_id, project_id) => {
    try {
      await assignProjectToUser(user_id, project_id);
      setSelectedUserForProject(null);
      await loadData(); // Refresh assignments table
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="app-container"><p>{t("loading", { ns: "common" })}...</p></div>;

  return (
    <div className="dashboard-page">
      <DashboardTopBar onBack={() => navigate("/admin")} />

      <div className="page-header">
        <h1 className="page-title">Admin User Management</h1>
        <p className="project-description">
          Monitor system access and delegate project management permissions.
        </p>
      </div>

      <div className="management-sections"> {/* This class handles the 2.5rem gap */}
        <UserTable 
          users={users} 
          onToggleStatus={handleToggleStatus}
          onEdit={(u) => console.log("Edit", u)}
          onAssignProject={(u) => setSelectedUserForProject(u)}
          onAddClick={() => setIsAddAdminOpen(true)}
        />

        {/* Add the modal component at the bottom */}
        <AddAdminModal 
          open={isAddAdminOpen}
          onClose={() => setIsAddAdminOpen(false)}
          projects={allProjects}
          onSuccess={loadData}
        />

        <UserProjectTable 
          assignments={assignments} 
          onRemove={handleRemoveAssignment}
        />
      </div>
      {selectedUserForProject && (
        <AssignProjectModal 
          user={selectedUserForProject}
          onClose={() => setSelectedUserForProject(null)}
          onAssign={handleAssignProject}
        />
      )}
    </div>
  );
}