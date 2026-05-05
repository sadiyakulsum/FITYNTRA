import React, { useState } from "react";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed");
  const [liked, setLiked] = useState({});
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([
    { id: 1, user: "Arjun S.", avatar: "A", time: "2 min ago",
      text: "Just completed my 18th day streak! Surya Namaskar every morning has genuinely changed my energy levels. 🌅🔥",
      likes: 24, comments: 5, tag: "Streak" },
    { id: 2, user: "Priya M.", avatar: "P", time: "1 hr ago",
      text: "Made haldi doodh after leg day — REHA coach suggested it and the soreness is SO much better. Highly recommend! 🥛💛",
      likes: 18, comments: 3, tag: "Recovery" },
    { id: 3, user: "Rohit K.", avatar: "R", time: "3 hrs ago",
      text: "Hit my first 35k steps week! The FITYNTRA tracker kept me accountable. Slowly building to 50k. 🚶‍♂️📊",
      likes: 31, comments: 8, tag: "Progress" },
    { id: 4, user: "Sneha T.", avatar: "S", time: "5 hrs ago",
      text: "BMI dropped from 27.4 to 24.1 in 8 weeks using the diet recommender. Indian food + smart planning = real results! 🍛✨",
      likes: 52, comments: 14, tag: "Transformation" },
    { id: 5, user: "Vikram N.", avatar: "V", time: "Yesterday",
      text: "3 weeks of REHA's back exercises and the pain is almost gone. Cat-cow stretch every morning is now non-negotiable. 🙏",
      likes: 29, comments: 7, tag: "Rehab" },
  ]);

  // Challenges — persist to localStorage so joins survive page reloads
  const DEFAULT_CHALLENGES = [
    { id: 1, icon: "🔥", title: "30-Day Streak",  desc: "Log in and track every day for 30 days",  total: 30, joined: false, progress: 0, img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80" },
    { id: 2, icon: "🧘", title: "Yoga Month",      desc: "Complete 20 yoga or meditation sessions",  total: 20, joined: false, progress: 0, img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80" },
    { id: 3, icon: "🚶", title: "Step Master",     desc: "Hit 10,000 steps for 14 consecutive days", total: 14, joined: false, progress: 0, img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80" },
    { id: 4, icon: "🥗", title: "Clean Eating",    desc: "Log all meals for 21 days straight",       total: 21, joined: false, progress: 0, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" },
    { id: 5, icon: "💧", title: "Hydration Hero",  desc: "Log 2.5L water daily for 10 days",         total: 10, joined: false, progress: 0, img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80" },
    { id: 6, icon: "🏋️", title: "Workout Warrior", desc: "Complete 12 workouts in 1 month",          total: 12, joined: false, progress: 0, img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80" },
  ];

  const loadChallenges = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("fityntra_challenges") || "null");
      if (saved && Array.isArray(saved)) return saved;
    } catch(e) {}
    return DEFAULT_CHALLENGES;
  };

  const [challenges, setChallenges] = useState(loadChallenges);

  const saveChallenges = (next) => {
    setChallenges(next);
    try { localStorage.setItem("fityntra_challenges", JSON.stringify(next)); } catch(e) {}
  };

  const joinChallenge = (id) => {
    saveChallenges(challenges.map(c => c.id === id ? { ...c, joined: true, progress: 0 } : c));
  };
  const logProgress = (id) => {
    saveChallenges(challenges.map(c =>
      (c.id === id && c.joined && c.progress < c.total) ? { ...c, progress: c.progress + 1 } : c
    ));
  };

  const toggleLike = (id) => {
    setLiked(l => ({ ...l, [id]: !l[id] }));
    setPosts(ps => ps.map(p => p.id === id
      ? { ...p, likes: p.likes + (liked[id] ? -1 : 1) } : p));
  };

  const addPost = () => {
    if (!newPost.trim()) return;
    setPosts(ps => [{
      id: Date.now(), user: "You", avatar: "Y", time: "Just now",
      text: newPost, likes: 0, comments: 0, tag: "Update"
    }, ...ps]);
    setNewPost("");
  };

  const tagColors = {
    Streak: "#C9922A", Recovery: "#5A8EC0", Progress: "#6A9",
    Transformation: "#A07CC0", Rehab: "#C97840", Update: "#8B6820"
  };

  // Yoga & thali image gallery for sidebar
  const galleryImgs = [
    { src: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=300&q=80", alt: "Yoga pose" },
    { src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&q=80", alt: "Yoga meditation" },
    { src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80", alt: "Indian thali" },
    { src: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&q=80", alt: "Indian food" },
  ];

  return (
    <div className="fade-in" style={{ padding: 24, maxWidth: 1000 }}>
      <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: "var(--gold)", marginBottom: 4 }}>
        👥 Community
      </h2>
      <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 20 }}>
        Connect, share, and grow with fellow FITYNTRA members
      </p>

      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid var(--border)" }}>
        {["feed", "challenges"].map(t => (
          <button key={t} className={`tab ${activeTab === t ? "active" : ""}`}
            onClick={() => setActiveTab(t)}>
            {t === "feed" ? "🗣 Feed" : "🏆 Challenges"}
          </button>
        ))}
      </div>

      {activeTab === "feed" && (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
          <div>
            {/* New post box */}
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, var(--gold), #6A3800)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700
                }}>Y</div>
                <div style={{ flex: 1 }}>
                  <textarea className="inp"
                    placeholder="Share your fitness journey, tips, or victories... 🙏"
                    value={newPost} onChange={e => setNewPost(e.target.value)}
                    style={{ resize: "none", height: 70, paddingTop: 10 }} />
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                    <button className="btn-gold" style={{ fontSize: 12, padding: "7px 18px" }} onClick={addPost}>
                      Post 🚀
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {posts.map(p => (
              <div key={p.id} className="card" style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, var(--gold-dim), #3A2000)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: 14
                    }}>{p.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text)", fontSize: 13 }}>{p.user}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.time}</div>
                    </div>
                  </div>
                  <span style={{
                    padding: "3px 10px", borderRadius: 20, fontSize: 11,
                    background: `${tagColors[p.tag] || "#888"}22`,
                    color: tagColors[p.tag] || "#888",
                    border: `1px solid ${tagColors[p.tag] || "#888"}44`
                  }}>{p.tag}</span>
                </div>
                <p style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{p.text}</p>
                <div style={{ display: "flex", gap: 20 }}>
                  <button onClick={() => toggleLike(p.id)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: liked[p.id] ? "#E44" : "var(--text-dim)", fontSize: 13,
                    display: "flex", alignItems: "center", gap: 5
                  }}>{liked[p.id] ? "❤️" : "🤍"} {p.likes}</button>
                  <span style={{ color: "var(--text-dim)", fontSize: 13 }}>💬 {p.comments}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar — images + stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Yoga & Thali gallery */}
            <div className="card" style={{ padding: 12 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: "var(--gold)", marginBottom: 10 }}>
                🌿 Wellness Gallery
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {galleryImgs.map((img, i) => (
                  <img key={i} src={img.src} alt={img.alt}
                    style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 8,
                      border: "1px solid var(--border)", display: "block" }}
                    onError={e => { e.target.style.display = "none"; }} />
                ))}
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: "var(--gold)", marginBottom: 12 }}>
                🌟 Community Stats
              </h3>
              {[
                { label: "Active Members", val: "2,847" },
                { label: "Posts Today",    val: "143" },
                { label: "Challenges Live",val: "6" },
                { label: "KGs Lost Together", val: "3.2k" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between",
                  padding: "7px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
                  <span style={{ color: "var(--text-dim)" }}>{s.label}</span>
                  <span style={{ color: "var(--amber)", fontWeight: 600 }}>{s.val}</span>
                </div>
              ))}
            </div>

            <div className="card" style={{ textAlign: "center", background: "linear-gradient(135deg, #1A1200, #221800)", padding: 18 }}>
              <div className="skt" style={{ color: "var(--gold-light)", fontSize: 14, marginBottom: 6 }}>
                योगः कर्मसु कौशलम्
              </div>
              <div style={{ color: "var(--text-dim)", fontSize: 12 }}>Together we rise. 🙏</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "challenges" && (
        <div>
          <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 16 }}>
            Browse challenges and join the ones you want to take on. Your progress starts at 0 when you join.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {challenges.map((c) => (
              <div key={c.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                {/* Challenge image */}
                <div style={{ position: "relative", height: 110 }}>
                  <img src={c.img} alt={c.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={e => { e.target.style.background = "var(--bg-input)"; e.target.style.display = "none"; }} />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to bottom, rgba(13,10,6,0.2), rgba(13,10,6,0.85))",
                    display: "flex", alignItems: "flex-end", padding: "10px 12px"
                  }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 18 }}>{c.icon}</span>
                        <span style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: "var(--gold-light)" }}>{c.title}</span>
                      </div>
                    </div>
                  </div>
                  {c.joined && (
                    <div style={{
                      position: "absolute", top: 8, right: 8,
                      background: "var(--green)", color: "#fff", fontSize: 10,
                      padding: "2px 8px", borderRadius: 20, fontWeight: 600
                    }}>✓ Joined</div>
                  )}
                </div>

                <div style={{ padding: 14 }}>
                  <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10 }}>{c.desc}</p>

                  {c.joined ? (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                        <span style={{ color: "var(--text-dim)" }}>Your progress</span>
                        <span style={{ color: c.progress >= c.total ? "var(--green)" : "var(--amber)" }}>
                          {c.progress}/{c.total} {c.progress >= c.total ? "✅ Done!" : ""}
                        </span>
                      </div>
                      <div className="prog-bar" style={{ marginBottom: 10 }}>
                        <div className="prog-fill" style={{
                          width: `${Math.min(100, (c.progress / c.total) * 100)}%`,
                          background: c.progress >= c.total ? "var(--green)" : "var(--gold)"
                        }} />
                      </div>
                      <button onClick={() => logProgress(c.id)}
                        disabled={c.progress >= c.total}
                        className="btn-gold"
                        style={{ width: "100%", fontSize: 12, padding: 8,
                          opacity: c.progress >= c.total ? 0.5 : 1 }}>
                        {c.progress >= c.total ? "Challenge Complete! 🎉" : "+ Log Today's Progress"}
                      </button>
                    </>
                  ) : (
                    <button onClick={() => joinChallenge(c.id)} className="btn-ghost"
                      style={{ width: "100%", fontSize: 12, padding: 8 }}>
                      Join Challenge →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}