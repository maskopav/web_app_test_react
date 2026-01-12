// frontend/src/components/ParticipantAuth/ResetPasswordModal.jsx
import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../api/auth";
import { useTranslation } from "react-i18next";
import "./ResetPasswordModal.css"; // New dedicated styles

export default function ResetPasswordModal() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation(["common"]);

  const returnToken = searchParams.get("returnToken"); // The saved protocol token

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "", success: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus({ ...status, error: t("auth.passwordMismatch") });
      return;
    }
    setStatus({ loading: true, error: "", success: false });

    try {
      await resetPassword(token, password);
      setStatus({ loading: false, error: "", success: true });
      // Determine where to redirect
      const targetPath = returnToken ? `/protocol/${returnToken}` : "/";
      
      setTimeout(() => navigate(targetPath, { replace: true }), 3000);
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: false });
    }
  };

  return (
    <div className="reset-modal-overlay">
      <div className="reset-modal-content">
        <h2 className="text-center">{t("auth.resetPasswordTitle")}</h2>

        {status.success ? (
          <div className="text-center password-update-container">
            <p className="validation-success-msg">
              {t("auth.passwordUpdateSuccess")}
            </p>
            <p>{t("auth.redirectingToLogin")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="reset-form">
            <div>
              <label className="form-label">{t("auth.newPassword")}</label>
              <div className="password-wrapper">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  className="participant-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? t("auth.hide") : t("auth.show")}
                </button>
              </div>
            </div>

            <div>
              <label className="form-label">{t("auth.confirmPassword")}</label>
              <div className="password-wrapper">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  className="participant-input"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
            </div>

            {status.error && (
              <div className="validation-error-msg text-center">
                {status.error}
              </div>
            )}

            <button type="submit" disabled={status.loading} className="btn-save">
              {status.loading ? t("auth.processing") : t("auth.btnSetNewPassword")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}