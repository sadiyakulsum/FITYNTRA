import React from "react";

function Card({ children, title, style = {} }) {
  const cardStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  };

  return (
    <div style={{ ...cardStyle, ...style }}>
      {title && <h3 style={{ marginBottom: "10px" }}>{title}</h3>}
      {children}
    </div>
  );
}

export default Card;