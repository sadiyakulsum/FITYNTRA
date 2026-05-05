import React from "react";

function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  style = {},
}) {
  const baseStyle = {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "0.2s",
  };

  const variants = {
    primary: {
      backgroundColor: "#4CAF50",
      color: "white",
    },
    secondary: {
      backgroundColor: "#f1f1f1",
      color: "#333",
    },
    danger: {
      backgroundColor: "#ff4d4d",
      color: "white",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      style={{ ...baseStyle, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
}

export default Button;