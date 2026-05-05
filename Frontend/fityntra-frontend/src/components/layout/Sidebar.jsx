import React from "react";

function Sidebar({ active, setActive }) {
  const navItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "health", icon: "⚕️", label: "Health Calculators" },
    { id: "diet", icon: "🍱", label: "Diet Recommender" },
    { id: "workout", icon: "🏋️", label: "Workout Recommender" },
    { id: "reha", icon: "🩺", label: "REHA (Rehab Coach)" },
    { id: "macros", icon: "🥗", label: "Macro Tracker" },
    { id: "progress", icon: "📊", label: "Progress" },
    { id: "community", icon: "👥", label: "Community" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <div className="sidebar">
      <div style={{ padding: "20px 16px 14px" }}>
        
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 22 }}>🪷</span>
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              color: "var(--gold-light)",
              fontSize: 16,
              letterSpacing: "0.1em",
            }}
          >
            FITYNTRA
          </span>
        </div>

        {/* NAV ITEMS */}
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${active === item.id ? "active" : ""}`}
            onClick={() => setActive(item.id)}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;