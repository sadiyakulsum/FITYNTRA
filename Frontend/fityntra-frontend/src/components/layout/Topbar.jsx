import React, { useState } from "react";

function TopBar({ userName = "", userData = {}, activePage, onLogout, onNavigate }) {
  const labels = {
    dashboard: "Dashboard", health: "Health Calculators",
    diet: "Diet Recommender", workout: "Workout Recommender",
    reha: "REHA – Rehab Coach", progress: "Progress",
    macros: "Macro Tracker", community: "Community", settings: "Settings"
  };

  const [showProfile, setShowProfile] = useState(false);

  const dropBase = {
    position: "absolute", top: 48, right: 0,
    background: "var(--bg-card)", border: "1px solid var(--border-bright)",
    borderRadius: 12, zIndex: 50, boxShadow: "0 16px 48px rgba(0,0,0,0.8)",
    width: 240
  };

  return (
    <div style={{
      height: 56, background: "var(--bg-panel)", borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", position: "sticky", top: 0, zIndex: 40
    }}>
      <span style={{ fontFamily: "'Cinzel', serif", color: "var(--gold-light)", fontSize: 15 }}>
        {labels[activePage]}
      </span>

      <div style={{ position: "relative" }}>
        <div onClick={() => setShowProfile(v => !v)}
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--gold) 0%, #6A3800 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, border: "2px solid var(--gold-dim)"
          }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <span style={{ color: "var(--text-dim)", fontSize: 13 }}>{userName}</span>
          <span style={{ color: "var(--text-muted)", fontSize: 9 }}>▼</span>
        </div>

        {showProfile && (
          <>
            <div onClick={() => setShowProfile(false)}
              style={{ position: "fixed", inset: 0, zIndex: 49 }} />
            <div style={{ ...dropBase, position: "absolute" }}>
              <div style={{ padding: 16, textAlign: "center", borderBottom: "1px solid var(--border)" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%", margin: "0 auto 8px",
                  background: "linear-gradient(135deg, var(--gold) 0%, #6A3800 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, fontWeight: 700
                }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div style={{ fontFamily: "'Cinzel', serif", color: "var(--text)", fontSize: 14 }}>{userName}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>FITYNTRA Member 🪷</div>
              </div>

              {[
                { icon: "📊", label: "My Progress",  page: "progress" },
                { icon: "🩺", label: "Talk to REHA", page: "reha" },
                { icon: "👥", label: "Community",    page: "community" },
                { icon: "⚙️", label: "Settings",     page: "settings" },
              ].map((item, i) => (
                <div key={i} onClick={() => { setShowProfile(false); onNavigate(item.page); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", cursor: "pointer", fontSize: 13, color: "var(--text-dim)", borderBottom: "1px solid var(--border)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(201,146,42,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span>{item.icon}</span><span>{item.label}</span>
                </div>
              ))}

              <div onClick={() => { setShowProfile(false); onLogout(); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", cursor: "pointer", fontSize: 13, color: "#E54" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(221,85,68,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span>🚪</span><span>Logout</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TopBar;