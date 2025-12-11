import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { signupParticipant, loginParticipant } from "../api/auth";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import "./Pages.css"; 

export default function ParticipantAuthPage() {
  const { token: projectToken } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(["common"]); // Use 'common' namespace

  const [mode, setMode] = useState("signup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    birth_date: "",
    sex: "female"
  });

  // Ensure token exists
  useEffect(() => {
    if (!projectToken) setError(t("auth.invalidLink", "Invalid Link"));
  }, [projectToken]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let response;
      if (mode === "signup") {
        response = await signupParticipant({ projectToken, ...formData });
      } else {
        response = await loginParticipant({
          projectToken,
          email: formData.email,
          password: formData.password
        });
      }

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
    <div className="dashboard-page"> {/* Use dashboard-page for full height/background */}
      
      {/* Top Bar for Language Switcher */}
      <div className="top-bar" style={{ justifyContent: 'flex-end' }}>
        <LanguageSwitcher />
      </div>

      {/* Centered Content */}
      <div className="app-container" style={{ minHeight: '80vh', alignItems: 'flex-start', paddingTop: '5vh' }}>
        <div className="card" style={{ maxWidth: "500px", width: "95%", padding: "2rem" }}>
          
          {/* Tabs */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem", gap:"1rem" }}>
            <button 
              className={mode === "signup" ? "btn-primary" : "btn-secondary"}
              onClick={() => setMode("signup")}
              style={{ flex: 1, opacity: mode === "signup" ? 1 : 0.6 }}
            >
              {t("auth.tabSignup")}
            </button>
            <button 
              className={mode === "login" ? "btn-primary" : "btn-secondary"}
              onClick={() => setMode("login")}
              style={{ flex: 1, opacity: mode === "login" ? 1 : 0.6 }}
            >
              {t("auth.tabLogin")}
            </button>
          </div>

          <h2 className="text-center">
            {mode === "signup" ? t("auth.signupTitle") : t("auth.loginTitle")}
          </h2>
          <p className="text-center text-muted" style={{ marginBottom: "1.5rem" }}>
            {mode === "signup" ? t("auth.signupDesc") : t("auth.loginDesc")}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Email */}
            <div>
              <label className="form-label">{t("auth.email")}</label>
              <input 
                required type="email" name="email" className="participant-input"
                value={formData.email} onChange={handleChange} 
              />
            </div>

            {/* SIGNUP FIELDS */}
            {mode === "signup" && (
              <>
                <div>
                  <label className="form-label">{t("auth.fullName")}</label>
                  <input 
                    required type="text" name="full_name" className="participant-input"
                    value={formData.full_name} onChange={handleChange} 
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">{t("auth.birthDate")}</label>
                    <input 
                      required type="date" name="birth_date" className="participant-input"
                      value={formData.birth_date} onChange={handleChange} 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">{t("auth.sex")}</label>
                    <select 
                      name="sex" className="participant-input"
                      value={formData.sex} onChange={handleChange}
                    >
                      <option value="female">{t("auth.female")}</option>
                      <option value="male">{t("auth.male")}</option>
                    </select>
                  </div>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
                  * {t("auth.note")}
                </p>
              </>
            )}

            {/* LOGIN FIELDS */}
            {mode === "login" && (
              <div>
                <label className="form-label">{t("auth.password")}</label>
                <input 
                  required type="password" name="password" className="participant-input"
                  value={formData.password} onChange={handleChange} 
                />
              </div>
            )}

            {error && <div className="validation-error-msg text-center">{error}</div>}

            <button type="submit" disabled={loading} className="btn-save" style={{ marginTop: "1rem" }}>
              {loading ? t("auth.processing") : (mode === "signup" ? t("auth.btnSignup") : t("auth.btnLogin"))}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}