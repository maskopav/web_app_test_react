import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { signupParticipant, loginParticipant } from "../api/auth";
import "./Pages.css"; 
// You can create ParticipantAuthPage.css for specific styles if needed

export default function ParticipantAuthPage() {
  const { token: projectToken } = useParams(); // Public token from URL
  const navigate = useNavigate();
  const { t } = useTranslation(["common"]);

  const [mode, setMode] = useState("signup"); // 'signup' | 'login'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    birth_date: "",
    sex: "female"
  });

  // Check if token exists
  useEffect(() => {
    console.log("Current Project Token from URL:", projectToken);
  }, [projectToken]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // DEBUG: Ensure token is passed
    if (!projectToken) {
        setError("Missing project link. Please open the link again.");
        setLoading(false);
        return;
    }

    try {
      let response;
      if (mode === "signup") {
        response = await signupParticipant({
          projectToken,
          ...formData
        });
      } else {
        console.log("Attempting login with:", { projectToken, email: formData.email });
        response = await loginParticipant({
          projectToken,
          email: formData.email,
          password: formData.password
        });
      }

      // Success! Redirect to the personal protocol link
      if (response.token) {
        navigate(`/participant/${response.token}`, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card" style={{ maxWidth: "500px", width: "100%", padding: "2rem" }}>
        
        {/* Header Tabs */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem", gap:"1rem" }}>
          <button 
            className={mode === "signup" ? "btn-primary" : "btn-secondary"}
            onClick={() => setMode("signup")}
            style={{ flex: 1, background: mode === "signup" ? "var(--primary)" : "#ddd" }}
          >
            Sign Up
          </button>
          <button 
            className={mode === "login" ? "btn-primary" : "btn-secondary"}
            onClick={() => setMode("login")}
            style={{ flex: 1, background: mode === "login" ? "var(--primary)" : "#ddd" }}
          >
            Login
          </button>
        </div>

        <h2 className="text-center">
          {mode === "signup" ? "New Participant" : "Welcome Back"}
        </h2>
        <p className="text-center text-muted">
          {mode === "signup" 
            ? "Enter your details to start the protocol." 
            : "Enter your credentials to resume."}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Fields common to both */}
          <div>
            <label className="form-label">Email</label>
            <input 
              required type="email" name="email" className="participant-input"
              value={formData.email} onChange={handleChange} 
            />
          </div>

          {/* SIGNUP SPECIFIC FIELDS */}
          {mode === "signup" && (
            <>
              <div>
                <label className="form-label">Full Name</label>
                <input 
                  required type="text" name="full_name" className="participant-input"
                  value={formData.full_name} onChange={handleChange} 
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Birth Date</label>
                  <input 
                    required type="date" name="birth_date" className="participant-input"
                    value={formData.birth_date} onChange={handleChange} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Sex</label>
                  <select 
                    name="sex" className="participant-input"
                    value={formData.sex} onChange={handleChange}
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
                * We will send login credentials to your email.
              </p>
            </>
          )}

          {/* LOGIN SPECIFIC FIELDS */}
          {mode === "login" && (
            <div>
              <label className="form-label">Password</label>
              <input 
                required type="password" name="password" className="participant-input"
                value={formData.password} onChange={handleChange} 
              />
            </div>
          )}

          {error && <div className="validation-error-msg text-center">{error}</div>}

          <button type="submit" disabled={loading} className="btn-save" style={{ marginTop: "1rem" }}>
            {loading ? "Processing..." : (mode === "signup" ? "Start Protocol" : "Log In")}
          </button>
        </form>
      </div>
    </div>
  );
}