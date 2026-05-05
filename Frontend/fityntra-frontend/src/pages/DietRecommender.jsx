import React, { useState, useEffect } from "react";
import { predictDiet } from "../services/api";

const GOAL_META = {
  weight_loss: { label: "Weight Loss", icon: "📉", color: "#EF4444" },
  muscle_gain: { label: "Muscle Gain", icon: "💪", color: "#3B82F6" },
  maintenance: { label: "Maintenance", icon: "⚖️", color: "#F4A832" },
  endurance:   { label: "Endurance",   icon: "🏃", color: "#10B981" },
};

const DIET_META = {
  vegetarian:     { label: "🥦 Vegetarian" },
  vegan:          { label: "🌱 Vegan"       },
  non_vegetarian: { label: "🍗 Non-Veg"     },
};

const MEAL_ICONS = {
  breakfast:    "🌅",
  lunch:        "☀️",
  snack:        "🍌",
  snacks:       "🍌",
  dinner:       "🌙",
  post_workout: "💪",
};

function Bar({ pct = 0, color = "var(--gold)" }) {
  return (
    <div style={{
      height: 6, background: "rgba(255,255,255,0.07)",
      borderRadius: 6, overflow: "hidden",
    }}>
      <div style={{
        width: `${Math.min(100, Math.max(0, pct))}%`,
        height: "100%", background: color,
        borderRadius: 6, transition: "width 0.5s ease",
      }} />
    </div>
  );
}

