import { useState } from "react";
import {loginUser,createUser,getUserByEmail} from "../services/api";

export default function LoginPage({ onLogin }) {
  // 'login' or 'signup'
  const [mode, setMode] = useState("login");
  
  // Form States
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");

  const handleAction = async () => {
  setErr("");
  if (!email || !pass) {
    setErr("Please fill in all required fields.");
    return;
  }
  try {
    if (mode === "signup") {
      if (!name || !age || !gender) {
        setErr("Please provide your name, age, and gender.");
        return;
      }
      await createUser({ name, email, password: pass, age: Number(age), gender,
        height_cm: 170, weight_kg: 70, goal: "maintenance",
        activity_level: "moderate", dietary_preference: "vegetarian",
        has_injury:false,injury_description:"none"
      });
      alert("Account created successfully! Please login.");
      setMode("login");
    } else {
      const data = await loginUser(email, pass);
      const userInfo = await getUserByEmail(email, data.access_token);
      onLogin({ 
        name: userInfo.name || email.split("@")[0], 
        token: data.access_token, 
        id: userInfo.id,
        email: email,
        goal:userInfo.goal||"maintain"
      });
    }
  } catch (e) {
  try {
    const errData = JSON.parse(e.message);
    setErr(errData.detail || "Something went wrong.");
  } catch {
    setErr(e.message || "Something went wrong.");
  }
}
};
  // Social Login Handlers (Placeholders)
  const handleSocialLogin = (provider) => {
    console.log(`Connecting to ${provider}...`);
    // Here you would integrate Firebase or OAuth logic
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
      background: "radial-gradient(ellipse 70% 70% at 50% 50%, #1A0E04 0%, var(--bg-deep) 100%)"
    }}>
      {/* Decorative mandala rings (unchanged) */}
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, borderRadius: "50%", border: "1px solid rgba(201,146,42,0.06)", pointerEvents: "none" }} />

      <div className="fade-in" style={{ width: "100%", maxWidth: 400, zIndex: 1 }}>
        {/* Logo Section */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🪷</div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 32, color: "var(--gold-light)", letterSpacing: "0.15em", marginBottom: 4 }}>FITYNTRA</h1>
          <p className="skt" style={{ color: "var(--text-dim)", fontSize: 15 }}>स्वस्थ शरीर, सशक्त जीवन</p>
        </div>

        <div className="card" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: "var(--text)", marginBottom: 4 }}>
            {mode === "login" ? "Welcome Back!" : "Join the Journey"}
          </h2>
          <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 24 }}>
            {mode === "login" ? "Login to continue your fitness journey" : "Create your personalized fitness profile"}
          </p>

          {/* New Fields for Signup */}
          {mode === "signup" && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label className="lbl">Full Name</label>
                <input className="inp" type="text" placeholder="Arjun Sharma" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <label className="lbl">Age</label>
                  <input className="inp" type="number" placeholder="25" value={age} onChange={e => setAge(e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="lbl">Gender</label>
                  <select className="inp" value={gender} onChange={e => setGender(e.target.value)} style={{ appearance: "none" }}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div style={{ marginBottom: 16 }}>
            <label className="lbl">Email / Mobile Number</label>
            <input className="inp" type="text" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label className="lbl">Password</label>
            <div style={{ position: "relative" }}>
              <input className="inp" type={showPass ? "text" : "password"} placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} style={{ paddingRight: 40 }} />
              <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer" }}>
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {err && <p style={{ color: "var(--red)", fontSize: 12, margin: "10px 0" }}>{err}</p>}

          <button className="btn-gold" style={{ width: "100%", padding: 13, fontSize: 14, marginTop: 10 }} onClick={handleAction}>
            {mode === "login" ? "Login" : "Sign Up"}
          </button>

          <div style={{ textAlign: "center", margin: "18px 0 14px", color: "var(--text-muted)", fontSize: 12 }}>— or continue with —</div>

          {/* Social Logins */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={() => handleSocialLogin('Google')} className="btn-ghost" style={{ flex: 1, fontSize: 12, padding: "8px 4px" }}>🇬 Google</button>
            <button onClick={() => handleSocialLogin('Apple')} className="btn-ghost" style={{ flex: 1, fontSize: 12, padding: "8px 4px" }}>🍎 Apple</button>
          </div>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-dim)" }}>
            {mode === "login" ? "New here? " : "Already have an account? "}
            <span 
              style={{ color: "var(--gold)", cursor: "pointer", fontWeight: "bold" }} 
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setErr(""); }}
            >
              {mode === "login" ? "Create an account" : "Login now"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}