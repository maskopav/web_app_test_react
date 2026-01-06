// frontend/src/components/ParticipantAuth/ResetPasswordModal.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/auth";
import "../AuthForm/AuthForm.css";
import { useTranslation } from "react-i18next";

export default function ResetPasswordModal() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(["common"]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "", success: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus({ ...status, error: t("auth.passwordMismatch", "Passwords do not match") });
      return;
    }
    setStatus({ loading: true, error: "", success: false });

    try {
      await resetPassword(token, password);
      setStatus({ loading: false, error: "", success: true });
      setTimeout(() => navigate("/", { replace: true }), 3000); // Redirect to home/login
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: false });
    }
  };

  return (
    <div className="reset-modal-overlay"> 
        <div className="reset-modal-content">
          <h2 className="text-center">{t("auth.resetPasswordTitle", "Reset Password")}</h2>
          
          {status.success ? (
            <div className="text-center">
              <p className="validation-success-msg" style={{color: "green"}}>{t("auth.passwordUpdateSuccess", "Password updated successfully!")}</p>
              <p>{t("auth.redirectingToLogin", "Redirecting to login...")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label">{t("auth.newPassword", "New Password")}</label>
                <input 
                  required type="password" className="participant-input"
                  value={password} onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              <div>
                <label className="form-label">{t("auth.confirmPassword", "Confirm Password")}</label>
                <input 
                  required type="password" className="participant-input"
                  value={confirm} onChange={(e) => setConfirm(e.target.value)} 
                />
              </div>

              {status.error && <div className="validation-error-msg text-center">{status.error}</div>}

              <button type="submit" disabled={status.loading} className="btn-save">
                {status.loading ? t("auth.processing", "Processing...") : t("auth.btnSetNewPassword", "Set New Password")}
              </button>
            </form>
          )}
        </div>
    </div>
  );
}