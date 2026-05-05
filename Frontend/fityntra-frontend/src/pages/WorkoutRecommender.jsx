import React, { useState, useEffect } from "react";
import { predictWorkout } from "../services/api";

const GOAL_META = {
  weight_loss: { label: "Weight Loss", icon: "📉", color: "#EF4444" },
  muscle_gain: { label: "Muscle Gain", icon: "💪", color: "#3B82F6" },
  maintenance: { label: "Maintenance", icon: "⚖️", color: "#F4A832" },
  endurance:   { label: "Endurance",   icon: "🏃", color: "#10B981" },
};

// Icon for each exercise type
const getExerciseIcon = (name = "") => {
  const n = name.toLowerCase();
  if (/squat|lunge|leg press|deadlift/.test(n))  return "🦵";
  if (/bench|chest|fly|push/.test(n))             return "💪";
  if (/pull|row|lat|back/.test(n))                return "🔙";
  if (/shoulder|press|raise|delt/.test(n))        return "🏋️";
  if (/curl|bicep|tricep/.test(n))                return "💪";
  if (/plank|crunch|abs|core/.test(n))            return "🎯";
  if (/run|cardio|cycle|walk/.test(n))            return "🏃";
  if (/yoga|stretch|mobility/.test(n))            return "🧘";
  return "⚡";
};

// Day color palette
const DAY_COLORS = ["#C9922A","#3B82F6","#10B981","#F59E0B","#8B5CF6","#EF4444","#06B6D4"];

