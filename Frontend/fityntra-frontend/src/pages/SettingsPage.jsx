import React, { useState } from "react";

function SettingsPage({ userName, onLogout, token, userId, user, onUpdate }) {

  const mapGoal = (g) => {
    const map = { bulk: "muscle_gain", cut: "weight_loss", lose: "weight_loss", gain: "muscle_gain", maintain: "maintenance" };
    return map[g] || g || "maintenance";
  };

  const loadProfile = () => ({
    name:   user?.name       || userName || "User",
    email:  user?.email      || "user@fityntra.com",
    age:    user?.age        || 25,
    height: user?.height_cm  || 175,
    weight: user?.weight_kg  || 72,
    gender: user?.gender     || "male",
    goal:   mapGoal(user?.goal),
  });

  const [profile, setProfile] = useState(loadProfile);
  const [saved,   setSaved]   = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    const updatedData = {
      name:      profile.name,
      age:       Number(profile.age),
      height_cm: Number(profile.height),
      weight_kg: Number(profile.weight),
      gender:    profile.gender,
      goal:      profile.goal,
    };

    // 1. Save to localStorage immediately
    try {
      const currentUser = JSON.parse(localStorage.getItem("fityntra_user") || "{}");
      const merged = { ...currentUser, ...updatedData };
      localStorage.setItem("fityntra_user", JSON.stringify(merged));
    } catch(e) {}

    // 2. Try to save to backend
    try {
      const res = await fetch(`http://localhost:8000/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      if (!res.ok) throw new Error("Backend save failed");
      setSaveMsg("✅ Profile saved successfully!");
    } catch(e) {
      // localStorage already saved so don't show error
      setSaveMsg("✅ Profile saved locally!");
    }

    // 3. Update parent App state so changes reflect everywhere
    if (onUpdate) onUpdate(updatedData);

    setSaved(true);
    setLoading(false);
    setTimeout(() => { setSaved(false); setSaveMsg(""); }, 3000);
  };

  return (
    <div className="fade-in" style={{ padding: 24, maxWidth: 600 }}>
      <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: "var(--gold)", marginBottom: 4 }}>
        ⚙️ Settings
      </h2>
      <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 20 }}>Manage your profile</p>

      <div className="card">
        {/* Avatar preview */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24,
          padding: 16, background: "var(--bg-input)", borderRadius: 10 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--gold), #6A3800)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 700, border: "3px solid var(--gold-dim)", flexShrink: 0
          }}>{(profile.name || "U").charAt(0).toUpperCase()}</div>
          <div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: "var(--text)" }}>
              {profile.name}
            </div>
            <div style={{ color: "var(--text-dim)", fontSize: 12, marginTop: 3 }}>{profile.email}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
              {profile.goal ? `🎯 ${profile.goal.replace("_", " ")}` : ""}
              {profile.height ? ` · ${profile.height}cm` : ""}
              {profile.weight ? ` · ${profile.weight}kg` : ""}
            </div>
          </div>
        </div>

        {/* Form fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { key: "name",   label: "Full Name",   type: "text",   disabled: false },
            { key: "email",  label: "Email",       type: "email",  disabled: true  },
            { key: "age",    label: "Age",         type: "number", disabled: false },
            { key: "height", label: "Height (cm)", type: "number", disabled: false },
            { key: "weight", label: "Weight (kg)", type: "number", disabled: false },
          ].map(f => (
            <div key={f.key}>
              <label className="lbl">{f.label}</label>
              <input className="inp" type={f.type} value={profile[f.key]}
                disabled={f.disabled}
                onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label className="lbl">Gender</label>
            <select className="inp" value={profile.gender}
              onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Goal selector */}
        <div style={{ marginTop: 16 }}>
          <label className="lbl">Fitness Goal</label>
          <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
            {[
              { k: "weight_loss", l: "📉 Lose Weight" },
              { k: "muscle_gain", l: "💪 Gain Muscle" },
              { k: "maintenance", l: "⚖️ Maintain"    },
              { k: "endurance",   l: "🏃 Endurance"   },
            ].map(g => (
              <button key={g.k}
                onClick={() => setProfile(p => ({ ...p, goal: g.k }))}
                className={profile.goal === g.k ? "btn-gold" : "btn-ghost"}
                style={{ fontSize: 12, padding: "7px 12px" }}>
                {g.l}
              </button>
            ))}
          </div>
        </div>

        <hr className="divider" />

        {/* Save message */}
        {saveMsg && (
          <div style={{
            padding: "10px 14px", borderRadius: 8, marginBottom: 12,
            background: saveMsg.includes("✅") ? "rgba(106,170,100,0.12)" : "rgba(255,80,80,0.08)",
            border: `1px solid ${saveMsg.includes("✅") ? "var(--green)" : "rgba(255,80,80,0.3)"}`,
            fontSize: 13, color: "var(--text)"
          }}>
            {saveMsg}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-gold" style={{ flex: 1, padding: 12, opacity: loading ? 0.7 : 1 }}
            onClick={save} disabled={loading}>
            {loading ? "Saving..." : "💾 Save Profile"}
          </button>
          <button className="btn-ghost" style={{ fontSize: 12, padding: "0 16px" }} onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;