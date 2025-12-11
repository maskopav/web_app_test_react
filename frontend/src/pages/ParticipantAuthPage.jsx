import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { signupParticipant, loginParticipant, forgotPassword } from "../api/auth";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import "./Pages.css"; 

export default function ParticipantAuthPage() {
  const { token: projectToken } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(["common"]); // Use 'common' namespace

  const [mode, setMode] = useState("signup"); // "signup" | "login" | "forgot"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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
      if (mode === "forgot") {
        await forgotPassword(formData.email);
        setSuccessMsg(t("auth.resetEmailSent", "Reset link sent to your email."));
      } else {
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
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="top-bar" style={{ justifyContent: 'flex-end' }}>
        <LanguageSwitcher />
      </div>

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
            {mode === "signup" ? t("auth.signupTitle") : mode === "login" ? t("auth.loginTitle") : "Reset Password"}
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Email Field (Used in all modes) */}
            <div>
              <label className="form-label">{t("auth.email")}</label>
              <input 
                required type="email" name="email" className="participant-input"
                value={formData.email} onChange={handleChange} 
              />
            </div>

            {/* Signup Fields */}
            {mode === "signup" && (
              <>
                <div>
                  <label className="form-label">{t("auth.fullName")}</label>
                  <input required type="text" name="full_name" className="participant-input" value={formData.full_name} onChange={handleChange} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">{t("auth.birthDate")}</label>
                    <input required type="date" name="birth_date" className="participant-input" value={formData.birth_date} onChange={handleChange} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">{t("auth.sex")}</label>
                    <select name="sex" className="participant-input" value={formData.sex} onChange={handleChange}>
                      <option value="female">{t("auth.female")}</option>
                      <option value="male">{t("auth.male")}</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Login Fields */}
            {mode === "login" && (
              <div>
                <label className="form-label">{t("auth.password")}</label>
                <input required type="password" name="password" className="participant-input" value={formData.password} onChange={handleChange} />
                <div style={{textAlign: "right", marginTop: "5px"}}>
                  <span 
                    style={{color: "var(--primary)", cursor: "pointer", fontSize: "0.9rem"}}
                    onClick={() => setMode("forgot")}
                  >
                    Forgot Password?
                  </span>
                </div>
              </div>
            )}

            {/* Forgot Password Mode Instructions */}
            {mode === "forgot" && (
               <p style={{ fontSize: "0.9rem", color: "#666" }}>
                 Enter your email address and we will send you a link to reset your password.
               </p>
            )}

            {error && <div className="validation-error-msg text-center">{error}</div>}
            {successMsg && <div className="text-center" style={{color: "green"}}>{successMsg}</div>}

            <button type="submit" disabled={loading} className="btn-save" style={{ marginTop: "1rem" }}>
              {loading ? t("auth.processing") : (mode === "signup" ? t("auth.btnSignup") : mode === "login" ? t("auth.btnLogin") : "Send Reset Link")}
            </button>

            {mode === "forgot" && (
               <button type="button" className="btn-secondary" onClick={() => setMode("login")}>
                 Back to Login
               </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
