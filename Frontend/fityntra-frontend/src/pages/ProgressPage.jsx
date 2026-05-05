import React, { useState, useEffect } from "react";
import { getStreak, getFoodLogs } from "../services/api";

const GOAL_META = {
  weight_loss:  { label: "Weight Loss",  icon: "📉", color: "#EF4444", desc: "Calorie deficit to shed fat" },
  muscle_gain:  { label: "Muscle Gain",  icon: "💪", color: "#3B82F6", desc: "Surplus + protein to build mass" },
  maintenance:  { label: "Maintenance",  icon: "⚖️", color: "#F4A832", desc: "Balanced intake to stay steady" },
  endurance:    { label: "Endurance",    icon: "🏃", color: "#10B981", desc: "Cardio and stamina building" },
};

const DAILY_TARGETS = {
  weight_loss: { calories: 1600, protein: 140, carbs: 150, fat: 55 },
  muscle_gain: { calories: 2800, protein: 180, carbs: 320, fat: 80 },
  maintenance: { calories: 2000, protein: 130, carbs: 250, fat: 65 },
  endurance:   { calories: 2400, protein: 120, carbs: 300, fat: 70 },
};
const MILESTONES = [
  { id: "first_log",    icon: "🥗", label: "First Meal Logged",  desc: "Log your first meal",         target: 1,  unit: "logs" },
  { id: "logs_10",      icon: "📋", label: "10 Meals Logged",    desc: "Log 10 meals total",          target: 10, unit: "logs" },
  { id: "logs_50",      icon: "🌟", label: "50 Meals Logged",    desc: "Log 50 meals total",          target: 50, unit: "logs" },
  { id: "streak_3",     icon: "🔥", label: "3-Day Streak",       desc: "Log in 3 days straight",      target: 3,  unit: "days" },
  { id: "streak_7",     icon: "⚡", label: "7-Day Streak",       desc: "Log in 7 days straight",      target: 7,  unit: "days" },
  { id: "streak_30",    icon: "👑", label: "30-Day Streak",      desc: "Log in 30 days straight",     target: 30, unit: "days" },
  { id: "protein_goal", icon: "🥩", label: "Protein Champion",   desc: "Hit protein goal today",      target: 1,  unit: "times" },
  { id: "calorie_goal", icon: "🎯", label: "Calorie Goal Hit",   desc: "Stay within calorie target",  target: 1,  unit: "times" },
];

function Bar({ pct = 0, color = "#F4A832", height = 8 }) {
  return (
    <div style={{ height, background: "rgba(255,255,255,0.07)", borderRadius: height, overflow: "hidden" }}>
      <div style={{
        width: `${Math.min(100, pct)}%`, height: "100%",
        background: `linear-gradient(90deg, ${color}88, ${color})`,
        borderRadius: height, transition: "width 1s ease"
      }} />
    </div>
  );
}

function CircleProgress({ pct = 0, color = "#F4A832", size = 90, label, value }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const dash = Math.min(pct / 100, 1) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={7} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
        <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize={13} fontWeight={700}>
          {Math.round(pct)}%
        </text>
      </svg>
      <div style={{ fontSize: 11, color: "#888", textAlign: "center" }}>{label}</div>
      <div style={{ fontSize: 12, color: "#ccc", fontWeight: 600 }}>{value}</div>
    </div>
  );
}

