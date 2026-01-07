// src/pages/ParticipantAuthPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next"
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import AuthForm from "../components/AuthForm/AuthForm";
import { signupParticipant, loginParticipant, forgotPassword } from "../api/auth";
import "./Pages.css"

const TaskIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="#3764df" 
    width="1.1em"  // Scales with text size
    height="1.1em" // Scales with text size
    style={{ marginRight: '0.5rem', flexShrink: 0 }} // Small gap to the right
  >
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

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
        title={
          <div className="title-bar">
          <TaskIcon />
          {t("auth.welcomeTitle")}
          </div>
        }
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
        onSignup={(data) => signupParticipant({ projectToken, ...data })}
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