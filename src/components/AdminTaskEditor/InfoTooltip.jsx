import React from "react";

export default function InfoTooltip({ text }) {
  if (!text) return null;
  return (
    <span className="info-tooltip">
      ⓘ
      <span className="info-tooltip-text">{text}</span>
    </span>
  );
}