export default function DietRecommender({ token, userId, user }) {
  const [goal,     setGoal]     = useState(user?.goal || "maintenance");
  const [dietType, setDietType] = useState(user?.dietary_preference || "vegetarian");
  const [loading,  setLoading]  = useState(false);
  const [plan,     setPlan]     = useState(null);
  const [error,    setError]    = useState("");

  const fetchDietPlan = async () => {
    if (!token || !userId) {
      setError("Please login to get your personalized diet plan.");
      return;
    }
    setLoading(true);
    setError("");
    setPlan(null);
    try {
      const data = await predictDiet(
        {
          user_id:            userId,
          age:                user?.age            || 25,
          height_cm:          user?.height_cm      || 170,
          weight_kg:          user?.weight_kg      || 70,
          gender:             user?.gender         || "female",
          goal:               goal,
          activity_level:     user?.activity_level || "moderate",
          dietary_preference: dietType,
        },
        token
      );
      setPlan(data);
    } catch (e) {
      setError("Could not fetch diet plan: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) fetchDietPlan();
  }, [goal, dietType]);

  const macros  = plan?.daily_macros ?? null;
  const mealPlan = plan?.meal_plan   ?? null;
  const tips     = plan?.tips        ?? [];

  return (
    <div className="fade-in" style={{ padding: 24, maxWidth: 900 }}>

      <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 20,
        color: "var(--gold)", marginBottom: 6 }}>
        🥗 Diet Recommender
      </h2>
      <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 20 }}>
        AI-powered personalized Indian meal plan based on your goal
      </p>

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

      {/* Diet type selector */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.08em",
          textTransform: "uppercase", marginBottom: 8 }}>Diet Preference</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Object.entries(DIET_META).map(([k, v]) => (
            <button key={k} onClick={() => setDietType(k)}
              className={dietType === k ? "btn-gold" : "btn-ghost"}
              style={{ fontSize: 12, padding: "7px 14px" }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: 14, background: "rgba(255,80,80,0.08)",
          border: "1px solid rgba(255,80,80,0.3)", borderRadius: 10,
          color: "#ff8080", marginBottom: 20, fontSize: 13,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: 48, color: "var(--text-dim)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
          <p>Generating your personalized meal plan...</p>
        </div>
      )}

      {/* Plan */}
      {plan && !loading && (
        <div>

          {/* Macro cards */}
          {macros && (
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", color: "var(--gold)",
                marginBottom: 16, fontSize: 14 }}>
                📊 Daily Macro Targets
              </h3>
              <div style={{ display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10 }}>
                {[
                  { label: "Calories", val: Math.round(macros.calories),
                    unit: "kcal", color: "#F4A832", pct: 100 },
                  { label: "Protein",  val: macros.protein_g, unit: "g",
                    color: "#3B82F6",
                    pct: Math.round((macros.protein_g * 4 / macros.calories) * 100) },
                  { label: "Carbs",    val: macros.carbs_g,   unit: "g",
                    color: "#10B981",
                    pct: Math.round((macros.carbs_g   * 4 / macros.calories) * 100) },
                  { label: "Fat",      val: macros.fat_g,     unit: "g",
                    color: "#F59E0B",
                    pct: Math.round((macros.fat_g     * 9 / macros.calories) * 100) },
                ].map(m => (
                  <div key={m.label} style={{ textAlign: "center",
                    background: "var(--bg-input)", borderRadius: 10, padding: "14px 8px" }}>
                    <div style={{ fontSize: 20, fontWeight: 700,
                      color: m.color, lineHeight: 1 }}>{m.val}</div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>
                      {m.label} ({m.unit})
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <Bar pct={m.pct} color={m.color} />
                    </div>
                    <div style={{ fontSize: 10, color: m.color, marginTop: 4 }}>
                      {m.pct}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meals */}
          {mealPlan && (
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", color: "var(--gold)",
                marginBottom: 16, fontSize: 14 }}>
                🍽️ Your Meal Plan
              </h3>
              {Object.entries(mealPlan).map(([mealKey, items]) => {
                if (!items || (Array.isArray(items) && items.length === 0)) return null;
                return (
                  <div key={mealKey} style={{ padding: "14px 0",
                    borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center",
                      gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: 22, flexShrink: 0 }}>
                        {MEAL_ICONS[mealKey] || "🍽️"}
                      </span>
                      <span style={{ fontFamily: "'Cinzel', serif", fontSize: 14,
                        color: "var(--gold-light)", textTransform: "capitalize" }}>
                        {mealKey.replace(/_/g, " ")}
                      </span>
                    </div>
                    {Array.isArray(items) && items.map((item, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "5px 0 5px 32px", fontSize: 13,
                        color: "var(--text-dim)",
                        borderBottom: i < items.length - 1
                          ? "1px solid rgba(201,146,42,0.07)" : "none",
                      }}>
                        <span style={{ color: "var(--gold)", fontSize: 10 }}>◆</span>
                        {typeof item === "string" ? item : item.name || JSON.stringify(item)}
                      </div>
                    ))}
                    {typeof items === "string" && (
                      <div style={{ fontSize: 13, color: "var(--text-dim)", paddingLeft: 32 }}>
                        {items}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tips */}
          {tips.length > 0 && (
            <div className="card" style={{ marginBottom: 20,
              background: "linear-gradient(135deg, #1A1200, #221800)" }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", color: "var(--gold)",
                marginBottom: 14, fontSize: 14 }}>
                💡 Nutrition Tips
              </h3>
              {tips.map((tip, i) => (
                <div key={i} style={{
                  fontSize: 13, color: "var(--text-dim)", padding: "7px 0",
                  borderBottom: i < tips.length - 1 ? "1px solid var(--border)" : "none",
                  display: "flex", gap: 10,
                }}>
                  <span style={{ color: "var(--gold)", flexShrink: 0 }}>✦</span>
                  {tip}
                </div>
              ))}
            </div>
          )}

          {plan.model_version && (
            <div style={{ textAlign: "right", fontSize: 11, color: "var(--text-muted)" }}>
              Model: {plan.model_version}
            </div>
          )}

        </div>
      )}

      {/* Empty state */}
      {!plan && !loading && !error && (
        <div style={{ textAlign: "center", padding: 48, color: "var(--text-dim)" }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>🥗</div>
          <p style={{ fontSize: 14 }}>
            Select your goal and diet preference above to get your personalized meal plan!
          </p>
        </div>
      )}

    </div>
  );
}