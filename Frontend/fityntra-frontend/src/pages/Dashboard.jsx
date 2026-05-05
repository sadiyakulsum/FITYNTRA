import React, { useState,useEffect } from "react";
import { getStreak,checkInStreak,getFoodLogs} from "../services/api";

function Dashboard({ userName = "User",token,userId }) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [streak, setStreak] = useState(12); // Mock streak
  useEffect(() => {
  if (!userId || !token) return;
  getStreak(userId, token)
    .then((data) => setStreak(data.current_streak ?? data.streak ?? 0))
    .catch(() => {});
}, [userId, token]);
  const [diet, setDiet] = useState({
    breakfast: { name: "Oats, banana, milk", cal: 380, carbs: 60, protein: 14, fat: 8 },
    lunch: { name: "Dal, rice, salad", cal: 520, carbs: 85, protein: 22, fat: 10 },
    snack: { name: "Greek yogurt, fruits", cal: 180, carbs: 28, protein: 10, fat: 4 },
    dinner: { name: "Roti, paneer bhurji", cal: 460, carbs: 55, protein: 24, fat: 16 },
  });
  const [foodLogs, setFoodLogs] = useState([]);

useEffect(() => {
  if (!userId || !token) return;
  getFoodLogs(userId, token)
    .then((data) => {
      const logs = Array.isArray(data) ? data : data.logs || [];
      setFoodLogs(logs);
    })
    .catch(() => {});
}, [userId, token]);

  const totalCal   = foodLogs.reduce((s, m) => s + (m.calories  || 0), 0);
  const totalCarbs = foodLogs.reduce((s, m) => s + (m.carbs_g   || 0), 0);
  const totalProt  = foodLogs.reduce((s, m) => s + (m.protein_g || 0), 0);
  const totalFat   = foodLogs.reduce((s, m) => s + (m.fat_g     || 0), 0);
  const goalCal = 2000;

  const [editMeal, setEditMeal] = useState(null);
  const [editVal, setEditVal] = useState({});

  const openEdit = (key) => {
    setEditMeal(key);
    setEditVal({ ...diet[key] });
  };

  const saveEdit = () => {
    setDiet((d) => ({
      ...d,
      [editMeal]: {
        ...editVal,
        cal: Number(editVal.cal) || 0,
        carbs: Number(editVal.carbs) || 0,
        protein: Number(editVal.protein) || 0,
        fat: Number(editVal.fat) || 0,
      },
    }));
    setEditMeal(null);
  };

  const mealIcons = {
    breakfast: "🌅",
    lunch: "☀️",
    snack: "🍌",
    dinner: "🌙",
  };

  return (
    <div className="fade-in" style={{ padding: 24 }}>
      
      {/* Header & Streak Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: "var(--text)", margin: 0 }}>
            Namaste, {userName} 🙏
          </h2>
          <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 4 }}>
            {today}
          </p>
        </div>
        
        {/* Streak Badge */}
        <div style={{ 
          display: "flex", alignItems: "center", gap: 8, 
          background: "rgba(255, 152, 0, 0.1)", border: "1px solid rgba(255, 152, 0, 0.2)",
          padding: "8px 16px", borderRadius: 12 
        }}>
          <span style={{ fontSize: 20 }}>🔥</span>
          <div>
            <div style={{ color: "#FF9800", fontWeight: "bold", lineHeight: 1 }}>{streak} Days</div>
            <div style={{ fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase" }}>Current Streak</div>
          </div>
        </div>
      </div>

      {/* Macro Summary Card */}
      <div className="card" style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", textAlign: "center" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase" }}>Calories</div>
          <div style={{ color: "var(--gold)", fontWeight: "bold", fontSize: 18 }}>{totalCal} / {goalCal}</div>
        </div>
        <div style={{ width: 1, background: "var(--border)", margin: "0 10px" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase" }}>Protein</div>
          <div style={{ color: "var(--text)", fontWeight: "bold", fontSize: 18 }}>{totalProt}g</div>
        </div>
        <div style={{ width: 1, background: "var(--border)", margin: "0 10px" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase" }}>Carbs</div>
          <div style={{ color: "var(--text)", fontWeight: "bold", fontSize: 18 }}>{totalCarbs}g</div>
        </div>
        <div style={{ width: 1, background: "var(--border)", margin: "0 10px" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase" }}>Fat</div>
          <div style={{ color: "var(--text)", fontWeight: "bold", fontSize: 18 }}>{totalFat}g</div>
        </div>
      </div>

      {/* Diet Section (Full Width List) */}
      <div className="card">
  <h3 style={{ fontFamily: "'Cinzel', serif", color: "var(--gold)", marginBottom: 16 }}>
    🍽️ Today's Diet Log
  </h3>
  {foodLogs.length === 0 ? (
    <p style={{ color: "var(--text-dim)", fontSize: 13 }}>
      No meals logged today. Go to Macro Tracker to log your meals!
    </p>
  ) : (
    foodLogs.map((entry, i) => (
      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ fontSize: 20 }}>{mealIcons[entry.meal_type] || "🍽️"}</div>
          <div>
            <b style={{ fontSize: 15, color: "var(--text)" }}>{entry.food_name}</b>
            <div style={{ fontSize: 12, color: "var(--text-dim)", textTransform: "capitalize" }}>{entry.meal_type}</div>
          </div>
        </div>
        <div style={{ color: "var(--amber)", fontWeight: "bold" }}>{entry.calories} kcal</div>
      </div>
    ))
  )}
</div>

      {/* Edit Modal (Themed) */}
      {editMeal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100, padding: 20 }}>
          <div className="card fade-in" style={{ width: "100%", maxWidth: 360 }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", color: "var(--gold-light)" }}>Edit {editMeal}</h3>

            <div style={{ marginTop: 16 }}>
              <label className="lbl">Meal Name</label>
              <input className="inp" value={editVal.name || ""} onChange={(e) => setEditVal({...editVal, name: e.target.value})} />
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                <div>
                   <label className="lbl">Calories</label>
                   <input className="inp" type="number" value={editVal.cal || ""} onChange={(e) => setEditVal({...editVal, cal: e.target.value})} />
                </div>
                <div>
                   <label className="lbl">Protein (g)</label>
                   <input className="inp" type="number" value={editVal.protein || ""} onChange={(e) => setEditVal({...editVal, protein: e.target.value})} />
                </div>
                <div>
                   <label className="lbl">Carbs (g)</label>
                   <input className="inp" type="number" value={editVal.carbs || ""} onChange={(e) => setEditVal({...editVal, carbs: e.target.value})} />
                </div>
                <div>
                   <label className="lbl">Fat (g)</label>
                   <input className="inp" type="number" value={editVal.fat || ""} onChange={(e) => setEditVal({...editVal, fat: e.target.value})} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button className="btn-gold" style={{ flex: 1 }} onClick={saveEdit}>Save</button>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setEditMeal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;