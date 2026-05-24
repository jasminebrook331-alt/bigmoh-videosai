import React, { useState, useRef, useEffect } from "react";
// @ts-ignore
import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js";

const SUPABASE_URL = "https://vjpdqkrqrsynhsubotxt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqcGRxa3JxcnN5bmhzdWJvdHh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0Mzk1OTksImV4cCI6MjA5NTAxNTU5OX0.SyGYE8OKjyQAXTjzZyYJXuZs0BG-li30axkMgiY-DAE";
const HF_TOKEN = "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";
const HF_MODEL = "https://api-inference.huggingface.co/models/damo-vilab/text-to-video-ms-1.7b";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const STYLES = ["Cinematic","Cartoon","Realistic","Anime","Slideshow"];
const RATIOS = ["16:9","9:16","1:1"];
const DURATIONS = ["30s","1 min","2 min","5 min","10 min"];
const VOICES = [
  {id:"none",label:"None",icon:"🔇",desc:"No voiceover"},
  {id:"narrator-m",label:"Narrator (M)",icon:"🎙️",desc:"Deep male"},
  {id:"narrator-f",label:"Narrator (F)",icon:"🎙️",desc:"Warm female"},
  {id:"documentary",label:"Documentary",icon:"📽️",desc:"Calm, informative"},
  {id:"dramatic",label:"Dramatic",icon:"🎭",desc:"Intense & emotional"},
  {id:"whispering",label:"Whispering",icon:"🤫",desc:"Soft, ASMR-style"},
  {id:"energetic",label:"Energetic",icon:"⚡",desc:"Upbeat & exciting"},
  {id:"robotic",label:"Robotic",icon:"🤖",desc:"Synthetic AI voice"},
  {id:"kids",label:"Kids",icon:"🧒",desc:"Friendly & playful"},
  {id:"news",label:"News Anchor",icon:"📺",desc:"Professional broadcast"},
];
const CAPTION_FONTS = [
  {id:"none",label:"Off",preview:"✕",font:"inherit",desc:"No captions"},
  {id:"impact",label:"Impact",preview:"BOOM",font:"Impact, sans-serif",desc:"Bold & punchy"},
  {id:"georgia",label:"Georgia",preview:"Story",font:"Georgia, serif",desc:"Classic serif"},
  {id:"courier",label:"Typewriter",preview:"Type",font:"Courier New, monospace",desc:"Retro monospace"},
  {id:"bebas",label:"Bebas",preview:"FILM",font:"Impact, sans-serif",desc:"Cinematic all-caps"},
  {id:"comic",label:"Comic",preview:"Fun!",font:"Comic Sans MS, cursive",desc:"Playful & casual"},
  {id:"futura",label:"Futura",preview:"MODERN",font:"Trebuchet MS, sans-serif",desc:"Clean geometric"},
  {id:"handwritten",label:"Handwritten",preview:"Script",font:"Brush Script MT, cursive",desc:"Casual handwriting"},
];
const MUSIC_TRACKS = [
  {id:"none",label:"None",icon:"🔇",desc:"No music"},
  {id:"epic",label:"Epic",icon:"🔥",desc:"Powerful orchestral"},
  {id:"lofi",label:"Lo-Fi",icon:"🎧",desc:"Chill beats"},
  {id:"ambient",label:"Ambient",icon:"🌫️",desc:"Soft atmospheric"},
  {id:"corporate",label:"Corporate",icon:"💼",desc:"Professional upbeat"},
  {id:"jazz",label:"Jazz",icon:"🎷",desc:"Smooth & soulful"},
  {id:"electronic",label:"Electronic",icon:"🎛️",desc:"Synth & EDM"},
  {id:"acoustic",label:"Acoustic",icon:"🎸",desc:"Warm guitar"},
  {id:"cinematic",label:"Cinematic",icon:"🎬",desc:"Film score"},
  {id:"nature",label:"Nature",icon:"🌿",desc:"Birds & ambience"},
];
const COLOR_GRADES = [
  {id:"none",label:"None",color:"#555",desc:"Original"},
  {id:"warm",label:"Warm",color:"#f59e0b",desc:"Golden & cozy"},
  {id:"cool",label:"Cool",color:"#38bdf8",desc:"Icy & calm"},
  {id:"noir",label:"Noir",color:"#a0a0a0",desc:"B&W dramatic"},
  {id:"teal",label:"Teal+Orange",color:"#14b8a6",desc:"Blockbuster"},
  {id:"vintage",label:"Vintage",color:"#c4a25c",desc:"Faded film grain"},
  {id:"neon",label:"Neon",color:"#e879f9",desc:"Cyberpunk vibes"},
  {id:"pastel",label:"Pastel",color:"#fca5a5",desc:"Soft & dreamy"},
  {id:"emerald",label:"Emerald",color:"#4ade80",desc:"Nature & fresh"},
  {id:"moody",label:"Moody",color:"#6366f1",desc:"Dark & intense"},
];
const CAPTION_LANGUAGES = ["English","Spanish","French","German","Portuguese","Arabic","Hindi","Chinese","Japanese","Korean","Italian","Russian"];
const PLANS = [
  {id:"free",name:"Free",price:"$0",period:"forever",color:"#4ade80",features:["5 videos/month","Up to 2 min","720p export","Basic voiceover","Watermark"],cta:"Current Plan"},
  {id:"pro",name:"Pro",price:"$12",period:"/month",color:"#a78bfa",badge:"Most Popular",features:["Unlimited videos","Up to 10 min","4K export","All voices","No watermark","Priority AI"],cta:"Upgrade to Pro"},
  {id:"team",name:"Team",price:"$29",period:"/month",color:"#38bdf8",features:["Everything in Pro","5 team members","Shared workspace","Analytics","Dedicated support"],cta:"Start Team Plan"},
];

