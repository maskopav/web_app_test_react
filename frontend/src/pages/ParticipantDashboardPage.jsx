/* frontend/src/pages/ParticipantDashboardPage.jsx */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import { useMappings } from "../context/MappingContext";
import { getParticipants, createParticipant } from "../api/participants";
import Modal from "../components/ProtocolEditor/Modal"; // Reuse generic modal
import "./Pages.css";

export default function ParticipantDashboardPage() {
  const { t } = useTranslation(["common", "admin"]);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { mappings, refreshMappings } = useMappings();

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    full_name: "",
    external_id: "",
    birth_date: "",
    sex: "female",
    contact_email: "",
    notes: "",
    protocol_id: "" // Mandatory selection
  });

  // Load Participants
  useEffect(() => {
    loadData();
    refreshMappings(["protocols", "project_protocols"]); // Ensure we have protocols for the dropdown
  }, [projectId]);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getParticipants(projectId);
      setParticipants(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Filter protocols available for this project (assuming all protocols in DB are available or filtered by project_protocols logic)
  // In a real app, you might filter `mappings.protocols` by `mappings.project_protocols` matching this projectId.
  const availableProtocols = mappings.protocols || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.full_name || !formData.protocol_id) {
      alert("Name and Protocol are required");
      return;
    }

    try {
      await createParticipant({ ...formData, project_id: projectId });
      setShowAddModal(false);
      setFormData({ full_name: "", external_id: "", birth_date: "", sex: "female", contact_email: "", notes: "", protocol_id: "" });
      loadData(); // Refresh list
    } catch (err) {
      alert("Error creating participant: " + err.message);
    }
  };

  return (
    <div className="project-dashboard-page">
      {/* Top Bar */}
      <div className="top-bar">
        <button className="btn-back" onClick={() => navigate(`/projects/${projectId}`)}>
          ← {t("buttons.back")}
        </button>
        <LanguageSwitcher />
      </div>

      <div className="protocols-container"> {/* Reusing container style */}
        
        {/* Header & Actions */}
        <div className="protocol-list-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding: '1rem 0'}}>
          <h2>Participants Management</h2>
          <button className="btn-create" onClick={() => setShowAddModal(true)}>
            + Add New Participant
          </button>
        </div>

        {/* Table */}
        <div className="protocol-list card">
          <div className="protocol-table-wrapper">
            <table className="protocol-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>External ID</th>
                  <th>Birth Date</th>
                  <th>Sex</th>
                  <th>Email</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="empty-row">{t("loading")}...</td></tr>
                ) : participants.length === 0 ? (
                  <tr><td colSpan="7" className="empty-row">No participants found in this project.</td></tr>
                ) : (
                  participants.map((p) => (
                    <tr key={p.participant_id}>
                      <td className="highlighted">{p.full_name}</td>
                      <td>{p.external_id || "-"}</td>
                      <td>{p.birth_date ? p.birth_date.slice(0, 10) : "-"}</td>
                      <td>{p.sex}</td>
                      <td>{p.contact_email || "-"}</td>
                      <td>{p.notes}</td>
                      <td className="actions">
                        <button className="btn-edit" onClick={() => alert("Edit feature to be implemented")}>Edit</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Participant Modal */}
      <Modal 
        open={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        title="Add New Participant"
        onSave={handleSubmit}
      >
        <div className="modal-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Personal Info Section */}
          <div className="form-group">
            <label>Full Name *</label>
            <input name="full_name" value={formData.full_name} onChange={handleInputChange} placeholder="e.g. John Doe" />
          </div>

          <div className="form-group">
            <label>External ID</label>
            <input name="external_id" value={formData.external_id} onChange={handleInputChange} placeholder="Hospital ID" />
          </div>

          <div className="form-group">
            <label>Birth Date</label>
            <input type="date" name="birth_date" value={formData.birth_date} onChange={handleInputChange} />
          </div>

          <div className="form-group">
            <label>Sex</label>
            <select name="sex" value={formData.sex} onChange={handleInputChange}>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="contact_email" value={formData.contact_email} onChange={handleInputChange} />
          </div>

          {/* Protocol Assignment Section (Required per UI Logic) */}
          <hr style={{width: '100%', borderColor: '#eee'}}/>
          <h4 style={{margin:0}}>Initial Protocol Assignment</h4>
          
          <div className="form-group">
            <label>Select Protocol *</label>
            <select name="protocol_id" value={formData.protocol_id} onChange={handleInputChange} style={{border: '2px solid var(--primary)'}}>
              <option value="">-- Choose Protocol --</option>
              {availableProtocols.map(proto => (
                <option key={proto.id} value={proto.id}>
                  {proto.name} (v{proto.version})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={2} />
          </div>

        </div>
      </Modal>
    </div>
  );
}