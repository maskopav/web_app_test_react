// src/pages/NotFoundPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Pages.css"; // Keep global styles
import "./NotFoundPage.css"; // Import specific styles

export default function NotFoundPage() {
  const { t } = useTranslation(["common"]);
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Try to get custom error info from navigation state
  const state = location.state || {};
  
  // 2. Define content (Fallback to 404 if no state provided)
  const title = state.title || t("notFound.title", "404 – Page not found");
  const message = state.message || t("notFound.message", "Please check the URL link!");
  const isWarning = state.isWarning || false;

  return (
    <div className="not-found-wrapper">
      <div className="not-found-card">
        
        {/* Icon */}
        <div className="not-found-icon">
          {isWarning ? "🚫" : "🔍"}
        </div>

        {/* Text Content */}
        <h1 className="not-found-title">{title}</h1>
        <p className="not-found-message">
          {message}
        </p>

        {/* Back Button */}
        <div className="not-found-actions">
          <button 
            className="btn-back btn-not-found-back" 
            onClick={() => navigate("/")} 
          >
            {t("buttons.back", "Back to Home")}
          </button>
        </div>

      </div>
    </div>
  );
}