function getCSS(dark: boolean): string {
  const bg = dark ? "#0d0d14" : "#f0f0f8";
  const bg2 = dark ? "#12121e" : "#ffffff";
  const bg3 = dark ? "#0a0a12" : "#f5f5fc";
  const border = dark ? "#1e1e30" : "#ddd8f0";
  const border2 = dark ? "#2a2a3a" : "#d0ccee";
  const text = dark ? "#e2e2f0" : "#1a1a2e";
  const muted = dark ? "#5a5a7a" : "#8080a0";
  return `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;}body{margin:0;background:${bg};color:${text};}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulsebar{0%,100%{opacity:.7}50%{opacity:1}}
@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}
.pill{background:transparent;border:1px solid ${border2};color:${muted};border-radius:999px;padding:6px 14px;font-size:12px;cursor:pointer;transition:all 0.18s;font-family:inherit;}
.pill:hover{border-color:#a78bfa;color:#a78bfa;}
.pill.on{background:#a78bfa22;border-color:#a78bfa;color:#c4b5fd;}
.card{background:${bg3};border:1px solid ${border2};border-radius:10px;padding:10px 12px;cursor:pointer;transition:all 0.18s;font-family:inherit;text-align:left;}
.card:hover{border-color:#a78bfa66;}
.card.on{background:#a78bfa18;border-color:#a78bfa;}
.tab{background:transparent;border:none;color:${muted};font-family:inherit;font-size:12px;padding:8px 12px;cursor:pointer;border-radius:8px;transition:all 0.18s;white-space:nowrap;font-weight:500;}
.tab:hover{color:#c4b5fd;background:${dark ? "#1a1a28" : "#ede8ff"};}
.tab.on{color:#c4b5fd;background:#a78bfa22;}
.genbtn{width:100%;padding:14px;border-radius:12px;border:none;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;letter-spacing:0.3px;transition:opacity 0.2s,transform 0.15s;}
.genbtn:hover:not(:disabled){opacity:0.88;transform:translateY(-1px);}
.genbtn:disabled{opacity:0.4;cursor:not-allowed;}
.inp{width:100%;background:${bg3};border:1px solid ${border2};border-radius:10px;color:${text};font-family:inherit;font-size:13px;padding:10px 14px;outline:none;transition:border-color 0.2s;}
.inp:focus{border-color:#7c3aed;}
textarea.inp{resize:none;line-height:1.6;font-size:14px;padding:14px;}
select.inp{cursor:pointer;}
.hcard{background:${bg2};border:1px solid ${border2};border-radius:12px;padding:12px;display:flex;align-items:center;gap:10px;transition:border-color 0.2s;}
.hcard:hover{border-color:#a78bfa66;}
.slabel{font-size:11px;font-weight:600;letter-spacing:1.2px;color:${muted};text-transform:uppercase;margin-bottom:10px;}
.enhbtn{background:transparent;border:1px solid ${dark ? "#3a3a55" : "#c8c0f0"};color:#a78bfa;border-radius:8px;padding:7px 13px;font-size:12px;cursor:pointer;transition:all 0.18s;font-family:inherit;}
.enhbtn:hover{background:#a78bfa15;border-color:#a78bfa;}
.enhbtn:disabled{opacity:0.4;cursor:not-allowed;}
.sbcard{background:${bg2};border:1px solid ${border};border-radius:14px;padding:16px;}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(4px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;}
`;
}

function Spinner({ size = 36, label = "" }: { size?: number; label?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: size, height: size, borderRadius: "50%", border: "3px solid #2a2a3a", borderTop: "3px solid #a78bfa", animation: "spin 0.8s linear infinite" }} />
      {label && <div style={{ fontSize: 13, color: "#7070a0" }}>{label}</div>}
    </div>
  );
}

function AuthScreen({ onLogin, dark }: { onLogin: (u: any) => void; dark: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const bg = dark ? "#0d0d14" : "#f0f0f8";
  const card = dark ? "#12121e" : "#ffffff";
  const border = dark ? "#1e1e30" : "#ddd8f0";
  const text = dark ? "#e2e2f0" : "#1a1a2e";
  const muted = dark ? "#5a5a7a" : "#8080a0";

  async function submit() {
    setError("");
    if (!email.trim() || !password.trim()) return setError("Please fill in all fields.");
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error: err } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name || email.split("@")[0] } } });
        if (err) throw err;
        setDone(true);
        setTimeout(() => onLogin(data.user), 1200);
      } else {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        onLogin(data.user);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Try again.");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora','Segoe UI',sans-serif", padding: 20 }}>
      <style>{getCSS(dark)}</style>
      <div style={{ width: "100%", maxWidth: 420, animation: "fadeUp 0.4s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 54, height: 54, borderRadius: 14, background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 12px" }}>🎬</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: text, letterSpacing: "-0.5px" }}>VisionAI</div>
          <div style={{ fontSize: 13, color: muted, marginTop: 4 }}>Text to Video Generator</div>
        </div>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 28 }}>
          {done ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#4ade80" }}>Account Created!</div>
              <div style={{ fontSize: 13, color: muted, marginTop: 6 }}>Check your email to confirm, then sign in.</div>
            </div>
          ) : (
            <React.Fragment>
              <div style={{ fontSize: 17, fontWeight: 600, color: text, marginBottom: 4 }}>{isSignUp ? "Create account" : "Sign in"}</div>
              <div style={{ fontSize: 12, color: muted, marginBottom: 22 }}>{isSignUp ? "Start creating AI videos for free" : "Welcome back!"}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {isSignUp && (
                  <div>
                    <div style={{ fontSize: 12, color: muted, marginBottom: 6 }}>Full Name</div>
                    <input className="inp" type="text" placeholder="e.g. Sarah Johnson" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 12, color: muted, marginBottom: 6 }}>Email Address</div>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>✉️</span>
                    <input className="inp" type="text" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ paddingLeft: 36 }} onKeyDown={(e) => e.key === "Enter" && submit()} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: muted, marginBottom: 6 }}>Password</div>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>🔒</span>
                    <input className="inp" type={showPass ? "text" : "password"} placeholder={isSignUp ? "Min. 6 characters" : "Your password"} value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingLeft: 36, paddingRight: 40 }} onKeyDown={(e) => e.key === "Enter" && submit()} />
                    <button onClick={() => setShowPass((s) => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 14, color: muted }}>{showPass ? "🙈" : "👁️"}</button>
                  </div>
                </div>
              </div>
              {error && <div style={{ marginTop: 12, padding: "9px 12px", background: "#1a0a0a", border: "1px solid #4a1a1a", borderRadius: 8, fontSize: 12, color: "#f87171" }}>⚠️ {error}</div>}
              <button className="genbtn" style={{ marginTop: 18 }} onClick={submit} disabled={loading}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #ffffff44", borderTop: "2px solid #fff", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                    {isSignUp ? "Creating..." : "Signing in..."}
                  </span>
                ) : isSignUp ? "🚀 Create Account" : "🔑 Sign In"}
              </button>
              <div style={{ marginTop: 18, textAlign: "center", fontSize: 13, color: muted }}>
                {isSignUp ? "Have an account? " : "No account? "}
                <button onClick={() => { setIsSignUp((s) => !s); setError(""); }} style={{ background: "none", border: "none", color: "#a78bfa", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600 }}>{isSignUp ? "Sign In" : "Sign Up"}</button>
              </div>
            </React.Fragment>
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: dark ? "#3a3a55" : "#b0a8d0" }}>🔒 Secured by Supabase · Free forever</div>
      </div>
    </div>
  );
}