export default function WorkoutRecommender({ token, userId, user }) {
  const [goal,      setGoal]      = useState(user?.goal || "maintenance");
  const [gender,    setGender]    = useState(user?.gender || "female");
  const [level,     setLevel]     = useState("intermediate");
  const [activeDay, setActiveDay] = useState(0);
  const [loading,   setLoading]   = useState(false);
  const [plan,      setPlan]      = useState(null);
  const [error,     setError]     = useState("");

  const fetchWorkout = async () => {
    if (!token || !userId) {
      setError("Please login to get your personalized workout plan.");
      return;
    }
    setLoading(true);
    setError("");
    setPlan(null);
    try {
      const data = await predictWorkout({
        user_id:        userId,
        age:            user?.age            || 25,
        height_cm:      user?.height_cm      || 170,
        weight_kg:      user?.weight_kg      || 70,
        gender:         gender,
        goal:           goal,
        activity_level: user?.activity_level || "moderate",
        fitness_level:  level,
      }, token);
      setPlan(data);
      setActiveDay(0);
    } catch (e) {
      setError("Could not fetch workout plan: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) fetchWorkout();
  }, [goal, gender, level]);

  // Convert weekly_plan object to array of days
  const weeklyPlan = plan?.weekly_plan || {};
  const dayEntries = Object.entries(weeklyPlan); // [["Monday",[...]], ...]
  const tips       = plan?.tips || [];
  const injuries   = plan?.injury_modifications || [];

  const activeDayName      = dayEntries[activeDay]?.[0] || "";
  const activeDayExercises = dayEntries[activeDay]?.[1] || [];

  // Total volume for active day
  const totalSets = activeDayExercises.reduce((s, ex) => s + (ex.sets || 0), 0);

  return (
    <div className="fade-in" style={{ padding: 24, maxWidth: 960 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 20,
            color: "var(--gold)", marginBottom: 4 }}>
            🏋️ Workout Recommender
          </h2>
          <p style={{ color: "var(--text-dim)", fontSize: 13 }}>
            AI-powered personalized weekly workout plan
          </p>
        </div>
        {/* Gender toggle */}
        <div style={{ display: "flex", gap: 6 }}>
          {["male", "female"].map(g => (
            <button key={g}
              className={gender === g ? "btn-gold" : "btn-ghost"}
              style={{ fontSize: 11, padding: "5px 12px", textTransform: "capitalize" }}
              onClick={() => setGender(g)}>
              {g === "male" ? "♂ Male" : "♀ Female"}
            </button>
          ))}
        </div>
      </div>

      {/* Goal selector */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.08em",
          textTransform: "uppercase", marginBottom: 8 }}>Your Goal</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Object.entries(GOAL_META).map(([k, v]) => (
            <button key={k} onClick={() => setGoal(k)}
              className={goal === k ? "btn-gold" : "btn-ghost"}
              style={{ fontSize: 12, padding: "7px 14px" }}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fitness level */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.08em",
          textTransform: "uppercase", marginBottom: 8 }}>Fitness Level</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["beginner", "intermediate", "advanced"].map(l => (
            <button key={l} onClick={() => setLevel(l)}
              className={level === l ? "btn-gold" : "btn-ghost"}
              style={{ fontSize: 12, padding: "7px 14px", textTransform: "capitalize" }}>
              {l === "beginner" ? "🌱" : l === "intermediate" ? "⚡" : "🔥"} {l}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: 14, background: "rgba(255,80,80,0.08)",
          border: "1px solid rgba(255,80,80,0.3)", borderRadius: 10,
          color: "#ff8080", marginBottom: 20, fontSize: 13 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: 48, color: "var(--text-dim)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
          <p>Generating your personalized workout plan...</p>
        </div>
      )}

      {/* Plan */}
      {plan && !loading && dayEntries.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>

          {/* Day sidebar */}
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: 10 }}>Weekly Schedule</div>
            {dayEntries.map(([dayName, exercises], i) => (
              <div key={dayName} onClick={() => setActiveDay(i)}
                style={{
                  padding: "12px 14px", borderRadius: 10, cursor: "pointer",
                  marginBottom: 6, transition: "all 0.2s",
                  background: i === activeDay
                    ? "rgba(201,146,42,0.15)" : "var(--bg-card)",
                  border: `1px solid ${i === activeDay
                    ? "var(--gold)" : "var(--border)"}`,
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                    background: DAY_COLORS[i % DAY_COLORS.length],
                  }} />
                  <span style={{
                    fontWeight: 600, fontSize: 13,
                    color: i === activeDay ? "var(--gold)" : "var(--text)",
                  }}>{dayName}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)",
                  marginTop: 4, paddingLeft: 16 }}>
                  {exercises.length} exercises
                </div>
              </div>
            ))}

            {/* Week summary */}
            <div className="card" style={{ marginTop: 14, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)",
                marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Week Summary
              </div>
              {[
                { label: "Training Days", val: dayEntries.length },
                { label: "Rest Days",     val: 7 - dayEntries.length },
                { label: "Total Exercises",
                  val: dayEntries.reduce((s, [, ex]) => s + ex.length, 0) },
              ].map(s => (
                <div key={s.label} style={{ display: "flex",
                  justifyContent: "space-between", fontSize: 12,
                  padding: "5px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--text-dim)" }}>{s.label}</span>
                  <span style={{ color: "var(--amber)", fontWeight: 600 }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div>
            {/* Day header */}
            <div className="card" style={{
              marginBottom: 16, padding: "16px 20px",
              background: "linear-gradient(135deg, #1A1200, #221800)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18,
                  color: "var(--gold-light)" }}>{activeDayName}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>
                  {activeDayExercises.length} exercises · {totalSets} total sets
                </div>
              </div>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: `${DAY_COLORS[activeDay % DAY_COLORS.length]}22`,
                border: `2px solid ${DAY_COLORS[activeDay % DAY_COLORS.length]}`,
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 22,
              }}>
                {activeDay % 2 === 0 ? "💪" : "🏋️"}
              </div>
            </div>

            {/* Exercise list */}
            <div className="card" style={{ marginBottom: 16 }}>
              {activeDayExercises.map((ex, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 0",
                  borderBottom: i < activeDayExercises.length - 1
                    ? "1px solid var(--border)" : "none",
                }}>
                  {/* Exercise number */}
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: `${DAY_COLORS[activeDay % DAY_COLORS.length]}22`,
                    border: `1px solid ${DAY_COLORS[activeDay % DAY_COLORS.length]}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700,
                    color: DAY_COLORS[activeDay % DAY_COLORS.length],
                  }}>{i + 1}</div>

                  {/* Icon */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    background: "var(--bg-input)",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 22,
                  }}>
                    {getExerciseIcon(ex.name)}
                  </div>

                  {/* Name + sets/reps */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: "var(--text)", fontSize: 14 }}>
                      {ex.name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 3 }}>
                      {ex.sets} sets × {ex.reps} reps
                      {ex.category ? ` · ${ex.category}` : ""}
                    </div>
                  </div>

                  {/* Sets badge */}
                  <div style={{
                    padding: "4px 12px", borderRadius: 20,
                    background: "rgba(201,146,42,0.1)",
                    border: "1px solid var(--border)",
                    fontSize: 11, color: "var(--gold)", fontWeight: 600, flexShrink: 0,
                  }}>
                    {ex.sets}×{ex.reps}
                  </div>
                </div>
              ))}
            </div>

            {/* Rest tip */}
            <div style={{ fontSize: 12, color: "var(--text-muted)",
              padding: "10px 14px", borderRadius: 8,
              background: "var(--bg-card)", border: "1px solid var(--border)",
              marginBottom: 16 }}>
              ⏱️ Rest 60–90 sec between sets · Stay hydrated · Listen to your body
            </div>

            {/* Tips */}
            {tips.length > 0 && (
              <div className="card"
                style={{ background: "linear-gradient(135deg, #1A1200, #221800)" }}>
                <h3 style={{ fontFamily: "'Cinzel', serif", color: "var(--gold)",
                  marginBottom: 14, fontSize: 14 }}>
                  💡 Training Tips
                </h3>
                {tips.map((tip, i) => (
                  <div key={i} style={{
                    fontSize: 13, color: "var(--text-dim)", padding: "7px 0",
                    borderBottom: i < tips.length - 1
                      ? "1px solid var(--border)" : "none",
                    display: "flex", gap: 10,
                  }}>
                    <span style={{ color: "var(--gold)", flexShrink: 0 }}>✦</span>
                    {tip}
                  </div>
                ))}
              </div>
            )}

            {/* Injury modifications */}
            {injuries.length > 0 && (
              <div className="card" style={{ marginTop: 16,
                borderColor: "rgba(255,180,80,0.3)",
                background: "rgba(255,140,0,0.05)" }}>
                <h3 style={{ fontFamily: "'Cinzel', serif", color: "var(--amber)",
                  marginBottom: 12, fontSize: 14 }}>
                  ⚠️ Injury Modifications
                </h3>
                {injuries.map((m, i) => (
                  <div key={i} style={{ fontSize: 13, color: "var(--text-dim)",
                    padding: "6px 0", display: "flex", gap: 10 }}>
                    <span style={{ color: "var(--amber)", flexShrink: 0 }}>•</span>
                    {typeof m === "string" ? m : JSON.stringify(m)}
                  </div>
                ))}
              </div>
            )}

            {plan.model_version && (
              <div style={{ textAlign: "right", fontSize: 11,
                color: "var(--text-muted)", marginTop: 12 }}>
                Model: {plan.model_version}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!plan && !loading && !error && (
        <div style={{ textAlign: "center", padding: 48, color: "var(--text-dim)" }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>🏋️</div>
          <p style={{ fontSize: 14 }}>
            Select your goal and fitness level to get your personalized workout plan!
          </p>
        </div>
      )}
    </div>
  );
}