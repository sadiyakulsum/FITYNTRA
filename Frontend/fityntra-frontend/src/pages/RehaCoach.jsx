import React, { useState, useEffect, useRef } from "react";
import { rehaChat } from "../services/api";

function RehaCoach({token,userId}) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "🙏 Namaste! I'm REHA, your personal Rehab & Wellness Coach. I can help you with:\n\n• Pain management & injury rehab\n• Stretching & mobility exercises\n• Posture correction advice\n• Recovery routines\n• Chronic pain guidance\n\nWhat are you dealing with today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const quickOptions = [
    "Lower back pain 🔻", "Knee pain 🦵", "Shoulder stiffness 💪",
    "Neck pain 😣", "Post-workout soreness 🏋️", "Posture issues 🪑"
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Intensity-aware smart response engine ──
  const getRehaResponse = (text) => {
    const t = text.toLowerCase();

    // ── Intensity detection ──
    const severe  = /unbearable|can'?t move|can't walk|can't stand|excruciating|shooting|radiating|numbing|paralyz|emergency|severe|extreme|worst|can't sleep|sleepless|bed ?ridden|swollen badly|swelling a lot/i.test(text);
    const moderate= /quite a bit|really bad|bad pain|pretty bad|aching badly|throbbing|constant|persistent|chronic|weeks|months|not going away|doesn.?t stop|always hurts|every day/i.test(text);
    const mild    = /little|slight|mild|minor|sometimes|occasionally|bit of|a little|manageable|bearable|now and then/i.test(text);
    const morning = /morning|waking up|wake up|getting up|after sleep/i.test(text);
    const postWork= /after gym|after workout|after exercise|after training|post workout|post-workout/i.test(text);

    const intensityNote = severe
      ? "⚠️ Given the severity you've described, please see a physiotherapist or doctor before starting exercises. The guidance below is for mild relief only."
      : moderate
      ? "Since this has been persistent, be consistent with these exercises. Progress slowly — don't push through sharp pain."
      : mild
      ? "Since it sounds manageable, these exercises should give you noticeable relief within a few days."
      : "";

    // ── BACK ──
    if (t.includes("back") || t.includes("spine") || t.includes("lumbar") || t.includes("lower back")) {
      if (severe) {
        return `I'm really sorry to hear you're in that much pain. 😔

When back pain is this intense, especially if it's radiating down your legs, causing numbness, or making it hard to move, you should see a doctor or physiotherapist first — it could be a disc issue or nerve compression that needs proper diagnosis.

While you wait:
• Lie on your back with knees bent (supported by a pillow under knees)
• Apply ice for 15 min every 2 hours for the first 48 hrs
• Avoid bending forward or lifting anything
• Take short, slow walks if you can — complete bed rest actually slows recovery

🏥 Please don't delay seeing a professional for severe back pain. Your spine is important!`;
      }
      if (morning) {
        return `Morning stiffness in the lower back is very common — it usually means your spinal discs are dehydrated overnight. Here's what helps:

🌅 Morning routine (before getting out of bed):
• Knee-to-chest stretch — hold 20 sec each leg, 3 times
• Cat-Cow — 10 slow rounds right in bed or on the floor
• Pelvic clock circles — 10 each direction

Then when you're up:
• Child's Pose — 1 full minute
• Bird Dog — 2 sets × 10 reps

💧 Drink a large glass of warm water first thing — hydration helps disc recovery.

Ayurvedic tip: Warm sesame oil massage on the lower back before bed reduces morning stiffness significantly.

${intensityNote}`;
      }
      if (postWork) {
        return `Post-workout lower back pain usually means either your form needs work, your core isn't supporting your spine enough, or you've slightly strained a muscle. Let's sort it out:

**Immediate relief:**
• Stop any heavy lifting or squats today — rest is productive
• Ice the area for 15–20 min (not heat yet, since it's fresh)
• Child's Pose — hold 1 full minute

**Next 3–5 days — gentle rehab:**
• Cat-Cow stretch — 3 × 15 reps (morning + evening)
• Bird Dog — 3 × 12 reps each side (strengthens core to protect spine)
• Dead Bug — 3 × 10 reps (core stability without back strain)
• Glute Bridge — 3 × 15 reps

**Going forward:**
• Brace your core (take a deep breath and hold it) before every deadlift or squat
• Check that your lower back isn't rounding during lifts

${intensityNote}`;
      }
      return `I understand — lower back pain can really affect your whole day. Let me give you a solid plan:

**Daily rehab routine:**
• Cat-Cow Stretch — 3 sets × 15 reps (relieves spine tension, do this first)
• Child's Pose — hold 30–45 sec × 3 (decompresses the lumbar region)
• Bird Dog — 3 sets × 12 reps each side (core strength = less back strain)
• Pelvic Tilts — 3 sets × 20 reps (gentle and very effective)
• Glute Bridge — 3 sets × 15 reps (glutes support your lower back)

**Lifestyle fixes:**
• Don't sit for more than 30–40 min at a stretch — stand, walk briefly
• Sleep on your side with a pillow between your knees
• Avoid forward bending without bending your knees

**Ayurvedic remedy:** Warm sesame oil (til ka tel) massaged in circular motions before sleep — helps a lot for chronic back ache.

${intensityNote}`;
    }

    // ── KNEE ──
    if (t.includes("knee") || t.includes("kneecap") || t.includes("patella")) {
      if (severe) {
        return `That sounds really painful — I'm sorry you're going through this. 🙏

If your knee is severely swollen, locked, or you heard a pop when it happened, please go see a doctor. It could be a ligament tear (ACL/MCL) or meniscus issue that imaging needs to confirm.

**For now:**
• RICE — Rest, Ice (15 min every 2 hrs), Compression bandage, Elevate the leg
• Avoid any weight-bearing activity
• Do NOT try to "walk it off" — that can worsen tears

🏥 Severe knee pain with swelling = doctor visit first, exercises later.`;
      }
      if (moderate) {
        return `Persistent knee pain that isn't going away needs a consistent approach. The good news is most knee pain responds very well to the right exercises.

**Phase 1 — First week (very gentle):**
• Straight Leg Raises — 3 sets × 15 reps (strengthens quad without loading the knee)
• Short Arc Quads — 3 × 15 (great for patella pain)
• Seated Knee Extension (no weight) — 2 × 15
• Ice after every session — 15 min

**Phase 2 — Week 2 onwards (if pain is reducing):**
• Wall Sit — hold 20 sec, build to 45 sec × 3
• Step-ups on low step — 3 × 10 each leg
• Clamshells — 3 × 15 (hip strength reduces knee load)

**What's probably causing it:** Weak quads, tight IT band, or poor hip strength loading the knee unevenly.

Ayurvedic tip: Haldi doodh every night — turmeric is a genuine anti-inflammatory.

${intensityNote}`;
      }
      return `Knee pain is one of the most manageable issues with the right exercises. Here's your plan:

**Daily routine:**
• Straight Leg Raises — 3 × 15 (no knee stress, all quad activation)
• Wall Sit — hold 20–30 sec × 3 (builds stability gently)
• Clamshells — 3 × 15 (strengthens the hip, takes load off knee)
• Terminal Knee Extension — 3 × 15
• Calf Raises — 3 × 20 (improves joint support)

**Avoid:** Running, deep squats, stairs when pain flares
**Home remedy:** Ice pack 15–20 min after activity + haldi doodh at night

${intensityNote}`;
    }

    // ── SHOULDER ──
    if (t.includes("shoulder") || t.includes("rotator") || t.includes("deltoid")) {
      if (severe) {
        return `Severe shoulder pain, especially if it came suddenly, you heard a snap, or you can't raise your arm at all — that needs a medical assessment. Could be a rotator cuff tear or shoulder impingement needing imaging.

For now: rest the arm in a sling if it helps, apply ice, and avoid any overhead movement.

🏥 Please see a doctor before starting rehab exercises for this level of pain.`;
      }
      return `Shoulder stiffness and pain respond really well to targeted mobility work. Here's your routine:

**Start with (daily, gentle):**
• Pendulum Swings — 2 min each arm (lets gravity decompress the joint naturally)
• Cross-body stretch — hold 30 sec × 3
• Shoulder Rolls — 2 × 20 each direction

**Strengthening (3–4 days/week):**
• Wall Angels — 3 × 10 (retrains proper shoulder mechanics)
• External Rotation with light band — 3 × 15 (critical for rotator cuff health)
• Doorway Stretch — hold 30 sec × 3
• Face Pulls (or band pull-aparts) — 3 × 15

**Yoga:** Gomukhasana (Cow Face Pose) arms — exceptional for shoulder flexibility.

**Tip:** Heat pack for 10 min before exercises to loosen things up. Ice for 15 min after.

${intensityNote}`;
    }

    // ── NECK ──
    if (t.includes("neck") || t.includes("cervical") || t.includes("nape") || t.includes("stiff neck")) {
      if (severe || t.includes("numb") || t.includes("radiating") || t.includes("arm pain")) {
        return `When neck pain radiates into your arms, causes numbness or tingling in fingers, or is accompanied by headaches or dizziness — that's your nervous system giving a warning. Please see a doctor or neurologist before doing exercises.

For immediate relief:
• Lie flat on a firm surface (no thick pillow)
• Apply a warm compress to the neck
• Avoid looking down at your phone

🏥 Radiating neck pain needs professional evaluation.`;
      }
      if (morning) {
        return `Waking up with a stiff neck is usually a pillow problem or sleeping in an awkward position. Here's how to fix it:

**Morning relief sequence (5 min):**
• Slowly tilt head to each shoulder — hold 20 sec × 3 each side
• Gentle chin tucks — 10 reps (don't force it)
• Slow neck rotations — 10 each direction (move only within comfort)
• Shoulder shrugs — 10 reps to release trapezius tension

**Tonight:**
• Switch to a medium-firm pillow that keeps your neck neutral
• Avoid sleeping on your stomach (this rotates your neck for hours)

Warm mustard oil (sarso ka tel) massage up the neck before bed is excellent — it genuinely reduces stiffness by morning.

${intensityNote}`;
      }
      return `Neck pain is often tied to posture and tension. Here's a comprehensive plan:

**Daily rehab (do gently — no jerking):**
• Chin Tucks — 3 × 12 reps (realigns cervical spine, very effective)
• Neck Side Stretch — hold 20 sec each side × 3
• Upper Trapezius Stretch — hold 30 sec × 3
• Shoulder Shrugs and Rolls — 2 × 20 (releases the trapezius)
• Slow Neck Rotations — 10 each direction

**Pranayama:** 5 min of Anulom Vilom (alternate nostril breathing) genuinely relaxes neck muscles — try it.

**Daily habit:** Keep your screen at eye level. Every 30 min, look away and do 5 chin tucks.

${intensityNote}`;
    }

    // ── POST-WORKOUT SORENESS ──
    if (t.includes("sore") || t.includes("soreness") || t.includes("doms") || /post.?workout/.test(t) || t.includes("muscle pain") || t.includes("body ache")) {
      if (severe || t.includes("can't move") || t.includes("can't walk")) {
        return `Ouch — sounds like a really intense session! That level of soreness is worth paying attention to.

If specific muscles are extremely painful (not just sore), swollen, or the urine appears dark brown — that could be rhabdomyolysis (muscle breakdown), which needs a doctor.

For extreme DOMS:
• Full rest today — no gym
• Eat a high-protein meal immediately
• Stay hydrated — 3–4L water today specifically
• Light walk only (10–15 min) to increase blood flow
• Warm bath with epsom salt (sendha namak) — very effective
• Haldi doodh before bed

Don't train the affected muscles for at least 48–72 hours.`;
      }
      return `DOMS (Delayed Onset Muscle Soreness) means your muscles are adapting and growing — it's a good sign! Here's how to recover faster:

**Today — active recovery:**
• Light walk 20–30 min (increases blood flow without adding stress)
• Foam roll the sore muscles — 60 sec per muscle group
• Full body gentle stretch — hold each 30 sec
• Slow Surya Namaskar — 5 rounds (wonderful active recovery)

**Nutrition — critical:**
• High protein meal: paneer, dal, eggs, curd within 1–2 hrs
• Haldi doodh (turmeric milk) tonight — genuine anti-inflammatory
• 2.5–3L water today

**Physical relief:**
• Warm shower (not ice cold — that's a myth for DOMS)
• Epsom salt (sendha namak) bath if possible

✅ You'll feel better in 24–48 hrs. Soreness = growth!`;
    }

    // ── POSTURE ──
    if (t.includes("posture") || t.includes("hunch") || t.includes("slouch") || (t.includes("sitting") && t.includes("pain"))) {
      return `Posture issues are really common — especially with long hours at a desk or phone. The good news: it's fully fixable with consistency.

**Root cause check — which one sounds like you?**
• Forward head (chin poking out) — from screen time
• Rounded shoulders — from chest-dominant training or desk work
• Hunched upper back (kyphosis) — from prolonged sitting

**Corrective exercises (do daily):**
• Wall Angels — 3 × 10 (most effective exercise for posture)
• Thoracic Extension over a chair backrest — 10 reps
• Face Pulls or Band Pull-Aparts — 3 × 15
• Chin Tucks — 3 × 12 (corrects forward head)
• Dead Bug — 3 × 10 (core stability)

**Yoga:** Tadasana (Mountain Pose) — 2 min daily teaches your body what upright actually feels like. Bhujangasana (Cobra) — 3 × 30 sec opens the chest.

**Daily habit:** Set a phone alarm every 30 min — when it goes off, sit tall, roll shoulders back, do 5 chin tucks.

${intensityNote}`;
    }

    // ── ANKLE ──
    if (t.includes("ankle") || t.includes("sprain") || t.includes("twisted")) {
      if (severe || t.includes("can't walk") || t.includes("can't stand")) {
        return `If you twisted your ankle badly and can't put weight on it, please get an X-ray to rule out a fracture — that's the priority.

**For now:**
• RICE immediately — Rest, Ice (15 min every 2 hrs), Compression bandage, Elevate above heart level
• Do NOT walk on it if it's very painful
• Avoid heat, alcohol, massage in the first 48 hrs (makes swelling worse)

🏥 Weight-bearing pain after an ankle sprain = rule out fracture first.`;
      }
      return `Ankle sprains are frustrating but recover well with the right approach.

**First 48 hours — RICE:**
• Rest · Ice 15–20 min every 2 hrs · Compression bandage · Elevate above heart

**Day 3 onwards — gentle rehab:**
• Ankle Circles — 20 each direction (seated, no weight)
• Alphabet Tracing with your toe — 2 sets (improves range of motion)
• Towel Scrunches with toes — 3 × 20

**Week 2 — strengthening:**
• Calf Raises (hold chair for balance) — 3 × 15
• Single leg balance — start 15 sec, build to 45 sec × 3
• Mini squats on both legs — 3 × 10

${intensityNote}`;
    }

    // ── WRIST ──
    if (t.includes("wrist") || t.includes("carpal") || t.includes("hand pain")) {
      return `Wrist pain is very common — especially for people who type a lot or lift weights.

**Immediate relief:**
• Wrist Flexion/Extension stretch — hold 20 sec each way × 3
• Prayer Stretch — hold 30 sec × 3 (sit hands flat on desk, push gently)
• Wrist Circles — 20 each direction
• Warm water soak with sendha namak (rock salt) — 15 min, really helps

**Strengthening (if it's recurrent):**
• Finger Tendon Glides — 10 reps
• Grip Strengthening with a soft ball — 3 × 15
• Wrist Curls with light weight — 3 × 15 each direction

**Desk habits:** Wrists should be neutral (not bent up or down) when typing. Take a 2-min break every 30 min.

⚠️ If you have tingling or numbness in fingers (especially at night), that could be Carpal Tunnel — see a doctor.

${intensityNote}`;
    }

    // ── STRESS / SLEEP / MENTAL ──
    if (t.includes("stress") || t.includes("anxiety") || t.includes("mental") || t.includes("can't sleep") || t.includes("insomnia") || t.includes("tired") || t.includes("fatigue") || t.includes("burnout")) {
      if (t.includes("can't sleep") || t.includes("insomnia")) {
        return `Not being able to sleep is exhausting in itself — I hear you. Here's what actually works:

**Pre-sleep wind-down routine:**
• 4-7-8 Breathing: Inhale 4 sec → Hold 7 sec → Exhale 8 sec — do 4 cycles (activates the parasympathetic nervous system)
• Bhramari Pranayama (Humming Bee breath) — 5 min (lowers heart rate)
• Viparita Karani (Legs up the wall) — 5–10 min (calms nervous system)
• Shavasana with body scan — 10 min

**Ayurveda for sleep:**
• Ashwagandha + warm milk (no sugar) 30 min before bed — genuinely effective
• Avoid screen light 1 hour before sleep
• Small piece of jaggery (gur) with warm milk if you're restless

✅ Consistency is key — do this every night for 1 week and your body will learn the cue.`;
      }
      return `Mental fatigue and stress are physical conditions — they affect your muscles, immunity, and recovery. You deserve care too. 🌸

**Daily pranayama (10 min total):**
• Anulom Vilom — 5 min (balances nervous system, reduces cortisol)
• Bhramari — 3 min (very calming, great for anxiety)
• Kapalbhati — 2 min (energizing if you feel dull)

**Yoga for stress:**
• Child's Pose — 2 min (the most comforting pose)
• Legs Up the Wall — 5 min
• Shavasana — 10 min with eyes closed

**Ayurveda:** Ashwagandha with warm milk reduces cortisol. Brahmi is excellent for mental clarity.

**One small habit:** Go outside for 10–15 min of natural sunlight daily — genuinely resets your mood and sleep hormones.

✅ You're doing better than you think. Be kind to yourself. 🙏`;
    }

    // ── GREETING ──
    if (/^(hi|hello|hey|namaste|namaskar|hii+|heyy+)/.test(t)) {
      return `🙏 Namaste! Lovely to have you here.

I'm REHA, your personal rehab and wellness coach. I'm here to help you with pain, recovery, posture, soreness — anything related to your body's wellbeing.

Just tell me what's bothering you in your own words — you don't need to use technical terms. Something like "my lower back has been hurting for a week" or "my neck feels really stiff after sleeping" works perfectly.

What can I help you with today? 💪`;
    }

    // ── THANKS ──
    if (t.includes("thank") || t.includes("thanks") || t.includes("shukriya") || t.includes("dhanyawad") || t.includes("helpful")) {
      return `You're most welcome! 🌸

Remember — healing is a process, not an event. Consistency with small daily efforts will always beat intense occasional effort.

Drink your water, do your stretches, eat well, and sleep enough. Your body is working hard for you every day — take care of it.

Come back anytime something new comes up. Jai Ho! 🙏`;
    }

    // ── DIET/NUTRITION ──
    if (t.includes("diet") || t.includes("nutrition") || t.includes("food") || t.includes("eat") || t.includes("recovery food")) {
      return `Food is medicine — especially in Ayurveda. Here's what supports recovery:

**Anti-inflammatory Indian foods:**
• Haldi (Turmeric) — add to dal, sabzi, or doodh
• Adrak (Ginger) — in chai or warm water every morning
• Amla — extremely high in Vitamin C, great for joint health
• Til (Sesame) — calcium-rich, excellent for bones
• Methi seeds — reduces inflammation in joints
• Ajwain (Carom seeds) — relieves muscle cramps

**Daily recovery nutrition targets:**
• Protein: Dal, paneer, curd, eggs, sprouts — at every meal
• Healthy fats: Ghee (yes, ghee!), nuts, seeds
• Carbs: Bajra, jowar, brown rice — slow-releasing energy
• Hydration: 2.5–3L water + coconut water if active

✅ Check the Diet Recommender tab for a full personalized meal plan!`;
    }

    // ── DEFAULT — context-aware, asks the right follow-up ──
    if (t.includes("pain") || t.includes("hurt") || t.includes("ache") || t.includes("injury")) {
      return `I can hear that you're dealing with some pain — I'm here to help properly. 🙏

To give you the most useful guidance, could you tell me:

1️⃣ **Where exactly** is the pain? (lower back, knee, shoulder, neck, ankle...)
2️⃣ **How intense** is it? (mild and manageable / moderate and persistent / severe and limiting)
3️⃣ **When does it happen?** (after exercise / morning / all day / only with movement)
4️⃣ **How long** has it been going on? (today / a few days / weeks / months)

The more you tell me, the more specific and useful my advice can be. Take your time. 🌸`;
    }

    return `🙏 I want to make sure I give you the right guidance.

Could you describe what you're feeling in a bit more detail? For example:

• "My lower back has been aching for 3 days after the gym"
• "I have sharp knee pain when climbing stairs"
• "My neck is very stiff every morning"
• "I feel completely burnt out and can't sleep"

The more context you share, the better I can help. I'm listening. 💛`;
  };



  const sendMessage = async (text) => {
  const userText = text || input.trim();
  if (!userText || loading) return;
  setMessages((prev) => [...prev, { role: "user", text: userText }]);
  setInput("");
  setLoading(true);
  try {
    if (token && userId) {
      const data = await rehaChat({ user_id: userId ||"guest", message: userText }, token);
      const reply = data.reply || data.response || data.message || "I'm here to help!";
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } else {
      const reply = getRehaResponse(userText);
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    }
  } catch (e) {
    const reply = getRehaResponse(userText);
    setMessages((prev) => [...prev, { role: "bot", text: reply }]);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fade-in" style={{ padding: 24, maxWidth: 900 }}>
      <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: "var(--gold)", marginBottom: 4 }}>
        🩺 REHA — Rehab Coach
      </h2>
      <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 20 }}>
        AI-powered rehabilitation & wellness guidance
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* Chat */}
        <div className="card" style={{ display: "flex", flexDirection: "column", height: 520 }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "4px 0", display: "flex", flexDirection: "column" }}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role === "user" ? "chat-user" : "chat-bot"}`}
                style={{ whiteSpace: "pre-wrap", alignSelf: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.role === "bot" && <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: "var(--gold)", marginBottom: 4 }}>🩺 REHA</div>}
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="chat-msg chat-bot" style={{ alignSelf: "flex-start" }}>
                <span style={{ animation: "pulse 1.2s infinite" }}>REHA is thinking</span>
                <span style={{ fontSize: 18, marginLeft: 4 }}>🌸</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick options */}
          {messages.length <= 2 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 0" }}>
              {quickOptions.map(q => (
                <button key={q} className="btn-ghost" style={{ fontSize: 11, padding: "5px 10px" }}
                  onClick={() => sendMessage(q)}>{q}</button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <input className="inp" placeholder="Describe your issue or ask for exercises..."
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !loading && sendMessage()} />
            <button className="btn-gold" onClick={() => !loading && sendMessage()}
              disabled={loading} style={{ padding: "10px 16px", flexShrink: 0 }}>
              {loading ? "⏳" : "Send"}
            </button>
          </div>
        </div>

        {/* Tips panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card">
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: "var(--gold)", marginBottom: 12 }}>
              💡 General Tips
            </h3>
            {[
              { icon: "🪑", tip: "Maintain good posture at all times" },
              { icon: "🏋️", tip: "Avoid heavy lifting when injured" },
              { icon: "🔄", tip: "Stay consistent with exercises" },
              { icon: "👂", tip: "Listen to your body always" },
              { icon: "🌊", tip: "Ice for acute, heat for chronic pain" },
              { icon: "🧘", tip: "Daily pranayama aids recovery" },
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 13, color: "var(--text-dim)" }}>
                <span>{t.icon}</span>
                <span>{t.tip}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ background: "linear-gradient(135deg, #1A1200, #221800)", overflow: "hidden", padding: 0 }}>
            <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80"
              alt="Yoga healing"
              style={{ width: "100%", height: 90, objectFit: "cover", opacity: 0.4, display: "block" }}
              onError={e => { e.target.style.display = "none"; }} />
            <div style={{ padding: "14px 16px", textAlign: "center" }}>
              <div className="skt" style={{ color: "var(--gold-light)", fontSize: 13, marginBottom: 5 }}>
                Healing is progress.
              </div>
              <div style={{ color: "var(--text-dim)", fontSize: 12 }}>
                You're stronger than you think. 🌸
              </div>
            </div>
          </div>

          <div className="card card-sm" style={{ borderColor: "rgba(255,80,80,0.2)", background: "rgba(255,60,60,0.04)" }}>
            <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
              ⚠️ <strong style={{ color: "var(--text)" }}>Disclaimer:</strong> REHA provides general wellness guidance. Consult a certified physiotherapist for serious injuries.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RehaCoach;