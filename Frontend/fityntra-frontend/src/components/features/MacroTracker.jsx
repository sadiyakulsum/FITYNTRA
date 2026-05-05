import React, { useState,useEffect } from "react";
import { logFood, getFoodLogs } from "../../services/api";

// ─── Goals ────────────────────────────────────────────────────────────────────
const GOALS = {
  calories: 2000,
  carbs: 250,
  protein: 130,
  fat: 65,
  fiber: 30,
  water: 2500,
};

// ─── Food Database ─────────────────────────────────────────────────────────────
// unit: "piece" / "slice" → qty = number of pieces (macros are per 1 piece)
// unit: "g" / "ml"        → qty = grams/ml         (macros are per 100g/ml)
const FOOD_DB = [
  { name: "Roti",              unit: "piece", calories: 120, carbs: 24,  protein: 4,   fat: 1,   fiber: 2,   water: 0   },
  { name: "Chapati",           unit: "piece", calories: 120, carbs: 22,  protein: 4,   fat: 3,   fiber: 3,   water: 0   },
  { name: "Rice (cooked)",     unit: "g",     calories: 130, carbs: 28,  protein: 2.5, fat: 0.3, fiber: 0.4, water: 0   },
  { name: "Dal (cooked)",      unit: "g",     calories: 116, carbs: 20,  protein: 9,   fat: 0.4, fiber: 8,   water: 0   },
  { name: "Paneer",            unit: "g",     calories: 265, carbs: 3.5, protein: 18,  fat: 20,  fiber: 0,   water: 0   },
  { name: "Chicken (cooked)",  unit: "g",     calories: 215, carbs: 0,   protein: 25,  fat: 12,  fiber: 0,   water: 0   },
  { name: "Egg",               unit: "piece", calories: 70,  carbs: 0.5, protein: 6,   fat: 5,   fiber: 0,   water: 0   },
  { name: "Banana",            unit: "piece", calories: 105, carbs: 27,  protein: 1.3, fat: 0.3, fiber: 3.1, water: 0   },
  { name: "Apple",             unit: "piece", calories: 78,  carbs: 21,  protein: 0.4, fat: 0.2, fiber: 3.6, water: 0   },
  { name: "Milk",              unit: "ml",    calories: 61,  carbs: 4.7, protein: 3.2, fat: 3.3, fiber: 0,   water: 100 },
  { name: "Curd / Yogurt",     unit: "g",     calories: 98,  carbs: 12,  protein: 6,   fat: 4,   fiber: 0,   water: 80  },
  { name: "Oats",              unit: "g",     calories: 389, carbs: 67,  protein: 17,  fat: 7,   fiber: 10,  water: 0   },
  { name: "Bread",             unit: "slice", calories: 79,  carbs: 15,  protein: 2.7, fat: 1,   fiber: 0.6, water: 0   },
  { name: "Idli",              unit: "piece", calories: 58,  carbs: 12,  protein: 2,   fat: 0.4, fiber: 0.5, water: 0   },
  { name: "Dosa",              unit: "piece", calories: 133, carbs: 25,  protein: 4,   fat: 2.5, fiber: 1,   water: 0   },
  { name: "Sambar",            unit: "ml",    calories: 55,  carbs: 9,   protein: 3,   fat: 1,   fiber: 3,   water: 80  },
  { name: "Poha",              unit: "g",     calories: 130, carbs: 28,  protein: 2,   fat: 1,   fiber: 1,   water: 0   },
  { name: "Upma",              unit: "g",     calories: 145, carbs: 22,  protein: 4,   fat: 4,   fiber: 2,   water: 0   },
  { name: "Almonds",           unit: "g",     calories: 579, carbs: 22,  protein: 21,  fat: 50,  fiber: 13,  water: 0   },
  { name: "Peanuts",           unit: "g",     calories: 567, carbs: 16,  protein: 26,  fat: 49,  fiber: 9,   water: 0   },
  { name: "Potato (boiled)",   unit: "g",     calories: 87,  carbs: 20,  protein: 1.9, fat: 0.1, fiber: 1.8, water: 0   },
  { name: "Tomato",            unit: "piece", calories: 18,  carbs: 3.9, protein: 0.9, fat: 0.2, fiber: 1.2, water: 94  },
  { name: "Tea (with milk)",   unit: "ml",    calories: 30,  carbs: 4,   protein: 1,   fat: 1,   fiber: 0,   water: 90  },
  { name: "Coffee (black)",    unit: "ml",    calories: 5,   carbs: 1,   protein: 0.3, fat: 0,   fiber: 0,   water: 98  },
  { name: "Water",             unit: "ml",    calories: 0,   carbs: 0,   protein: 0,   fat: 0,   fiber: 0,   water: 100 },
];

