// src/pages/ParticipantAuthPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next"
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import AuthForm from "../components/AuthForm/AuthForm";
import { signupParticipant, loginParticipant, forgotPassword } from "../api/auth";

export default function ParticipantAuthPage() {
  const { token: projectToken } = useParams();
  const { t } = useTranslation(["common"]);
  const navigate = useNavigate();

  const handleSuccess = (res) => {
    if (res.token) navigate(`/participant/${res.token}`, { replace: true });
  };

  return (
    <div className="dashboard-page">
      {/* Top Bar */}
      <div className="top-bar">
        <span></span>
        <LanguageSwitcher />
      </div>
      <AuthForm
        title={t("auth.welcomeTitle")}
        subtitle=
        <Trans
          i18nKey="auth.welcomeSubtitle"
          ns="common"
          components={{ 
            strong: <strong />, 
            br: <br /> 
          }}
        />
        onLogin={(data) => loginParticipant({ projectToken, ...data }).then(handleSuccess)}
        onSignup={(data) => signupParticipant({ projectToken, ...data }).then(handleSuccess)}
        onForgot={forgotPassword}
        signupFields={[
          { name: "full_name", label: t("auth.fullName"), type: "text", required: true, placeholder: "e.g. John Doe" },
          { name: "birth_date", label: t("auth.birthDate"), type: "date", required: true, gridSpan: true },
          { name: "sex", label: t("auth.sex"), type: "select", gridSpan: true, required: true, 
            options: [{value: "not_selected", label: "-- Choose --"}, {value: "female", label: t("auth.female")}, {value: "male", label: t("auth.male")}] 
          },
          { name: "phone", label: t("auth.phone"), type: "text", required: false, placeholder: "e.g. +420 123 456 789" }
        ]}
        initialData={{ sex: "not_selected" }}
      />
    </div>
  );
}