export default function ProgressPage({ token, userId, userGoal = "maintain" }) {
  const [streak, setStreak] = useState(0);
  const [foodLogs, setFoodLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const goal = userGoal?.toLowerCase() || "maintain";
  const goalMeta = GOAL_META[goal] || GOAL_META.maintain;
  const targets = DAILY_TARGETS[goal] || DAILY_TARGETS.maintain;

  useEffect(() => {
    if (!userId || !token) { setLoading(false); return; }
    Promise.all([
      getStreak(userId, token).catch(() => ({ current_streak: 0 })),
      getFoodLogs(userId, token).catch(() => []),
    ]).then(([streakData, logs]) => {
      setStreak(streakData.current_streak ?? streakData.streak ?? 0);
      setFoodLogs(Array.isArray(logs) ? logs : logs.logs || []);
      setLoading(false);
    });
  }, [userId, token]);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayLogs = foodLogs.filter(l => (l.date || l.logged_at || "").startsWith(todayStr));
  const todayCal     = todayLogs.reduce((s, l) => s + (l.calories  || 0), 0);
  const todayProtein = todayLogs.reduce((s, l) => s + (l.protein_g || 0), 0);
  const todayCarbs   = todayLogs.reduce((s, l) => s + (l.carbs_g   || 0), 0);
  const todayFat     = todayLogs.reduce((s, l) => s + (l.fat_g     || 0), 0);
  const totalLogs = foodLogs.length;

  const milestoneProgress = {
    first_log:    Math.min(totalLogs, 1),
    logs_10:      Math.min(totalLogs, 10),
    logs_50:      Math.min(totalLogs, 50),
    streak_3:     Math.min(streak, 3),
    streak_7:     Math.min(streak, 7),
    streak_30:    Math.min(streak, 30),
    protein_goal: todayProtein >= targets.protein ? 1 : 0,
    calorie_goal: todayCal > 0 && todayCal <= targets.calories ? 1 : 0,
  };

  const macros = [
    { key: "calories", label: "Calories", val: Math.round(todayCal),     target: targets.calories, unit: "kcal", color: "#F4A832" },
    { key: "protein",  label: "Protein",  val: Math.round(todayProtein), target: targets.protein,  unit: "g",    color: "#3B82F6" },
    { key: "carbs",    label: "Carbs",    val: Math.round(todayCarbs),   target: targets.carbs,    unit: "g",    color: "#10B981" },
    { key: "fat",      label: "Fats",     val: Math.round(todayFat),     target: targets.fat,      unit: "g",    color: "#F59E0B" },
  ];

  if (loading) return (
    <div style={{ padding: 40, textAlign: "center", color: "var(--text-dim)" }}>
      Loading your progress...
    </div>
  );

  return (
    <div className="fade-in" style={{ padding: 24, maxWidth: 900 }}>
      <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: "var(--gold)", marginBottom: 6 }}>
        📊 My Progress
      </h2>
      <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 24 }}>
        Track your daily goals and milestones
      </p>

      {/* Goal Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${goalMeta.color}22, ${goalMeta.color}08)`,
        border: `1px solid ${goalMeta.color}44`,
        borderRadius: 16, padding: "20px 24px", marginBottom: 20,
        display: "flex", alignItems: "center", gap: 16
      }}>
        <div style={{ fontSize: 40 }}>{goalMeta.icon}</div>
        <div>
          <div style={{ fontSize: 11, color: goalMeta.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Current Goal</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", fontFamily: "'Cinzel', serif" }}>{goalMeta.label}</div>
          <div style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 2 }}>{goalMeta.desc}</div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#FF9800" }}>🔥 {streak}</div>
          <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase" }}>Day Streak</div>
        </div>
      </div>

      {/* Circle Charts */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: "var(--gold)", marginBottom: 20 }}>
          🎯 Today's Goal Progress
        </h3>
        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 16 }}>
          {macros.map((m) => (
            <CircleProgress key={m.key}
              pct={m.target > 0 ? (m.val / m.target) * 100 : 0}
              color={m.color} size={90} label={m.label}
              value={`${m.val} / ${m.target} ${m.unit}`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bars */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: "var(--gold)", marginBottom: 16 }}>
          📈 Nutrition Breakdown
        </h3>
        {macros.map((m) => (
          <div key={m.key} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "var(--text)" }}>{m.label}</span>
              <span style={{ fontSize: 13, color: m.color, fontWeight: 600 }}>{m.val} / {m.target} {m.unit}</span>
            </div>
            <Bar pct={m.target > 0 ? (m.val / m.target) * 100 : 0} color={m.color} height={10} />
          </div>
        ))}
        {todayCal === 0 && (
          <p style={{ fontSize: 12, color: "var(--text-dim)", textAlign: "center", marginTop: 8 }}>
            No meals logged today — go to Macro Tracker to start! 🥗
          </p>
        )}
      </div>

      {/* Milestones */}
      <div className="card">
        <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: "var(--gold)", marginBottom: 16 }}>
          🏅 Milestones
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {MILESTONES.map((m) => {
            const current = milestoneProgress[m.id] || 0;
            const pct = Math.min((current / m.target) * 100, 100);
            const done = pct >= 100;
            return (
              <div key={m.id} style={{
                padding: "14px 12px", borderRadius: 12,
                background: done ? "rgba(201,146,42,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${done ? "var(--gold)" : "rgba(255,255,255,0.08)"}`,
                opacity: done ? 1 : 0.7,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 22 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: done ? "var(--gold)" : "var(--text)" }}>{m.label}</div>
                    <div style={{ fontSize: 10, color: "var(--text-dim)" }}>{m.desc}</div>
                  </div>
                </div>
                <Bar pct={pct} color={done ? "#F4A832" : "#666"} height={6} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: "var(--text-dim)" }}>{current} / {m.target} {m.unit}</span>
                  {done && <span style={{ fontSize: 10, color: "var(--gold)" }}>✓ Done!</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 