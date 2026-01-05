// frontend/src/components/ParticipantAuth/ParticipantAuthForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { signupParticipant, loginParticipant, forgotPassword } from "../../api/auth";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import "./ParticipantAuth.css";

export default function ParticipantAuthForm() {
  const { token: projectToken } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(["common"]);

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

  useEffect(() => {
    if (!projectToken) setError(t("auth.invalidLink", "Invalid Link"));
  }, [projectToken]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
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
      <div className="top-bar">
        <LanguageSwitcher />
      </div>

      {/* app-container handles general page centering */}
      <div className="app-container">
        {/* NEW WRAPPER: Handles vertical stacking and centering for content block */}
        <div className="auth-page-content"> 
          
          {/* Title and Subtitle Section - now using CSS classes for layout and style */}
          <div className="auth-subtitle-wrapper">
              <h1 className="auth-main-title">
                  {t("auth.welcomeTitle")}
              </h1>
              <p className="auth-subtitle">
                  {t("auth.welcomeSubtitle")}
              </p>
          </div>
          
          <div className="auth-container-card"> 
            
            {/* Tabs */}
            <div className="auth-form-tabs">
              <button 
                className={mode === "signup" ? "btn-primary" : "btn-secondary"}
                onClick={() => { setMode("signup"); setError(""); setSuccessMsg(""); }}
                style={{ flex: 1, opacity: mode === "signup" ? 1 : 0.6 }}
              >
                {t("auth.tabSignup")}
              </button>
              <button 
                className={mode === "login" ? "btn-primary" : "btn-secondary"}
                onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
                style={{ flex: 1, opacity: mode === "login" ? 1 : 0.6 }}
              >
                {t("auth.tabLogin")}
              </button>
            </div>

            <h2 className="text-center">
              {mode === "signup" ? t("auth.signupTitle") : mode === "login" ? t("auth.loginTitle") : t("auth.resetPasswordTitle", "Reset Password")}
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
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
                  
                  <div className="input-group-row"> 
                    <div>
                      <label className="form-label">{t("auth.birthDate")}</label>
                      <input required type="date" name="birth_date" className="participant-input" value={formData.birth_date} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="form-label">{t("auth.sex")}</label>
                      <select name="sex" className="participant-input" value={formData.sex} onChange={handleChange}>
                        <option value="female">{t("auth.female")}</option>
                        <option value="male">{t("auth.male")}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="form-label">{t("auth.phone")}</label>
                    <input type="text" name="phone" className="participant-input" value={formData.phone} onChange={handleChange} />
                  </div>
                </>
              )}

              {/* Login Fields */}
              {mode === "login" && (
                <div>
                  <label className="form-label">{t("auth.password")}</label>
                  <input required type="password" name="password" className="participant-input" value={formData.password} onChange={handleChange} />
                  <div style={{textAlign: "right", marginTop: "0.5rem"}}>
                    <span 
                      className="forgot-password-link"
                      onClick={() => { setMode("forgot"); setError(""); setSuccessMsg(""); }}
                    >
                      {t("auth.forgotPasswordLink", "Forgot Password?")}
                    </span>
                  </div>
                </div>
              )}

              {/* Forgot Password Mode Instructions */}
              {mode === "forgot" && (
                 <p className="auth-instruction"> 
                   {t("auth.forgotPasswordInstruction", "Enter your email address and we will send you a link to reset your password.")}
                 </p>
              )}

              {error && <div className="validation-error-msg text-center">{error}</div>}
              {successMsg && <div className="text-center validation-success-msg" style={{color: "green"}}>{successMsg}</div>}

              <button type="submit" disabled={loading} className="btn-green" style={{ marginTop: "0.5rem" }}>
                {loading 
                  ? t("auth.processing") 
                  : (mode === "signup" 
                    ? t("auth.btnSignup") 
                    : mode === "login" 
                      ? t("auth.btnLogin") 
                      : t("auth.btnSendResetLink", "Send Reset Link"))
                }
              </button>

              {mode === "forgot" && (
                 <button type="button" className="btn-secondary" onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}>
                   {t("auth.btnBackToLogin", "Back to Login")}
                 </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}