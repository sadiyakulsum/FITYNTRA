import React, { useState, useEffect, useRef } from "react";

export default function CalendarItems({ todayPlan }) {
  const [checked, setChecked] = useState({});

  const toggle = (i) =>
    setChecked((c) => ({ ...c, [i]: !c[i] }));

  return (
    <div style={{ maxHeight: 360, overflowY: "auto" }}>
      {todayPlan.map((item, i) => (
        <div
          key={i}
          onClick={() => toggle(i)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 16px",
            cursor: "pointer",
            borderBottom:
              i < todayPlan.length - 1
                ? "1px solid var(--border)"
                : "none",
            background: checked[i]
              ? "rgba(106,170,100,0.06)"
              : "transparent",
            opacity: checked[i] ? 0.6 : 1,
            transition: "all 0.2s",
          }}
        >
          <span style={{ fontSize: 18 }}>
            {item.icon}
          </span>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 12,
                color: checked[i]
                  ? "var(--green)"
                  : "var(--text)",
                textDecoration: checked[i]
                  ? "line-through"
                  : "none",
              }}
            >
              {item.task}
            </div>

            <div
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
              }}
            >
              {item.time}
            </div>
          </div>

          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              border: `2px solid ${
                checked[i]
                  ? "var(--green)"
                  : "var(--border)"
              }`,
              background: checked[i]
                ? "var(--green)"
                : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            {checked[i] ? "✓" : ""}
          </div>
        </div>
      ))}
    </div>
  );
}