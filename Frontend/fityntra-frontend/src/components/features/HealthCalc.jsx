import React, { useState } from "react";
import { predictFitnessLevel } from "../../services/api";

export default function HealthCalc({ onDietRec, onWorkoutRec, token, userId, user }) {
  const [form, setForm] = useState({
    age:      user?.age      || 25,
    gender:   user?.gender   || "female",
    height:   user?.height_cm || 170,
    weight:   user?.weight_kg || 70,
    activity: user?.activity_level || "moderate",
    rhr:      70,
  });
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [fitnessLevel, setFitnessLevel] = useState(null);

  const actMap = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };

  const calculate = async () => {
    const { age, gender, height, weight, activity, rhr } = form;
    const h = +height, w = +weight, a = +age;
    const bmr = gender === "male"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;
    const tdee = Math.round(bmr * (actMap[activity] || 1.55));
    const bmi  = +(w / ((h / 100) ** 2)).toFixed(1);
    const bmiCat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
    const carbs   = Math.round((tdee * 0.45) / 4);
    const protein = Math.round((tdee * 0.25) / 4);
    const fat     = Math.round((tdee * 0.30) / 9);
    setResult({ bmr: Math.round(bmr), tdee, bmi, bmiCat, carbs, protein, fat });

    if (token && userId) {
      setLoading(true);
      try {
        const fl = await predictFitnessLevel({
          user_id:              userId,
          age:                  a,
          weight_kg:            w,
          height_cm:            h,
          resting_heart_rate:   +rhr,
          exercise_frequency:   activity === "sedentary" ? 0 : activity === "light" ? 2 : activity === "moderate" ? 4 : 6,
        }, token);
        setFitnessLevel(fl);
      } catch (e) {
        console.error("Fitness level error:", e.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const bmiColor = (b) => b < 18.5 ? "#5A8EC0" : b < 25 ? "var(--green)" : b < 30 ? "var(--amber)" : "var(--red)";

  return (
    <div className="fade-in" style={{ padding: 24, maxWidth: 900 }}>
      <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: "var(--gold)", marginBottom: 6 }}>
        ⚕️ Health Calculators
      </h2>
      <p style={{ color: "var(--text-dim)", marginBottom: 24, fontSize: 13 }}>
        Calculate your BMI, TDEE and AI Fitness Level Assessment
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Input form */}
        <div className="card">
          <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 15, color: "var(--gold-light)", marginBottom: 18 }}>
            Your Details
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { key: "age",    label: "Age",               type: "number", unit: "years" },
              { key: "height", label: "Height",            type: "number", unit: "cm"    },
              { key: "weight", label: "Weight",            type: "number", unit: "kg"    },
              { key: "rhr",    label: "Resting Heart Rate",type: "number", unit: "bpm"   },
            ].map(f => (
              <div key={f.key}>
                <label className="lbl">{f.label}</label>
                <div style={{ position: "relative" }}>
                  <input className="inp" type="number" value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ paddingRight: 42 }} />
                  <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", fontSize: 12 }}>
                    {f.unit}
                  </span>
                </div>
              </div>
            ))}
            <div>
              <label className="lbl">Gender</label>
              <select className="inp" value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <label className="lbl">Activity Level</label>
            <select className="inp" value={form.activity} onChange={e => setForm(p => ({ ...p, activity: e.target.value }))}>
              <option value="sedentary">Sedentary (little/no exercise)</option>
              <option value="light">Light (1–3 days/week)</option>
              <option value="moderate">Moderate (3–5 days/week)</option>
              <option value="active">Active (6–7 days/week)</option>
              <option value="very_active">Very Active (hard daily exercise)</option>
            </select>
          </div>

          <button className="btn-gold" style={{ width: "100%", marginTop: 20, padding: 12 }} onClick={calculate} disabled={loading}>
            {loading ? "⏳ Calculating..." : "🔢 Calculate"}
          </button>
        </div>

        {/* Results */}
        <div>
          {!result ? (
            <div className="card" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
              <span style={{ fontSize: 48 }}>🧮</span>
              <p style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center" }}>
                Fill your details and click Calculate to see your BMI, TDEE & AI Fitness Level
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* BMI */}
              <div className="card">
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: "var(--gold)", marginBottom: 12 }}>BMI Result</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", border: `4px solid ${bmiColor(result.bmi)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 22, fontWeight: 700, color: bmiColor(result.bmi) }}>{result.bmi}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: bmiColor(result.bmi) }}>{result.bmiCat}</div>
                    <div style={{ color: "var(--text-dim)", fontSize: 12, marginTop: 4 }}>Body Mass Index</div>
                    <div style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 4 }}>Healthy range: 18.5 – 24.9</div>
                  </div>
                </div>
              </div>

              {/* TDEE */}
              <div className="card">
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: "var(--gold)", marginBottom: 10 }}>Your TDEE</h3>
                <div style={{ textAlign: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 42, fontWeight: 700, color: "var(--amber)", lineHeight: 1 }}>{result.tdee.toLocaleString()}</div>
                  <div style={{ color: "var(--text-dim)", fontSize: 13 }}>kcal / day</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[
                    { label: "Carbs",   val: result.carbs,   color: "#E8B84B" },
                    { label: "Protein", val: result.protein, color: "#5A8EC0" },
                    { label: "Fats",    val: result.fat,     color: "#C97840" },
                  ].map(m => (
                    <div key={m.label} style={{ textAlign: "center", background: "var(--bg-input)", borderRadius: 8, padding: "10px 6px" }}>
                      <div style={{ fontWeight: 700, color: m.color, fontSize: 16 }}>{m.val}g</div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fitness Level from AI */}
              {fitnessLevel && (
                <div className="card">
                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: "var(--gold)", marginBottom: 10 }}>
                    🤖 AI Fitness Assessment
                  </h3>
                  <div style={{ textAlign: "center", padding: "10px 0" }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "var(--gold)", textTransform: "capitalize" }}>
                      {fitnessLevel.fitness_level || fitnessLevel.level || "Intermediate"}
                    </div>
                    {fitnessLevel.recommendation && (
                      <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 8 }}>
                        {fitnessLevel.recommendation}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CTA buttons */}
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-gold" style={{ flex: 1, padding: 11, fontSize: 12 }} onClick={onDietRec}>
                  🍱 Diet Plan →
                </button>
                <button className="btn-ghost" style={{ flex: 1, fontSize: 12 }} onClick={onWorkoutRec}>
                  🏋️ Workout Plan →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}