// src/components/Common/AuthForm.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./AuthForm.css";

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState(initialData);

  const validateField = (name, value, isRequired = false) => {
    let errorMsg = "";
    // Check if required and empty
    if (isRequired && (!value || value.toString().trim() === "")) {
        return t("auth.required");
      }
  
    // Specific Format Validations
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) errorMsg = t("auth.invalidEmail");
    } else if (name === "full_name") {
      if (value.trim().split(" ").length < 2) errorMsg = t("auth.nameTooShort");
    } else if (name === "phone" && value) {
      const phoneRegex = /^\+?[\d\s-]{9,15}$/;
      if (!phoneRegex.test(value)) errorMsg = t("auth.invalidPhone");
    } else if (name === "sex") {
        if (value === "not_selected" || value === "-- Choose --") {
        errorMsg = t("auth.invalidGender");
        }
    } else if (name === "birth_date") {
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        // Adjust age if birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
        }

        if (age < 18) {
            errorMsg = t("auth.underAge");
        } else if (age > 120) {
            errorMsg = t("auth.overAge")
        }
    }
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // For select fields, validate immediately on change
    if (e.target.tagName === "SELECT") {
        const fieldDef = signupFields.find(f => f.name === name);
        const errorMsg = validateField(name, value, fieldDef?.required);
        setFieldErrors(prev => ({ ...prev, [name]: errorMsg }));
    } else if (fieldErrors[name]) {
      // For text inputs, just clear the error while typing
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Determine if this specific field is required
    let required = name === "email" || name === "password"; // email/password are always required
    if (mode === "signup") {
      const fieldDef = signupFields.find(f => f.name === name);
      if (fieldDef) required = fieldDef.required;
    }
  
    const errorMsg = validateField(name, value, required);
    setFieldErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const newErrors = {};

    // Validate Email (common to all modes)
    const emailErr = validateField("email", formData.email, true);
    if (emailErr) newErrors.email = emailErr;

    // Validate Password (login mode)
    if (mode === "login") {
      const passErr = validateField("password", formData.password, true);
      if (passErr) newErrors.password = passErr;
    }

    // Validate all dynamic Signup Fields
    if (mode === "signup") {
      signupFields.forEach(field => {
        const value = formData[field.name];
        const msg = validateField(field.name, value, field.required);
        if (msg) newErrors[field.name] = msg;
      });
    }

    // If there are any errors, stop submission and show them
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

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
                  type="button"
                  className={mode === "signup" ? "btn-primary" : "btn-secondary"}
                  onClick={() => { setMode("signup"); setError(""); setFieldErrors({}); setSuccessMsg(""); }}
                >
                  {t("auth.tabSignup")}
                </button>
                <button 
                  type="button"
                  className={mode === "login" ? "btn-primary" : "btn-secondary"}
                  onClick={() => { setMode("login"); setError(""); setFieldErrors({}); setSuccessMsg(""); }}
                >
                  {t("auth.tabLogin")}
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-flex-form" noValidate>
              <div className="form-field">
                <label className="form-label">{t("auth.email")}</label>
                <input 
                  required type="email" name="email" className={`participant-input ${fieldErrors.email ? 'input-error' : ''}`}
                  placeholder="e.g. john.doe@example.com"
                  value={formData.email || ""} onChange={handleChange} onBlur={handleBlur}
                />
                {fieldErrors.email && <span className="field-error-text">{fieldErrors.email}</span>}
              </div>

              {mode === "signup" && (
                <div className="signup-grid">
                  {signupFields.map(field => (
                    <div key={field.name} className={`form-field ${field.gridSpan ? 'span-half' : ''}`}>
                    <label className="form-label">{field.label}</label>
                    
                    {field.type === "select" ? (
                        <>
                        <select 
                            name={field.name} 
                            className={`participant-input ${fieldErrors[field.name] ? 'input-error' : ''}`} 
                            value={formData[field.name]} 
                            onChange={handleChange}
                            onBlur={handleBlur}
                        >
                            {field.options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        {fieldErrors[field.name] && (
                            <span className="field-error-text">{fieldErrors[field.name]}</span>
                        )}
                        </>
                    ) : (
                        <>
                        <input 
                            required={field.required} type={field.type} name={field.name} 
                            placeholder={field.placeholder}
                            className={`participant-input ${fieldErrors[field.name] ? 'input-error' : ''}`}
                            value={formData[field.name] || ""} onChange={handleChange} onBlur={handleBlur}
                        />
                        {fieldErrors[field.name] && <span className="field-error-text">{fieldErrors[field.name]}</span>}
                        </>
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
                      <span className="forgot-password-link" onClick={() => setMode("forgot")}>
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
                <button type="button" className="btn-secondary" onClick={() => setMode("login")}>
                   {t("auth.btnBackToLogin")}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
  );
}