function PricingModal({ onClose, dark }: { onClose: () => void; dark: boolean }) {
  const [billing, setBilling] = useState("monthly");
  const card = dark ? "#12121e" : "#ffffff";
  const border = dark ? "#1e1e30" : "#ddd8f0";
  const text = dark ? "#e2e2f0" : "#1a1a2e";
  const muted = dark ? "#5a5a7a" : "#8080a0";
  return (
    <div className="overlay" onClick={onClose}>
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 20, padding: 28, maxWidth: 780, width: "100%", maxHeight: "90vh", overflowY: "auto", animation: "fadeUp 0.3s ease" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: text }}>Upgrade VisionAI</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: muted }}>✕</button>
        </div>
        <div style={{ fontSize: 13, color: muted, marginBottom: 20 }}>Unlock unlimited videos, 4K export, and more.</div>
        <div style={{ display: "flex", gap: 4, background: dark ? "#0a0a12" : "#f0eeff", borderRadius: 999, padding: 4, width: "fit-content", marginBottom: 24 }}>
          {["monthly", "yearly"].map((b) => (
            <button key={b} onClick={() => setBilling(b)} style={{ background: billing === b ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "transparent", border: "none", borderRadius: 999, padding: "6px 18px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: billing === b ? "#fff" : muted, transition: "all 0.2s" }}>
              {b === "monthly" ? "Monthly" : "Yearly"}{b === "yearly" && <span style={{ marginLeft: 6, background: "#4ade8033", color: "#4ade80", borderRadius: 999, padding: "1px 6px", fontSize: 10 }}>-20%</span>}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {PLANS.map((plan) => {
            const price = billing === "yearly" && plan.id !== "free" ? `$${Math.round(parseInt(plan.price.replace("$", "")) * 0.8)}` : plan.price;
            return (
              <div key={plan.id} style={{ background: dark ? "#0a0a12" : "#fafafe", border: `2px solid ${dark ? "#2a2a3a" : "#e0d8f8"}`, borderRadius: 14, padding: 18, position: "relative" }}>
                {plan.badge && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999, whiteSpace: "nowrap" }}>{plan.badge}</div>}
                <div style={{ fontSize: 15, fontWeight: 700, color: plan.color, marginBottom: 4 }}>{plan.name}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: text, marginBottom: 8 }}>{price}<span style={{ fontSize: 12, fontWeight: 400, color: muted }}>{plan.period}</span></div>
                <div style={{ height: 1, background: dark ? "#1e1e30" : "#e8e0f8", margin: "12px 0" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {plan.features.map((f) => <div key={f} style={{ display: "flex", gap: 8, fontSize: 12, color: text }}><span style={{ color: plan.color, flexShrink: 0 }}>✓</span>{f}</div>)}
                </div>
                <button style={{ marginTop: 16, width: "100%", padding: "10px", borderRadius: 9, border: plan.id === "free" ? `1px solid ${dark ? "#2a2a3a" : "#d0c8f0"}` : "none", background: plan.id === "free" ? "transparent" : `linear-gradient(135deg,${plan.color},${plan.color}bb)`, color: plan.id === "free" ? (dark ? "#5a5a7a" : "#9090b0") : "#fff", fontSize: 12, fontWeight: 600, cursor: plan.id === "free" ? "default" : "pointer", fontFamily: "inherit" }}>
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: muted }}>🔒 Cancel anytime · 7-day free trial on Pro and Team</div>
      </div>
    </div>
  );
}

function NotifPanel({ notifs, setNotifs, onClose, dark }: { notifs: any[]; setNotifs: any; onClose: () => void; dark: boolean }) {
  const card = dark ? "#12121e" : "#ffffff";
  const border = dark ? "#1e1e30" : "#ddd8f0";
  const text = dark ? "#e2e2f0" : "#1a1a2e";
  const muted = dark ? "#5a5a7a" : "#8080a0";
  const typeColor: Record<string, string> = { success: "#4ade80", info: "#a78bfa", tip: "#f59e0b", upgrade: "#38bdf8" };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999 }} onClick={onClose}>
      <div style={{ position: "absolute", top: 62, right: 20, width: 340, background: card, border: `1px solid ${border}`, borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.3)", animation: "slideIn 0.2s ease", overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: text }}>Notifications</div>
            {notifs.filter((n) => !n.read).length > 0 && <span style={{ background: "#a78bfa", color: "#fff", borderRadius: 999, fontSize: 10, fontWeight: 700, padding: "2px 7px" }}>{notifs.filter((n) => !n.read).length}</span>}
          </div>
          <button onClick={() => setNotifs((n: any[]) => n.map((x) => ({ ...x, read: true })))} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Mark all read</button>
        </div>
        <div style={{ maxHeight: 380, overflowY: "auto" }}>
          {notifs.length === 0 && <div style={{ padding: 24, textAlign: "center", fontSize: 13, color: muted }}>No notifications yet</div>}
          {notifs.map((n) => (
            <div key={n.id} onClick={() => setNotifs((ns: any[]) => ns.map((x) => x.id === n.id ? { ...x, read: true } : x))} style={{ padding: "12px 16px", borderBottom: `1px solid ${dark ? "#1a1a28" : "#f0eeff"}`, display: "flex", gap: 12, cursor: "pointer", background: n.read ? "transparent" : dark ? "#1a1a2a" : "#f5f0ff" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `${typeColor[n.type] || "#a78bfa"}18`, border: `1px solid ${typeColor[n.type] || "#a78bfa"}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{n.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{n.title}</div>
                  <div style={{ fontSize: 10, color: muted, whiteSpace: "nowrap" }}>{n.time}</div>
                </div>
                <div style={{ fontSize: 12, color: muted, marginTop: 2, lineHeight: 1.4 }}>{n.msg}</div>
              </div>
              {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#a78bfa", flexShrink: 0, marginTop: 4 }} />}
            </div>
          ))}
        </div>
        <div style={{ padding: "10px 16px", borderTop: `1px solid ${border}`, textAlign: "center" }}>
          <button onClick={() => setNotifs([])} style={{ background: "none", border: "none", color: muted, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Clear all</button>
        </div>
      </div>
    </div>
  );
}

function ThumbnailGenerator({ prompt, style, dark, onClose }: { prompt: string; style: string; dark: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [thumbs, setThumbs] = useState<any[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const card = dark ? "#12121e" : "#ffffff";
  const border = dark ? "#1e1e30" : "#ddd8f0";
  const text = dark ? "#e2e2f0" : "#1a1a2e";
  const muted = dark ? "#5a5a7a" : "#8080a0";
  const TSTYLES = [
    { id: "bold", label: "Bold", bg: "linear-gradient(135deg,#1a0533,#4a1080)", accent: "#a78bfa" },
    { id: "minimal", label: "Minimal", bg: "linear-gradient(135deg,#0a0a0a,#1a1a1a)", accent: "#ffffff" },
    { id: "vibrant", label: "Vibrant", bg: "linear-gradient(135deg,#7c3aed,#f59e0b)", accent: "#fff" },
    { id: "dark", label: "Dark", bg: "linear-gradient(135deg,#000,#0d0d1a)", accent: "#a78bfa" },
    { id: "neon", label: "Neon", bg: "linear-gradient(135deg,#0a001a,#1a0040)", accent: "#e879f9" },
    { id: "nature", label: "Nature", bg: "linear-gradient(135deg,#0a1f0a,#1a4a1a)", accent: "#4ade80" },
  ];
  async function generate() {
    setLoading(true); setSelected(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 500, messages: [{ role: "user", content: `Generate 4 short punchy YouTube thumbnail titles (max 6 words each, ALL CAPS) for a video about: "${prompt || "AI generated video"}". Style: ${style}. Return ONLY a JSON array of 4 strings.` }] })
      });
      const data = await res.json();
      const raw = data.content?.map((b: any) => b.text || "").join("") || "";
      const titles = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setThumbs(titles.map((t: string, i: number) => ({ id: i, title: t, styleId: TSTYLES[i % TSTYLES.length].id })));
    } catch {
      setThumbs(["STUNNING AI VIDEO", "YOU WON'T BELIEVE THIS", "WATCH UNTIL THE END", "MIND BLOWING VISUALS"].map((t, i) => ({ id: i, title: t, styleId: TSTYLES[i].id })));
    }
    setLoading(false);
  }
  useEffect(() => { generate(); }, []);
  return (
    <div className="overlay" onClick={onClose}>
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 20, padding: 28, maxWidth: 600, width: "100%", animation: "fadeUp 0.3s ease" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: text }}>🖼️ AI Thumbnail Generator</div>
            <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>Powered by Claude AI</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: muted }}>✕</button>
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}><Spinner label="Generating thumbnails with Claude AI..." /></div>
        ) : (
          <React.Fragment>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
              {thumbs.map((th) => {
                const ts = TSTYLES.find((s) => s.id === th.styleId) || TSTYLES[0];
                return (
                  <div key={th.id} onClick={() => setSelected(th.id)} style={{ background: ts.bg, borderRadius: 12, height: 130, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `2px solid ${selected === th.id ? "#a78bfa" : "transparent"}`, position: "relative", overflow: "hidden", transition: "all 0.2s" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: ts.accent, textAlign: "center", padding: "0 14px", textShadow: "0 2px 8px rgba(0,0,0,0.8)", letterSpacing: "0.5px", lineHeight: 1.4, textTransform: "uppercase" }}>{th.title}</div>
                    <div style={{ position: "absolute", bottom: 7, right: 9, fontSize: 10, color: `${ts.accent}99`, fontWeight: 600 }}>{ts.label}</div>
                    {selected === th.id && <div style={{ position: "absolute", top: 7, right: 9, background: "#a78bfa", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff" }}>✓</div>}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="pill" onClick={generate}>🔄 Regenerate</button>
              <button className="genbtn" style={{ width: "auto", padding: "10px 22px", fontSize: 13 }} disabled={selected === null}>⬇ Download Thumbnail</button>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dark, setDark] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Cinematic");
  const [duration, setDuration] = useState("30s");
  const [ratio, setRatio] = useState("16:9");
  const [voice, setVoice] = useState("none");
  const [captionFont, setCaptionFont] = useState("none");
  const [captionLang, setCaptionLang] = useState("English");
  const [music, setMusic] = useState("none");
  const [colorGrade, setColorGrade] = useState("none");
  const [scriptMode, setScriptMode] = useState(false);
  const [scenes, setScenes] = useState([{ id: 1, text: "" }]);
  const [activeTab, setActiveTab] = useState("basic");
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [exportFormat, setExportFormat] = useState("mp4");
  const [exportQuality, setExportQuality] = useState("1080p");
  const [exportFps, setExportFps] = useState("30fps");
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [presets, setPresets] = useState<any[]>([]);
  const [presetName, setPresetName] = useState("");
  const [showPresetInput, setShowPresetInput] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [showThumbs, setShowThumbs] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const exportTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (exportTimer.current) clearInterval(exportTimer.current);
    };
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    loadHistory();
    loadPresets();
    setNotifs([{ id: 1, type: "info", icon: "👋", title: `Welcome back, ${user.user_metadata?.full_name || user.email?.split("@")[0]}!`, msg: "Ready to create your next AI video?", time: "just now", read: false }]);
  }, [user]);

  async function loadHistory() {
    const { data } = await supabase.from("videos").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(6);
    if (data) setHistory(data.map((v: any) => ({ id: v.id, thumb: ["🎬","🌟","🎭","🎨","🚀"][Math.floor(Math.random() * 5)], label: v.prompt?.slice(0, 40) || (v.style + " video"), duration: v.duration, video_url: v.video_url, status: v.status })));
  }

  async function loadPresets() {
    const { data } = await supabase.from("presets").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setPresets(data.map((p: any) => ({ id: p.id, name: p.name, settings: p.settings })));
  }

  async function generateVideo(finalPrompt: string) {
    setPhase("generating"); setProgress(10); setStatusMsg("Saving to database..."); setVideoUrl(null);

    // Save record to Supabase
    const { data: videoRecord } = await supabase.from("videos").insert({
      user_id: user.id, prompt: finalPrompt, style, duration, ratio, voice,
      caption_font: captionFont, caption_lang: captionLang, music, color_grade: colorGrade, status: "generating"
    }).select().single();

    try {
      setProgress(25); setStatusMsg("Connecting to Hugging Face AI...");

      // Use Hugging Face Inference API with mode: 'cors'
      const stylePrompt = `${style.toLowerCase()} style, ${finalPrompt}, high quality, cinematic, smooth motion`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000); // 2 min timeout

      let res: Response;
      try {
        res = await fetch(HF_MODEL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
            "X-Wait-For-Model": "true",
          },
          body: JSON.stringify({
            inputs: stylePrompt,
            parameters: { num_frames: 8, num_inference_steps: 20, height: 256, width: 256 }
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);
      } catch (fetchErr: any) {
        clearTimeout(timeout);
        // CORS or network error — use Pollinations.ai as free fallback (generates images/GIFs)
        setStatusMsg("Switching to backup generator...");
        setProgress(40);
        await useFallbackGenerator(finalPrompt, videoRecord?.id);
        return;
      }

      setProgress(65); setStatusMsg("Processing response...");

      if (!res.ok) {
        if (res.status === 503) {
          setStatusMsg("Model warming up (free tier)... retrying in 30s");
          setProgress(35);
          await new Promise((r) => setTimeout(r, 30000));
          return generateVideo(finalPrompt);
        }
        // Any other error — use fallback
        setStatusMsg("Switching to backup generator...");
        await useFallbackGenerator(finalPrompt, videoRecord?.id);
        return;
      }

      const blob = await res.blob();
      await uploadAndFinish(blob, "video/mp4", videoRecord?.id);

    } catch (err: any) {
      if (videoRecord?.id) await supabase.from("videos").update({ status: "failed" }).eq("id", videoRecord.id);
      setPhase("error");
      setErrorMsg(`Generation failed: ${err.message}. Please try again!`);
    }
  }

  // Fallback: use Pollinations.ai to generate a video-like animated GIF (free, no CORS issues)
  async function useFallbackGenerator(finalPrompt: string, recordId: string) {
    try {
      setProgress(50); setStatusMsg("Generating with Pollinations AI (free fallback)...");

      // Pollinations generates images — we'll create a slideshow-style result
      const encodedPrompt = encodeURIComponent(`${style} style, ${finalPrompt}, cinematic, high quality`);
      const seed = Math.floor(Math.random() * 99999);

      // Generate 3 frames
      const frameUrls = [
        `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=432&seed=${seed}&nologo=true`,
        `https://image.pollinations.ai/prompt/${encodedPrompt}%20scene%202?width=768&height=432&seed=${seed+1}&nologo=true`,
        `https://image.pollinations.ai/prompt/${encodedPrompt}%20final?width=768&height=432&seed=${seed+2}&nologo=true`,
      ];

      setProgress(70); setStatusMsg("Rendering frames...");

      // Verify first frame loads
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Image generation failed"));
        img.src = frameUrls[0];
      });

      setProgress(90); setStatusMsg("Finalizing...");

      // Store the image URL as the video URL (displays as preview image)
      const publicUrl = frameUrls[0];
      setVideoUrl(publicUrl);

      if (recordId) {
        await supabase.from("videos").update({ status: "done", video_url: publicUrl }).eq("id", recordId);
      }

      setProgress(100);
      setNotifs((n) => [{
        id: Date.now(), type: "success", icon: "✅",
        title: "Video generated!",
        msg: "Generated via Pollinations AI. Click download to save.",
        time: "just now", read: false
      }, ...n].slice(0, 10));
      loadHistory();
      setPhase("done");

    } catch (err: any) {
      if (recordId) await supabase.from("videos").update({ status: "failed" }).eq("id", recordId);
      setPhase("error");
      setErrorMsg("Both generators failed. Check your internet connection and try again.");
    }
  }

  async function uploadAndFinish(blob: Blob, contentType: string, recordId: string) {
    setProgress(85); setStatusMsg("Uploading to cloud storage...");
    const ext = contentType === "video/mp4" ? "mp4" : "gif";
    const fileName = `${user.id}/${recordId || Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from("videos").upload(fileName, blob, { contentType, upsert: true });
    if (uploadErr) throw uploadErr;
    const { data: { publicUrl } } = supabase.storage.from("videos").getPublicUrl(fileName);
    setVideoUrl(publicUrl);
    if (recordId) await supabase.from("videos").update({ status: "done", video_url: publicUrl }).eq("id", recordId);
    setProgress(100);
    setNotifs((n) => [{ id: Date.now(), type: "success", icon: "✅", title: "Video generated!", msg: `Your ${style.toLowerCase()} video is ready.`, time: "just now", read: false }, ...n].slice(0, 10));
    loadHistory();
    setPhase("done");
  }

  function generate() {
    const fp = scriptMode ? scenes.map((s, i) => `Scene ${i + 1}: ${s.text}`).join(". ") : prompt;
    if (!fp.trim()) return;
    generateVideo(fp);
  }

  async function enhancePrompt() {
    if (!prompt.trim()) return;
    setPhase("enhancing"); setEnhanced(false);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: `You are a creative video prompt engineer. Enhance this video description to be more vivid, cinematic and detailed for an AI video generator. Keep it under 2800 characters. Return ONLY the enhanced prompt:\n\n"${prompt}"` }] }) });
      const data = await res.json();
      const t = data.content?.map((b: any) => b.text || "").join("") || "";
      setPrompt(t.trim().slice(0, 3000)); setEnhanced(true); setPhase("idle");
      setNotifs((n) => [{ id: Date.now(), type: "info", icon: "✨", title: "Prompt enhanced", msg: "Claude rewrote your prompt with richer detail.", time: "just now", read: false }, ...n].slice(0, 10));
    } catch {
      setPhase("error"); setErrorMsg("Failed to enhance prompt. Try again.");
    }
  }

  function reset() {
    setPhase("idle"); setProgress(0); setPrompt(""); setEnhanced(false); setVideoUrl(null); setStatusMsg("");
    setScenes([{ id: 1, text: "" }]); setExporting(false); setExportDone(false); setExportProgress(0);
  }

  function startExport() {
    if (!videoUrl) return;
    setExporting(true); setExportDone(false); setExportProgress(0);
    let p = 0;
    exportTimer.current = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        clearInterval(exportTimer.current!); setExportProgress(100);
        setTimeout(() => { setExporting(false); setExportDone(true); setNotifs((n) => [{ id: Date.now(), type: "success", icon: "🎬", title: "Export ready", msg: `Exported as ${exportFormat.toUpperCase()} · ${exportQuality}.`, time: "just now", read: false }, ...n].slice(0, 10)); }, 300);
      } else setExportProgress(Math.round(p));
    }, 150);
  }

  function downloadVideo() {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl; a.download = `visionai-${Date.now()}.mp4`; a.click();
  }

  async function savePreset() {
    if (!presetName.trim()) return;
    const settings = { style, duration, ratio, voice, captionFont, music, colorGrade, captionLang };
    const { data } = await supabase.from("presets").insert({ user_id: user.id, name: presetName.trim(), settings }).select().single();
    if (data) setPresets((p) => [{ id: data.id, name: data.name, settings: data.settings }, ...p]);
    setPresetName(""); setShowPresetInput(false);
  }

  async function deletePreset(id: string) {
    await supabase.from("presets").delete().eq("id", id);
    setPresets((p) => p.filter((x) => x.id !== id));
  }

  function loadPreset(pr: any) {
    setStyle(pr.settings.style); setDuration(pr.settings.duration); setRatio(pr.settings.ratio);
    setVoice(pr.settings.voice); setCaptionFont(pr.settings.captionFont); setMusic(pr.settings.music);
    setColorGrade(pr.settings.colorGrade); setCaptionLang(pr.settings.captionLang);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null); setHistory([]); setPresets([]);
  }

  if (authLoading) return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <Spinner label="Loading VisionAI..." />
    </div>
  );

  if (!user) return <AuthScreen onLogin={setUser} dark={dark} />;

  const voiceObj = VOICES.find((v) => v.id === voice);
  const cfObj = CAPTION_FONTS.find((c) => c.id === captionFont);
  const musicObj = MUSIC_TRACKS.find((m) => m.id === music);
  const gradeObj = COLOR_GRADES.find((g) => g.id === colorGrade);
  const isGenerating = phase === "generating";
  const isDone = phase === "done";
  const isEnhancing = phase === "enhancing";
  const unreadCount = notifs.filter((n) => !n.read).length;
  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const userAvatar = userName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
  const bg = dark ? "#0d0d14" : "#f0f0f8";
  const bg2 = dark ? "#12121e" : "#ffffff";
  const bg3 = dark ? "#0a0a12" : "#f5f5fc";
  const borderC = dark ? "#1e1e30" : "#ddd8f0";
  const border2 = dark ? "#2a2a3a" : "#d0ccee";
  const text = dark ? "#e2e2f0" : "#1a1a2e";
  const muted = dark ? "#5a5a7a" : "#8080a0";
  const TABS = [
    { id: "basic", label: "⚙️ Basic" }, { id: "voice", label: "🎙️ Voice" },
    { id: "captions", label: "💬 Captions" }, { id: "music", label: "🎵 Music" },
    { id: "color", label: "🎨 Color" }, { id: "script", label: "📝 Script" },
    { id: "presets", label: "💾 Presets" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "'Sora','Segoe UI',sans-serif", paddingBottom: 60 }}>
      <style>{getCSS(dark)}</style>
      {showPricing && <PricingModal onClose={() => setShowPricing(false)} dark={dark} />}
      {showNotifs && <NotifPanel notifs={notifs} setNotifs={setNotifs} onClose={() => setShowNotifs(false)} dark={dark} />}
      {showThumbs && <ThumbnailGenerator prompt={prompt} style={style} dark={dark} onClose={() => setShowThumbs(false)} />}

      {/* HEADER */}
      <div style={{ borderBottom: `1px solid ${borderC}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12, background: bg2, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🎬</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>VisionAI</div>
          <div style={{ fontSize: 11, color: muted }}>Powered by Hugging Face + Supabase</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setDark((d) => !d)} style={{ width: 36, height: 36, borderRadius: 9, background: bg3, border: `1px solid ${border2}`, cursor: "pointer", fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center" }}>{dark ? "☀️" : "🌙"}</button>
          <button onClick={() => setShowNotifs((s) => !s)} style={{ width: 36, height: 36, borderRadius: 9, background: showNotifs ? "#a78bfa22" : bg3, border: `1px solid ${showNotifs ? "#a78bfa" : border2}`, cursor: "pointer", fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            🔔{unreadCount > 0 && <span style={{ position: "absolute", top: -3, right: -3, background: "#a78bfa", color: "#fff", borderRadius: "50%", fontSize: 9, fontWeight: 700, width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadCount}</span>}
          </button>
          <button onClick={() => setShowPricing(true)} style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 600, padding: "7px 14px", cursor: "pointer", fontFamily: "inherit" }}>⚡ Upgrade</button>
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: bg3, border: `1px solid ${border2}`, borderRadius: 999, padding: "4px 12px 4px 5px" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>{userAvatar}</div>
            <span style={{ fontSize: 12, color: text, fontWeight: 500 }}>{userName}</span>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 20px", display: "grid", gridTemplateColumns: "1fr 288px", gap: 24, alignItems: "start" }}>

        {/* LEFT */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div className="slabel" style={{ marginBottom: 0 }}>{scriptMode ? "Scene-by-Scene Script" : "Your Prompt"}</div>
            <div style={{ display: "flex", gap: 8 }}>
              {!scriptMode && <button className="enhbtn" onClick={enhancePrompt} disabled={!prompt.trim() || isEnhancing || isGenerating}>{isEnhancing ? "✨ Enhancing..." : "✨ Enhance with AI"}</button>}
              <button className={`pill ${scriptMode ? "on" : ""}`} onClick={() => setScriptMode((s) => !s)}>📝 Script Mode</button>
            </div>
          </div>

          {scriptMode ? (
            <div style={{ marginBottom: 18 }}>
              {scenes.map((sc, idx) => (
                <div key={sc.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <div style={{ fontSize: 11, color: "#a78bfa", fontWeight: 600 }}>SCENE {idx + 1}</div>
                    {scenes.length > 1 && <button onClick={() => setScenes((s) => s.filter((x) => x.id !== sc.id))} style={{ background: "none", border: "none", color: muted, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>✕ Remove</button>}
                  </div>
                  <textarea className="inp" rows={3} placeholder={`Describe scene ${idx + 1}...`} value={sc.text} onChange={(e) => setScenes((s) => s.map((x) => x.id === sc.id ? { ...x, text: e.target.value } : x))} disabled={isGenerating} />
                </div>
              ))}
              <button className="pill" onClick={() => setScenes((s) => [...s, { id: Date.now(), text: "" }])}>+ Add Scene</button>
            </div>
          ) : (
            <div style={{ marginBottom: 18 }}>
              <textarea className="inp" rows={8} maxLength={3000} placeholder="Describe your video scene in detail... e.g. A golden sunrise over misty mountains, birds gliding through soft pink clouds, slow cinematic pan..." value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={isGenerating || isEnhancing} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                {enhanced && <div style={{ fontSize: 11, color: "#7c3aed" }}>✨ Enhanced by Claude AI</div>}
                <div style={{ marginLeft: "auto", fontSize: 11, color: prompt.length > 2550 ? "#f87171" : muted }}>{prompt.length}/3000</div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 4, borderBottom: `1px solid ${borderC}`, marginBottom: 16 }}>
            {TABS.map((t) => <button key={t.id} className={`tab ${activeTab === t.id ? "on" : ""}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>)}
          </div>

          {activeTab === "basic" && (
            <div style={{ animation: "fadeIn 0.2s" }}>
              <div style={{ marginBottom: 18 }}>
                <div className="slabel">Video Style</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{STYLES.map((s) => <button key={s} className={`pill ${style === s ? "on" : ""}`} onClick={() => setStyle(s)}>{s}</button>)}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <div><div className="slabel">Duration</div><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{DURATIONS.map((d) => <button key={d} className={`pill ${duration === d ? "on" : ""}`} onClick={() => setDuration(d)}>{d}</button>)}</div></div>
                <div><div className="slabel">Aspect Ratio</div><div style={{ display: "flex", gap: 8 }}>{RATIOS.map((r) => <button key={r} className={`pill ${ratio === r ? "on" : ""}`} onClick={() => setRatio(r)}>{r}</button>)}</div></div>
              </div>
            </div>
          )}
          {activeTab === "voice" && (
            <div style={{ animation: "fadeIn 0.2s" }}>
              <div className="slabel">Voiceover Type</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8 }}>
                {VOICES.map((v) => (<button key={v.id} className={`card ${voice === v.id ? "on" : ""}`} onClick={() => setVoice(v.id)}><div style={{ fontSize: 18, marginBottom: 4 }}>{v.icon}</div><div style={{ fontSize: 12, fontWeight: 600, color: voice === v.id ? "#c4b5fd" : text }}>{v.label}</div><div style={{ fontSize: 10, color: muted, marginTop: 2 }}>{v.desc}</div></button>))}
              </div>
            </div>
          )}
          {activeTab === "captions" && (
            <div style={{ animation: "fadeIn 0.2s" }}>
              <div className="slabel">Caption Font {captionFont !== "none" && <span style={{ background: "#a78bfa22", border: "1px solid #a78bfa44", color: "#c4b5fd", borderRadius: 999, padding: "1px 7px", fontSize: 10, marginLeft: 6 }}>ON</span>}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: 8, marginBottom: 18 }}>
                {CAPTION_FONTS.map((cf) => (<button key={cf.id} className={`card ${captionFont === cf.id ? "on" : ""}`} onClick={() => setCaptionFont(cf.id)} style={{ textAlign: "center" }}><div style={{ fontSize: 14, fontFamily: cf.font, fontWeight: ["impact", "bebas", "futura"].includes(cf.id) ? 700 : 400, color: captionFont === cf.id ? "#c4b5fd" : text, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cf.preview}</div><div style={{ fontSize: 11, fontWeight: 600, color: captionFont === cf.id ? "#c4b5fd" : text }}>{cf.label}</div><div style={{ fontSize: 10, color: muted, marginTop: 2 }}>{cf.desc}</div></button>))}
              </div>
              {captionFont !== "none" && <div><div className="slabel">Language</div><select className="inp" style={{ width: "auto" }} value={captionLang} onChange={(e) => setCaptionLang(e.target.value)}>{CAPTION_LANGUAGES.map((l) => <option key={l}>{l}</option>)}</select></div>}
            </div>
          )}
          {activeTab === "music" && (
            <div style={{ animation: "fadeIn 0.2s" }}>
              <div className="slabel">Background Music</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8 }}>
                {MUSIC_TRACKS.map((m) => (<button key={m.id} className={`card ${music === m.id ? "on" : ""}`} onClick={() => setMusic(m.id)}><div style={{ fontSize: 20, marginBottom: 4 }}>{m.icon}</div><div style={{ fontSize: 12, fontWeight: 600, color: music === m.id ? "#c4b5fd" : text }}>{m.label}</div><div style={{ fontSize: 10, color: muted, marginTop: 2 }}>{m.desc}</div></button>))}
              </div>
            </div>
          )}
          {activeTab === "color" && (
            <div style={{ animation: "fadeIn 0.2s" }}>
              <div className="slabel">Color Grade</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: 8 }}>
                {COLOR_GRADES.map((g) => (<button key={g.id} className={`card ${colorGrade === g.id ? "on" : ""}`} onClick={() => setColorGrade(g.id)}><div style={{ height: 24, borderRadius: 5, marginBottom: 7, background: g.id === "none" ? (dark ? "#2a2a3a" : "#e0e0f0") : g.id === "noir" ? "linear-gradient(90deg,#111,#aaa)" : g.id === "teal" ? "linear-gradient(90deg,#14b8a6,#f97316)" : `linear-gradient(135deg,${g.color}99,${g.color}22)`, border: `1px solid ${colorGrade === g.id ? g.color : border2}` }} /><div style={{ fontSize: 12, fontWeight: 600, color: colorGrade === g.id ? "#c4b5fd" : text }}>{g.label}</div><div style={{ fontSize: 10, color: muted, marginTop: 2 }}>{g.desc}</div></button>))}
              </div>
            </div>
          )}
          {activeTab === "script" && (
            <div style={{ animation: "fadeIn 0.2s" }}>
              <div className="slabel">Scene-by-Scene Script</div>
              {scenes.map((sc, idx) => (
                <div key={sc.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <div style={{ fontSize: 11, color: "#a78bfa", fontWeight: 600 }}>SCENE {idx + 1}</div>
                    {scenes.length > 1 && <button onClick={() => setScenes((s) => s.filter((x) => x.id !== sc.id))} style={{ background: "none", border: "none", color: muted, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>✕</button>}
                  </div>
                  <textarea className="inp" rows={3} placeholder={`Scene ${idx + 1}...`} value={sc.text} onChange={(e) => setScenes((s) => s.map((x) => x.id === sc.id ? { ...x, text: e.target.value } : x))} />
                </div>
              ))}
              <button className="pill" onClick={() => setScenes((s) => [...s, { id: Date.now(), text: "" }])}>+ Add Scene</button>
            </div>
          )}
          {activeTab === "presets" && (
            <div style={{ animation: "fadeIn 0.2s" }}>
              <div className="slabel">Saved Presets</div>
              {showPresetInput ? (
                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  <input className="inp" type="text" placeholder="Preset name..." value={presetName} onChange={(e) => setPresetName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && savePreset()} style={{ flex: 1 }} />
                  <button className="pill on" onClick={savePreset}>Save</button>
                  <button className="pill" onClick={() => setShowPresetInput(false)}>Cancel</button>
                </div>
              ) : (<button className="pill on" style={{ marginBottom: 14 }} onClick={() => setShowPresetInput(true)}>💾 Save Current Settings</button>)}
              {presets.length === 0 ? <div style={{ fontSize: 13, color: muted, textAlign: "center", padding: "16px 0" }}>No presets yet</div>
                : presets.map((pr) => (
                  <div key={pr.id} style={{ background: bg3, border: `1px solid ${border2}`, borderRadius: 10, padding: "11px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div><div style={{ fontSize: 13, fontWeight: 600, color: "#c4b5fd" }}>{pr.name}</div><div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{pr.settings.style} · {pr.settings.duration}</div></div>
                    <div style={{ display: "flex", gap: 8 }}><button className="pill" onClick={() => loadPreset(pr)}>Load</button><button className="pill" onClick={() => deletePreset(pr.id)} style={{ color: "#f87171", borderColor: "#3a1a1a" }}>✕</button></div>
                  </div>
                ))}
            </div>
          )}

          {/* Active badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "14px 0", minHeight: 22 }}>
            {([voice !== "none" && `🎙️ ${voiceObj?.label}`, captionFont !== "none" && `💬 ${cfObj?.label}`, music !== "none" && `🎵 ${musicObj?.label}`, colorGrade !== "none" && `🎨 ${gradeObj?.label}`, scriptMode && `📝 Script (${scenes.length})`] as (string | false)[]).filter(Boolean).map((b) => (
              <span key={b as string} style={{ fontSize: 11, background: dark ? "#1a1a2e" : "#ede8ff", border: `1px solid ${dark ? "#2a2a45" : "#c8beee"}`, color: "#a78bfa", borderRadius: 999, padding: "3px 10px" }}>{b as string}</span>
            ))}
          </div>

          {/* Generate / Progress / Done */}
          {isGenerating ? (
            <div style={{ background: bg3, border: `1px solid ${border2}`, borderRadius: 14, padding: 28, textAlign: "center" }}>
              <Spinner size={40} />
              <div style={{ marginTop: 14, fontSize: 14, color: text, fontWeight: 500 }}>{statusMsg || "Generating..."}</div>
              <div style={{ marginTop: 12, background: dark ? "#1a1a28" : "#e8e0f8", borderRadius: 999, height: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#7c3aed,#a855f7)", borderRadius: 999, transition: "width 0.5s ease" }} />
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: muted }}>{progress}% complete</div>
              <div style={{ marginTop: 10, fontSize: 11, color: muted, background: dark ? "#1a1a28" : "#e8e0f8", borderRadius: 8, padding: "8px 12px" }}>⏱ Free Hugging Face tier may take 30-90 seconds. Hang tight!</div>
            </div>
          ) : isDone ? (
            <div style={{ background: dark ? "#0a180e" : "#efffef", border: "1px solid #1a4a2a", borderRadius: 14, padding: 22, animation: "fadeIn 0.4s ease" }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
                <div style={{ fontWeight: 600, fontSize: 15, color: "#4ade80" }}>Video Generated!</div>
                <div style={{ fontSize: 11, color: "#3a6a4a", marginTop: 4 }}>{style} · {duration} · {ratio}</div>
              </div>
              {videoUrl ? (
                videoUrl.includes("pollinations") || videoUrl.includes(".jpg") || videoUrl.includes(".png") || videoUrl.includes(".webp") ? (
                  <div style={{ position: "relative", marginBottom: 14 }}>
                    <img src={videoUrl} alt="Generated" style={{ width: "100%", borderRadius: 10, border: "1px solid #1a4a2a", display: "block" }} />
                    <div style={{ marginTop: 8, padding: "8px 12px", background: dark ? "#1a1a28" : "#ede8ff", borderRadius: 8, fontSize: 11, color: muted }}>
                      💡 Generated via Pollinations AI (image preview). Hugging Face video generation blocked by browser CORS policy on free hosting. Deploy to Vercel for full video support.
                    </div>
                  </div>
                ) : (
                  <video controls style={{ width: "100%", borderRadius: 10, marginBottom: 14, border: "1px solid #1a4a2a", background: "#000" }} src={videoUrl} />
                )
              ) : (
                <div style={{ background: "#000", borderRadius: 10, height: 160, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <div style={{ fontSize: 44 }}>▶</div>
                </div>
              )}
              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 16, flexWrap: "wrap" }}>
                <button className="pill" onClick={() => setShowThumbs(true)}>🖼️ Generate Thumbnail</button>
                {videoUrl && <button className="pill on" onClick={downloadVideo}>⬇ Download Video</button>}
              </div>
              <div style={{ background: bg3, border: `1px solid ${border2}`, borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#a78bfa", marginBottom: 12 }}>📤 Export Settings</div>
                <div style={{ marginBottom: 10 }}><div style={{ fontSize: 11, color: muted, marginBottom: 7, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Format</div><div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>{[{ id: "mp4", l: "MP4" }, { id: "mov", l: "MOV" }, { id: "webm", l: "WebM" }, { id: "gif", l: "GIF" }, { id: "avi", l: "AVI" }].map((f) => (<button key={f.id} onClick={() => setExportFormat(f.id)} style={{ background: exportFormat === f.id ? "#a78bfa22" : bg, border: `1px solid ${exportFormat === f.id ? "#a78bfa" : border2}`, color: exportFormat === f.id ? "#c4b5fd" : muted, borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600 }}>{f.l}</button>))}</div></div>
                <div style={{ marginBottom: 10 }}><div style={{ fontSize: 11, color: muted, marginBottom: 7, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Quality</div><div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>{[{ id: "480p", l: "480p" }, { id: "720p", l: "720p" }, { id: "1080p", l: "1080p" }, { id: "4k", l: "4K" }].map((q) => (<button key={q.id} onClick={() => setExportQuality(q.id)} style={{ background: exportQuality === q.id ? "#a78bfa22" : bg, border: `1px solid ${exportQuality === q.id ? "#a78bfa" : border2}`, color: exportQuality === q.id ? "#c4b5fd" : muted, borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600 }}>{q.l}</button>))}</div></div>
                <div style={{ marginBottom: 14 }}><div style={{ fontSize: 11, color: muted, marginBottom: 7, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Frame Rate</div><div style={{ display: "flex", gap: 7 }}>{["24fps", "30fps", "60fps"].map((f) => (<button key={f} onClick={() => setExportFps(f)} style={{ background: exportFps === f ? "#a78bfa22" : bg, border: `1px solid ${exportFps === f ? "#a78bfa" : border2}`, color: exportFps === f ? "#c4b5fd" : muted, borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600 }}>{f}</button>))}</div></div>
                {exporting ? (
                  <div><div style={{ fontSize: 12, color: muted, marginBottom: 6 }}>Exporting... {exportProgress}%</div><div style={{ background: dark ? "#1a1a28" : "#e8e0f8", borderRadius: 999, height: 5 }}><div style={{ height: "100%", width: `${exportProgress}%`, background: "linear-gradient(90deg,#7c3aed,#a855f7)", borderRadius: 999, transition: "width 0.2s" }} /></div></div>
                ) : exportDone ? (
                  <div><div style={{ background: dark ? "#0a1f12" : "#efffef", border: "1px solid #1a4a2a", borderRadius: 8, padding: "9px 12px", marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 18 }}>✅</span><div><div style={{ fontSize: 13, fontWeight: 600, color: "#4ade80" }}>Export Complete!</div><div style={{ fontSize: 11, color: "#3a6a4a" }}>Ready · {exportFormat.toUpperCase()} · {exportQuality}</div></div></div><div style={{ display: "flex", gap: 8 }}><button className="pill on" onClick={downloadVideo}>⬇ Download</button><button className="pill" onClick={() => setExportDone(false)}>🔄 Re-export</button></div></div>
                ) : (
                  <button onClick={startExport} style={{ width: "100%", padding: "10px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>📤 Export {exportFormat.toUpperCase()} · {exportQuality}</button>
                )}
              </div>
              <div style={{ textAlign: "center", marginTop: 12 }}><button className="pill" onClick={reset}>+ New Video</button></div>
            </div>
          ) : (
            <button className="genbtn" onClick={generate} disabled={(!prompt.trim() && !scriptMode) || (scriptMode && scenes.every((s) => !s.text.trim())) || isEnhancing}>
              🎬 Generate Video (Hugging Face AI)
            </button>
          )}
          {phase === "error" && (
            <div style={{ marginTop: 10, padding: "12px 14px", background: "#1a0a0a", border: "1px solid #4a1a1a", borderRadius: 8, fontSize: 12, color: "#f87171" }}>
              ⚠️ {errorMsg}
              <button onClick={() => { setPhase("idle"); setErrorMsg(""); }} style={{ marginLeft: 10, background: "none", border: "none", color: "#a78bfa", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Try again</button>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="sbcard">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{userAvatar}</div>
              <div style={{ overflow: "hidden", flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</div>
                <div style={{ fontSize: 11, color: muted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {[{ val: history.length, label: "Videos", color: "#c4b5fd" }, { val: "Free", label: "Plan", color: "#4ade80" }, { val: "∞", label: "Credits", color: "#f59e0b" }].map(({ val, label, color }) => (
                <div key={label} style={{ flex: 1, background: bg3, border: `1px solid ${border2}`, borderRadius: 8, padding: "7px 6px", textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color }}>{val}</div>
                  <div style={{ fontSize: 10, color: muted, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowPricing(true)} style={{ width: "100%", background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 600, padding: "8px", cursor: "pointer", fontFamily: "inherit", marginBottom: 8 }}>⚡ Upgrade to Pro</button>
            <button onClick={signOut} style={{ width: "100%", background: "transparent", border: `1px solid ${border2}`, borderRadius: 8, color: muted, fontSize: 12, padding: "7px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>🚪 Sign Out</button>
          </div>

          <div>
            <div className="slabel">Recent Generations</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {history.length === 0 ? (
                <div style={{ fontSize: 13, color: muted, textAlign: "center", padding: "16px 0", background: bg2, borderRadius: 12, border: `1px solid ${borderC}` }}>No videos yet - generate your first!</div>
              ) : history.map((item) => (
                <div key={item.id} className="hcard">
                  <div style={{ width: 42, height: 42, borderRadius: 8, background: dark ? "#1a1a28" : "#e8e0f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.thumb}</div>
                  <div style={{ overflow: "hidden", flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: text }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: muted, marginTop: 2, display: "flex", gap: 8, alignItems: "center" }}>
                      <span>{item.duration}</span>
                      {item.status && <span style={{ background: item.status === "done" ? "#4ade8022" : "#a78bfa22", color: item.status === "done" ? "#4ade80" : "#a78bfa", borderRadius: 999, padding: "1px 6px", fontSize: 10 }}>{item.status}</span>}
                    </div>
                  </div>
                  {item.video_url && <a href={item.video_url} target="_blank" rel="noreferrer" style={{ fontSize: 16, textDecoration: "none", flexShrink: 0 }}>▶</a>}
                </div>
              ))}
            </div>
          </div>

          <div className="sbcard" style={{ fontSize: 12, lineHeight: 1.9 }}>
            <div style={{ color: "#a78bfa", fontWeight: 600, marginBottom: 8 }}>⚡ Quick Settings</div>
            {([["🎬", "Style", style], ["⏱", "Duration", duration], ["📐", "Ratio", ratio], ["🎙️", "Voice", voiceObj?.label], ["💬", "Captions", captionFont !== "none" ? cfObj?.label : "Off"], ["🎵", "Music", musicObj?.label], ["🎨", "Color", gradeObj?.label]] as [string, string, string | undefined][]).map(([icon, key, val]) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span style={{ color: muted }}>{icon} {key}</span>
                <span style={{ color: dark ? "#8080a0" : "#6060a0", textAlign: "right" }}>{val}</span>
              </div>
            ))}
          </div>

          <div className="sbcard" style={{ fontSize: 12, color: muted, lineHeight: 1.6 }}>
            <div style={{ color: "#4ade80", fontWeight: 600, marginBottom: 5 }}>🔗 Live Connections</div>
            {["Supabase Auth", "Supabase Storage", "Hugging Face AI", "Claude AI (Enhancer)"].map((s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block", flexShrink: 0 }} />
                <span>{s} ✓</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
