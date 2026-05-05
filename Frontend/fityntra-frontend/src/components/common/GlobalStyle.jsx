import React, { useState, useEffect, useRef } from "react";

export default function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Tiro+Devanagari+Sanskrit&family=Lato:wght@300;400;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --gold:       #C9922A;
      --gold-light: #E8B84B;
      --gold-dim:   #8B6820;
      --amber:      #F4A832;
      --bg-deep:    #0D0A06;
      --bg-panel:   #1A1208;
      --bg-card:    #221A0C;
      --bg-input:   #2A1F0F;
      --border:     rgba(201,146,42,0.3);
      --border-bright: rgba(201,146,42,0.6);
      --text:       #F0DFA8;
      --text-dim:   #9A8060;
      --text-muted: #5A4830;
      --red:        #D44;
      --green:      #6A9;
      --blue:       #5A8EC0;
    }

    html, body, #root { height: 100%; }

    body {
      background: var(--bg-deep);
      color: var(--text);
      font-family: 'Lato', sans-serif;
      font-size: 14px;
      line-height: 1.5;
      overflow-x: hidden;
    }

    /* Mandala background pattern */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse 80% 60% at 20% 80%, rgba(201,146,42,0.06) 0%, transparent 60%),
        radial-gradient(ellipse 60% 80% at 80% 20%, rgba(201,146,42,0.04) 0%, transparent 60%),
        radial-gradient(ellipse 40% 40% at 50% 50%, rgba(201,146,42,0.03) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    #root { position: relative; z-index: 1; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--bg-deep); }
    ::-webkit-scrollbar-thumb { background: var(--gold-dim); border-radius: 3px; }

    /* Animations */
    @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
    @keyframes glow   { 0%,100%{box-shadow:0 0 8px rgba(201,146,42,0.3);} 50%{box-shadow:0 0 22px rgba(201,146,42,0.6);} }
    @keyframes spin   { to { transform: rotate(360deg); } }
    @keyframes pulse  { 0%,100%{opacity:1;} 50%{opacity:0.5;} }

    .fade-in { animation: fadeIn 0.4s ease both; }

    /* Buttons */
    .btn-gold {
      background: linear-gradient(135deg, var(--gold) 0%, #A87820 100%);
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 10px 22px;
      font-family: 'Cinzel', serif;
      font-size: 13px;
      letter-spacing: 0.06em;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-gold:hover { filter: brightness(1.15); transform: translateY(-1px); }
    .btn-ghost {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-dim);
      border-radius: 6px;
      padding: 9px 18px;
      font-family: 'Lato', sans-serif;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }

    /* Cards */
    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
    }
    .card-sm { padding: 14px 16px; }

    /* Inputs */
    .inp {
      width: 100%;
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      padding: 10px 14px;
      font-family: 'Lato', sans-serif;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    .inp:focus { border-color: var(--gold); }
    .inp::placeholder { color: var(--text-muted); }

    select.inp option { background: var(--bg-card); }

    label.lbl {
      display: block;
      font-size: 11px;
      letter-spacing: 0.08em;
      color: var(--text-dim);
      text-transform: uppercase;
      margin-bottom: 5px;
    }

    /* Tabs */
    .tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
    .tab {
      padding: 8px 16px;
      border: none;
      background: none;
      color: var(--text-dim);
      font-family: 'Lato', sans-serif;
      font-size: 13px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
      transition: all 0.2s;
    }
    .tab.active { color: var(--gold); border-color: var(--gold); }

    /* Nav sidebar */
    .nav-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; border-radius: 8px;
      color: var(--text-dim); cursor: pointer;
      font-size: 13px; transition: all 0.2s;
    }
    .nav-item:hover { background: rgba(201,146,42,0.08); color: var(--text); }
    .nav-item.active { background: rgba(201,146,42,0.15); color: var(--gold); border-left: 2px solid var(--gold); }

    /* Progress bars */
    .prog-bar { height: 6px; background: var(--bg-input); border-radius: 3px; overflow: hidden; margin-top: 5px; }
    .prog-fill { height: 100%; border-radius: 3px; transition: width 0.8s ease; }

    /* Divider */
    .divider { border: none; border-top: 1px solid var(--border); margin: 14px 0; }

    /* Sanskrit quote */
    .skt { font-family: 'Tiro Devanagari Sanskrit', serif; }

    /* Circular progress */
    .ring-svg { transform: rotate(-90deg); }
    .ring-bg { fill: none; stroke: var(--bg-input); }
    .ring-fg { fill: none; stroke-linecap: round; transition: stroke-dashoffset 1s ease; }

    /* Chat bubble */
    .chat-msg { max-width: 80%; padding: 10px 14px; border-radius: 12px; margin: 6px 0; font-size: 13px; line-height: 1.5; }
    .chat-user { background: rgba(201,146,42,0.2); border: 1px solid var(--border); margin-left: auto; }
    .chat-bot  { background: var(--bg-card); border: 1px solid var(--border); }

    /* Streak flame */
    @keyframes flicker { 0%,100%{transform:scaleY(1) scaleX(1);} 25%{transform:scaleY(1.05) scaleX(0.97);} 75%{transform:scaleY(0.97) scaleX(1.02);} }
    .flame { display:inline-block; animation: flicker 1.5s ease-in-out infinite; }

    /* Nutrition macros */
    .macro-dot { width:10px; height:10px; border-radius:50%; display:inline-block; margin-right:5px; }

    /* Responsive layout */
    .app-layout { display: flex; min-height: 100vh; }
    .sidebar { width: 210px; min-height: 100vh; background: var(--bg-panel); border-right: 1px solid var(--border); flex-shrink: 0; }
    .main-content { flex: 1; overflow-y: auto; min-height: 100vh; }

    @media (max-width: 768px) {
      .sidebar { display: none; }
      .app-layout { flex-direction: column; }
    }
    `}</style>
  );
}