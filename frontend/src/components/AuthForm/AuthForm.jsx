// src/components/Common/AuthForm.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./AuthForm.css";
import "../../pages/Pages.css"

export default function AuthForm({
  title,
  subtitle,
  onLogin,
  onSignup,
  onForgot,
  signupFields = [],
  initialMode = "login",
  initialData = {}
}) {
  const { t } = useTranslation(["common"]);
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState(initialData);

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
        await onForgot(formData.email);
        setSuccessMsg(t("auth.resetEmailSent"));
      } else if (mode === "signup") {
        await onSignup(formData);
      } else {
        await onLogin(formData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="app-container">
        <div className="auth-page-content compact"> 
          
          <div className="auth-subtitle-wrapper">
              <h1 className="auth-main-title">{title}</h1>
              <p className="auth-subtitle">{subtitle}</p>
          </div>
          
          <div className="auth-container-card"> 
            {onSignup && (
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
            )}

            <form onSubmit={handleSubmit} className="auth-flex-form">
              <div className="form-field">
                <label className="form-label">{t("auth.email")}</label>
                <input required type="email" name="email" className="participant-input" value={formData.email || ""} onChange={handleChange} />
              </div>

              {mode === "signup" && (
                <div className="signup-grid">
                  {signupFields.map(field => (
                    <div key={field.name} className={`form-field ${field.gridSpan ? 'span-half' : ''}`}>
                      <label className="form-label">{field.label}</label>
                      {field.type === "select" ? (
                        <select name={field.name} className="participant-input" value={formData[field.name]} onChange={handleChange}>
                          {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                      ) : (
                        <input required={field.required} type={field.type} name={field.name} className="participant-input" value={formData[field.name] || ""} onChange={handleChange} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {mode === "login" && (
                <div className="form-field">
                  <label className="form-label">{t("auth.password")}</label>
                  <input required type="password" name="password" className="participant-input" value={formData.password || ""} onChange={handleChange} />
                  {onForgot && (
                    <div style={{textAlign: "right", marginTop: "0.25rem"}}>
                      <span className="forgot-password-link" onClick={() => { setMode("forgot"); setError(""); setSuccessMsg(""); }}>
                        {t("auth.forgotPasswordLink")}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {mode === "forgot" && <p className="auth-instruction">{t("auth.forgotPasswordInstruction")}</p>}

              {error && <div className="validation-error-msg text-center">{error}</div>}
              {successMsg && <div className="text-center validation-success-msg" style={{color: "green"}}>{successMsg}</div>}

              <button type="submit" disabled={loading} className="btn-green">
                {loading ? t("auth.processing") : (mode === "signup" ? t("auth.btnSignup") : mode === "login" ? t("auth.btnLogin") : t("auth.btnSendResetLink"))}
              </button>

              {mode === "forgot" && (
                <button type="button" className="btn-secondary" onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}>
                   {t("auth.btnBackToLogin")}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
  );
}