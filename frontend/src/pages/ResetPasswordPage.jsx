// frontend/src/pages/ResetPasswordPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/auth";
import "./Pages.css";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "", success: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus({ ...status, error: "Passwords do not match" });
      return;
    }
    setStatus({ loading: true, error: "", success: false });

    try {
      await resetPassword(token, password);
      setStatus({ loading: false, error: "", success: true });
      setTimeout(() => navigate("/"), 3000); // Redirect to home/login
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: false });
    }
  };

  return (
    <div className="dashboard-page">
      <div className="app-container" style={{ minHeight: '80vh', alignItems: 'center' }}>
        <div className="card" style={{ maxWidth: "400px", width: "95%", padding: "2rem" }}>
          <h2 className="text-center">Reset Password</h2>
          
          {status.success ? (
            <div className="text-center">
              <p style={{color: "green", fontSize: "1.1rem"}}>Password updated successfully!</p>
              <p>Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">New Password</label>
                <input 
                  required type="password" className="participant-input"
                  value={password} onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              <div>
                <label className="form-label">Confirm Password</label>
                <input 
                  required type="password" className="participant-input"
                  value={confirm} onChange={(e) => setConfirm(e.target.value)} 
                />
              </div>

              {status.error && <div className="validation-error-msg text-center">{status.error}</div>}

              <button type="submit" disabled={status.loading} className="btn-save">
                {status.loading ? "Processing..." : "Set New Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}