const MEAL_COLORS = {
  breakfast: { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
  lunch:     { bg: "#FED7AA", text: "#9A3412", border: "#FB923C" },
  snack:     { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7" },
  dinner:    { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD" },
};

const MACROS = [
  { key: "calories", label: "Calories", unit: "kcal", color: "#F4A832", icon: "🔥" },
  { key: "carbs",    label: "Carbs",    unit: "g",    color: "#E8B84B", icon: "🍞" },
  { key: "protein",  label: "Protein",  unit: "g",    color: "#5A8EC0", icon: "🥩" },
  { key: "fat",      label: "Fats",     unit: "g",    color: "#C97840", icon: "🧈" },
  { key: "fiber",    label: "Fiber",    unit: "g",    color: "#66AA88", icon: "🥦" },
  { key: "water",    label: "Water",    unit: "ml",   color: "#60B0E0", icon: "💧" },
];

const emptyLog = () => ({
  calories: 0, carbs: 0, protein: 0, fat: 0, fiber: 0, water: 0, items: [],
});

// ─── Macro calculation ────────────────────────────────────────────────────────
function calcMacros(food, qty) {
  const isPiece = food.unit === "piece" || food.unit === "slice";
  const factor  = isPiece ? qty : qty / 100;
  const r = (n) => Math.round(n * factor * 10) / 10;
  return {
    calories: r(food.calories),
    carbs:    r(food.carbs),
    protein:  r(food.protein),
    fat:      r(food.fat),
    fiber:    r(food.fiber),
    water:    r(food.water),
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Bar({ pct = 0, color = "#F4A832" }) {
  return (
    <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden", marginTop: 6 }}>
      <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.4s ease" }} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MacroTracker({token,userId}) {
  const [log, setLog]           = useState(emptyLog);
  const [meal, setMeal]         = useState("breakfast");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState(null);
  const [qty, setQty]           = useState("");
  const [saved, setSaved]       = useState(false);
  const [preview, setPreview]   = useState(null);
  useEffect(() => {
  if (!userId || !token) return;
  getFoodLogs(userId, token)
    .then((data) => {
      const logs = Array.isArray(data) ? data : data.logs || [];
      if (logs.length === 0) return;
      const rebuilt = emptyLog();
      logs.forEach((entry) => {
        rebuilt.calories += entry.calories || 0;
        rebuilt.carbs    += entry.carbs_g  || 0;
        rebuilt.protein  += entry.protein_g || 0;
        rebuilt.fat      += entry.fat_g    || 0;
        rebuilt.items.push({
          id: entry.id || Date.now() + Math.random(),
          meal: entry.meal_type || "breakfast",
          name: entry.food_name,
          unitLabel: "",
          calories: entry.calories   || 0,
          carbs:    entry.carbs_g    || 0,
          protein:  entry.protein_g  || 0,
          fat:      entry.fat_g      || 0,
          fiber:    entry.fiber_g    || 0,
          water:    0,
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        });
      });
      setLog(rebuilt);
    })
    .catch(() => {});
}, [userId, token]);

  const filtered = search.trim().length > 0 && !selected
    ? FOOD_DB.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  const selectFood = (food) => {
    setSelected(food);
    setSearch(food.name);
    setQty("");
    setPreview(null);
  };

  const handleQtyChange = (val) => {
    setQty(val);
    setPreview(selected && +val > 0 ? calcMacros(selected, +val) : null);
  };

  const addEntry = async() => {
    if (!selected || !qty || +qty <= 0) return;
    const macros = calcMacros(selected, +qty);
    const isPiece = selected.unit === "piece" || selected.unit === "slice";
    const entry = {
      id: Date.now(), meal,
      name: selected.name,
      unitLabel: isPiece
        ? `${qty} ${selected.unit}${+qty !== 1 ? "s" : ""}`
        : `${qty}${selected.unit}`,
      ...macros,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };
    setLog((prev) => ({
      calories: prev.calories + macros.calories,
      carbs:    prev.carbs    + macros.carbs,
      protein:  prev.protein  + macros.protein,
      fat:      prev.fat      + macros.fat,
      fiber:    prev.fiber    + macros.fiber,
      water:    prev.water    + macros.water,
      items: [...prev.items, entry],
    }));
    setSearch(""); setSelected(null); setQty(""); setPreview(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
    if (userId && token) {
  try {
    await logFood({
      user_id: userId,
      food_name: selected.name,
      meal_type: meal,
      quantity_grams:parseFloat(qty),
      calories: macros.calories,
      carbs_g: macros.carbs,
      protein_g: macros.protein,
      fat_g: macros.fat,
      fiber_g: macros.fiber,
    }, token);
  } catch (e) {
    console.error("Food log sync failed:", e.message);
  }
}
  };

  const removeEntry = (id) => {
    const e = log.items.find((i) => i.id === id);
    if (!e) return;
    setLog((prev) => ({
      calories: prev.calories - e.calories,
      carbs:    prev.carbs    - e.carbs,
      protein:  prev.protein  - e.protein,
      fat:      prev.fat      - e.fat,
      fiber:    prev.fiber    - e.fiber,
      water:    prev.water    - e.water,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  const grouped = log.items.reduce((acc, item) => {
    if (!acc[item.meal]) acc[item.meal] = [];
    acc[item.meal].push(item);
    return acc;
  }, {});

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });

  // ─── Styles ─────────────────────────────────────────────────────────────────
  const s = {
    wrapper:      { padding: 24, maxWidth: 960, fontFamily: "sans-serif" },
    header:       { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
    title:        { fontFamily: "'Cinzel', serif", fontSize: 22, color: "var(--gold, #F4A832)", margin: 0 },
    subtitle:     { color: "#888", fontSize: 13, marginTop: 4 },
    btnGhost:     { background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 14px", fontSize: 13, color: "#aaa", cursor: "pointer" },
    macroGrid:    { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 20 },
    macroCard:    { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 14px", textAlign: "center" },
    section:      { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 18, marginBottom: 16 },
    sectionTitle: { fontSize: 15, fontWeight: 600, color: "var(--gold, #F4A832)", marginBottom: 14 },
    mealTabs:     { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 },
    input:        { width: "100%", padding: "9px 12px", fontSize: 13, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", outline: "none", boxSizing: "border-box" },
    dropdown:     { position: "absolute", top: "100%", left: 0, right: 0, background: "#1e1e2e", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, zIndex: 100, maxHeight: 220, overflowY: "auto", marginTop: 4 },
    dropItem:     { padding: "9px 12px", cursor: "pointer", fontSize: 13, color: "#ddd", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" },
    qtyRow:       { display: "flex", gap: 10, marginTop: 12, alignItems: "flex-end" },
    unitBadge:    { padding: "9px 14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 13, color: "#888", whiteSpace: "nowrap" },
    btnAdd:       { padding: "9px 22px", background: "var(--gold, #F4A832)", color: "#000", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "opacity 0.15s" },
    preview:      { marginTop: 12, padding: "10px 14px", background: "rgba(244,168,50,0.08)", border: "1px solid rgba(244,168,50,0.2)", borderRadius: 10, display: "flex", flexWrap: "wrap", gap: 14 },
    previewVal:   { fontWeight: 600, color: "#F4A832" },
    entryRow:     { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" },
    entryName:    { fontSize: 13, color: "#eee" },
    entryMeta:    { fontSize: 11, color: "#888", marginTop: 2 },
    entryDel:     { width: 26, height: 26, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#888", cursor: "pointer", fontSize: 12, flexShrink: 0 },
    empty:        { textAlign: "center", padding: "20px 0", color: "#666", fontSize: 13 },
    mealLabel:    (m) => ({ display: "inline-block", fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 10, marginBottom: 6, marginTop: 10, background: MEAL_COLORS[m].bg, color: MEAL_COLORS[m].text }),
  };

  return (
    <div style={s.wrapper}>

      {/* ── Header ── */}
      <div style={s.header}>
        <div>
          <h2 style={s.title}>🥗 Macro Tracker</h2>
          <p style={s.subtitle}>{today}</p>
        </div>
        <button style={s.btnGhost} onClick={() => setLog(emptyLog())}>🗑 Reset</button>
      </div>

      {/* ── Macro summary cards ── */}
      <div style={s.macroGrid}>
        {MACROS.map((m) => {
          const val = log[m.key] || 0;
          const pct = Math.min(100, Math.round((val / GOALS[m.key]) * 100));
          return (
            <div key={m.key} style={s.macroCard}>
              <div style={{ fontSize: 20 }}>{m.icon}</div>
              <div style={{ color: m.color, fontWeight: 700, fontSize: 18, marginTop: 4 }}>{val}</div>
              <div style={{ fontSize: 11, color: "#888" }}>/{GOALS[m.key]} {m.unit}</div>
              <Bar pct={pct} color={m.color} />
            </div>
          );
        })}
      </div>

      {/* ── Log Food ── */}
      <div style={s.section}>
        <div style={s.sectionTitle}>➕ Log Food</div>

        {/* Meal tabs */}
        <div style={s.mealTabs}>
          {Object.keys(MEAL_COLORS).map((m) => {
            const active = meal === m;
            const mc = MEAL_COLORS[m];
            return (
              <button key={m} onClick={() => setMeal(m)} style={{
                padding: "5px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                fontWeight: active ? 600 : 400,
                background: active ? mc.bg : "transparent",
                border: `1px solid ${active ? mc.border : "rgba(255,255,255,0.15)"}`,
                color: active ? mc.text : "#aaa", transition: "all 0.15s",
              }}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Search box */}
        <div style={{ position: "relative" }}>
          <input
            style={s.input}
            placeholder="Search food — e.g. Rice, Egg, Banana..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSelected(null); setPreview(null); setQty(""); }}
          />
          {filtered.length > 0 && (
            <div style={s.dropdown}>
              {filtered.map((food, i) => (
                <div
                  key={i}
                  style={s.dropItem}
                  onClick={() => selectFood(food)}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(244,168,50,0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <span>{food.name}</span>
                  <span style={{ color: "#555", fontSize: 11 }}>
                    {food.unit === "piece" || food.unit === "slice"
                      ? `per ${food.unit} · ${food.calories} kcal`
                      : `per 100${food.unit} · ${food.calories} kcal`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quantity row — appears after food is picked */}
        {selected && (
          <>
            <div style={s.qtyRow}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>
                  How much? ({selected.unit === "piece" || selected.unit === "slice" ? "number of " + selected.unit + "s" : selected.unit})
                </div>
                <input
                  type="number"
                  min="0.5"
                  step={selected.unit === "piece" || selected.unit === "slice" ? "1" : "10"}
                  style={s.input}
                  placeholder={selected.unit === "piece" || selected.unit === "slice" ? "e.g. 2" : "e.g. 150"}
                  value={qty}
                  onChange={(e) => handleQtyChange(e.target.value)}
                  autoFocus
                />
              </div>
              <div style={s.unitBadge}>
                {selected.unit === "piece" || selected.unit === "slice" ? selected.unit + "s" : selected.unit}
              </div>
              <button
                style={{ ...s.btnAdd, opacity: (!qty || +qty <= 0) ? 0.5 : 1 }}
                onClick={addEntry}
                disabled={!qty || +qty <= 0}
              >
                {saved ? "✓ Added!" : "Add"}
              </button>
            </div>

            {/* Live macro preview */}
            {preview && (
              <div style={s.preview}>
                {[
                  ["Calories", preview.calories, "kcal"],
                  ["Carbs",    preview.carbs,    "g"],
                  ["Protein",  preview.protein,  "g"],
                  ["Fat",      preview.fat,      "g"],
                  ["Fiber",    preview.fiber,    "g"],
                  ...(preview.water > 0 ? [["Water", preview.water, "ml"]] : []),
                ].map(([label, val, unit]) => (
                  <div key={label} style={{ fontSize: 12, color: "#aaa" }}>
                    {label}: <span style={s.previewVal}>{val} {unit}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Entries ── */}
      <div style={s.section}>
        <div style={s.sectionTitle}>
          📋 Today's Entries {log.items.length > 0 && `(${log.items.length})`}
        </div>

        {log.items.length === 0 ? (
          <div style={s.empty}>No entries yet — search for a food item above to get started</div>
        ) : (
          ["breakfast", "lunch", "snack", "dinner"].map((m) => {
            const items = grouped[m];
            if (!items?.length) return null;
            return (
              <div key={m}>
                <div style={s.mealLabel(m)}>{m.charAt(0).toUpperCase() + m.slice(1)}</div>
                {items.map((item) => (
                  <div key={item.id} style={s.entryRow}>
                    <div style={{ flex: 1 }}>
                      <div style={s.entryName}>
                        {item.name}
                        <span style={{ color: "#555", fontSize: 11, marginLeft: 8 }}>{item.unitLabel}</span>
                      </div>
                      <div style={s.entryMeta}>
                        {item.calories} kcal · P {item.protein}g · C {item.carbs}g · F {item.fat}g · {item.time}
                      </div>
                    </div>
                    <button style={s.entryDel} onClick={() => removeEntry(item.id)}>✕</button>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
