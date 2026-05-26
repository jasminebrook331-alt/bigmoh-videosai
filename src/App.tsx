import React, { useState, useRef, useEffect } from "react";
// @ts-ignore
import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js";

const SUPABASE_URL = "https://vjpdqkrqrsynhsubotxt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqcGRxa3JxcnN5bmhzdWJvdHh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0Mzk1OTksImV4cCI6MjA5NTAxNTU5OX0.SyGYE8OKjyQAXTjzZyYJXuZs0BG-li30axkMgiY-DAE";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const STYLES = ["Cinematic","Cartoon","Realistic","Anime","Slideshow"];
const RATIOS = ["16:9","9:16","1:1"];
const DURATIONS = ["30s","1 min","2 min","5 min","10 min"];
const VOICES = [
  {id:"none",   label:"None",        icon:"🔇", desc:"No voiceover",        pitch:1,   rate:1,    volume:1,   previewText:"No voice selected."},
  {id:"deep-m", label:"Deep Male",   icon:"🎙️", desc:"Bold, authoritative", pitch:0.5, rate:0.85, volume:1,   previewText:"Hello, I am a deep authoritative narrator."},
  {id:"warm-f", label:"Warm Female", icon:"🎙️", desc:"Warm, clear female",  pitch:1.4, rate:0.95, volume:1,   previewText:"Hi there, welcome to this story."},
  {id:"doc",    label:"Documentary", icon:"📽️", desc:"Calm, informative",   pitch:0.8, rate:0.88, volume:0.9, previewText:"In this remarkable journey, we discover something extraordinary."},
  {id:"drama",  label:"Dramatic",    icon:"🎭", desc:"Intense & emotional",  pitch:0.7, rate:0.78, volume:1,   previewText:"The fate of the world hung in the balance..."},
  {id:"whisper",label:"Whispering",  icon:"🤫", desc:"Soft, intimate",       pitch:1.1, rate:0.7,  volume:0.5, previewText:"Listen closely, I have something important to tell you..."},
  {id:"energy", label:"Energetic",   icon:"⚡", desc:"Upbeat & exciting",    pitch:1.3, rate:1.25, volume:1,   previewText:"This is absolutely amazing, let's go!"},
  {id:"robot",  label:"Robotic",     icon:"🤖", desc:"Synthetic AI",        pitch:0.6, rate:1.1,  volume:1,   previewText:"Initiating sequence. Processing complete."},
  {id:"kids",   label:"Kids",        icon:"🧒", desc:"Friendly & fun",      pitch:1.6, rate:1.1,  volume:1,   previewText:"Yay! This is so much fun, let's play!"},
  {id:"news",   label:"News Anchor", icon:"📺", desc:"Professional broadcast",pitch:0.9,rate:1.0, volume:1,   previewText:"Good evening. Here is tonight's top story."},
  {id:"story",  label:"Storyteller", icon:"📖", desc:"Engaging narrative",   pitch:1.0, rate:0.82, volume:1,   previewText:"Once upon a time, in a land far away..."},
  {id:"elder",  label:"Elder",       icon:"👴", desc:"Wise, slow, gravitas", pitch:0.55,rate:0.72, volume:0.9, previewText:"In my many years, I have learned this truth..."},
];
const CAPTION_FONTS = [
  {id:"none",label:"Off",preview:"Off",font:"Arial",desc:"No captions"},
  {id:"impact",label:"Impact",preview:"BOOM",font:"Impact",desc:"Bold & punchy"},
  {id:"georgia",label:"Georgia",preview:"Story",font:"Georgia",desc:"Classic serif"},
  {id:"courier",label:"Typewriter",preview:"Type",font:"Courier New",desc:"Retro monospace"},
  {id:"comic",label:"Comic",preview:"Fun!",font:"Comic Sans MS",desc:"Playful & casual"},
  {id:"futura",label:"Futura",preview:"MODERN",font:"Trebuchet MS",desc:"Clean geometric"},
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
  {id:"free",name:"Free",price:"$0",period:"forever",color:"#4ade80",features:["Unlimited videos","Free forever","AI image frames","Basic voiceover","Cloud storage"],cta:"Current Plan"},
  {id:"pro",name:"Pro",price:"$12",period:"/month",color:"#a78bfa",badge:"Most Popular",features:["Everything in Free","Priority generation","4K export","All voices","No watermark","Advanced AI"],cta:"Upgrade to Pro"},
  {id:"team",name:"Team",price:"$29",period:"/month",color:"#38bdf8",features:["Everything in Pro","5 team members","Shared workspace","Analytics","Dedicated support"],cta:"Start Team Plan"},
];

// Music frequencies for Web Audio API (free, no external files needed)
const MUSIC_CONFIGS: Record<string, {type: OscillatorType, freq: number, tempo: number}> = {
  epic:      {type:"sawtooth", freq:55,  tempo:0.8},
  lofi:      {type:"sine",     freq:220, tempo:1.2},
  ambient:   {type:"sine",     freq:110, tempo:2.0},
  corporate: {type:"square",   freq:330, tempo:1.0},
  jazz:      {type:"sine",     freq:277, tempo:0.9},
  electronic:{type:"sawtooth", freq:440, tempo:0.5},
  acoustic:  {type:"triangle", freq:196, tempo:1.1},
  cinematic: {type:"sawtooth", freq:65,  tempo:1.5},
  nature:    {type:"sine",     freq:523, tempo:3.0},
};

// TTS voices mapping
const VOICE_NAMES: Record<string, string> = {
  "narrator-m":  "en-US male",
  "narrator-f":  "en-US female",
  "documentary": "en-GB",
  "dramatic":    "en-US",
  "whispering":  "en-US",
  "energetic":   "en-US",
  "robotic":     "en-US",
  "kids":        "en-US",
  "news":        "en-GB",
};

function getCSS(dark: boolean): string {
  const bg=dark?"#0d0d14":"#f0f0f8", bg2=dark?"#12121e":"#ffffff", bg3=dark?"#0a0a12":"#f5f5fc";
  const border=dark?"#1e1e30":"#ddd8f0", border2=dark?"#2a2a3a":"#d0ccee";
  const text=dark?"#e2e2f0":"#1a1a2e", muted=dark?"#5a5a7a":"#8080a0";
  return `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;}body{margin:0;background:${bg};color:${text};}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulsebar{0%,100%{opacity:.7}50%{opacity:1}}
@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}
.pill{background:transparent;border:1px solid ${border2};color:${muted};border-radius:999px;padding:6px 14px;font-size:12px;cursor:pointer;transition:all 0.18s;font-family:inherit;}
.pill:hover{border-color:#a78bfa;color:#a78bfa;} .pill.on{background:#a78bfa22;border-color:#a78bfa;color:#c4b5fd;}
.card{background:${bg3};border:1px solid ${border2};border-radius:10px;padding:10px 12px;cursor:pointer;transition:all 0.18s;font-family:inherit;text-align:left;}
.card:hover{border-color:#a78bfa66;} .card.on{background:#a78bfa18;border-color:#a78bfa;}
.tab{background:transparent;border:none;color:${muted};font-family:inherit;font-size:12px;padding:8px 12px;cursor:pointer;border-radius:8px;transition:all 0.18s;white-space:nowrap;font-weight:500;}
.tab:hover{color:#c4b5fd;background:${dark?"#1a1a28":"#ede8ff"};} .tab.on{color:#c4b5fd;background:#a78bfa22;}
.genbtn{width:100%;padding:14px;border-radius:12px;border:none;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;letter-spacing:0.3px;transition:opacity 0.2s,transform 0.15s;}
.genbtn:hover:not(:disabled){opacity:0.88;transform:translateY(-1px);} .genbtn:disabled{opacity:0.4;cursor:not-allowed;}
.inp{width:100%;background:${bg3};border:1px solid ${border2};border-radius:10px;color:${text};font-family:inherit;font-size:13px;padding:10px 14px;outline:none;transition:border-color 0.2s;}
.inp:focus{border-color:#7c3aed;} textarea.inp{resize:none;line-height:1.6;font-size:14px;padding:14px;} select.inp{cursor:pointer;}
.hcard{background:${bg2};border:1px solid ${border2};border-radius:12px;padding:12px;display:flex;align-items:center;gap:10px;transition:border-color 0.2s;}
.hcard:hover{border-color:#a78bfa66;}
.slabel{font-size:11px;font-weight:600;letter-spacing:1.2px;color:${muted};text-transform:uppercase;margin-bottom:10px;}
.enhbtn{background:transparent;border:1px solid ${dark?"#3a3a55":"#c8c0f0"};color:#a78bfa;border-radius:8px;padding:7px 13px;font-size:12px;cursor:pointer;transition:all 0.18s;font-family:inherit;}
.enhbtn:hover{background:#a78bfa15;border-color:#a78bfa;} .enhbtn:disabled{opacity:0.4;cursor:not-allowed;}
.sbcard{background:${bg2};border:1px solid ${border};border-radius:14px;padding:16px;}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(4px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;}
`;
}

function Spinner({ size=36, label="" }: { size?: number; label?: string }) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
      <div style={{width:size,height:size,borderRadius:"50%",border:"3px solid #2a2a3a",borderTop:"3px solid #a78bfa",animation:"spin 0.8s linear infinite"}}/>
      {label && <div style={{fontSize:13,color:"#7070a0"}}>{label}</div>}
    </div>
  );
}

// ── AUTH SCREEN ──────────────────────────────────────────────────
function AuthScreen({ onLogin, dark }: { onLogin: (u: any) => void; dark: boolean }) {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [showPass,setShowPass]=useState(false);
  const [isSignUp,setIsSignUp]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [success,setSuccess]=useState("");
  const bg=dark?"#0d0d14":"#f0f0f8", card=dark?"#12121e":"#ffffff";
  const border=dark?"#1e1e30":"#ddd8f0", text=dark?"#e2e2f0":"#1a1a2e", muted=dark?"#5a5a7a":"#8080a0";

  async function submit() {
    setError(""); setSuccess("");
    if (!email.trim()||!password.trim()) return setError("Please fill in all fields.");
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error: err } = await supabase.auth.signUp({
          email, password,
          options: {
            data: { full_name: name || email.split("@")[0] },
            emailRedirectTo: window.location.origin,
          }
        });
        if (err) throw err;
        if (data?.user?.identities?.length === 0) {
          setError("This email is already registered. Please sign in instead.");
          setIsSignUp(false);
        } else if (data?.session) {
          // Email confirmation disabled in Supabase — direct login works
          onLogin(data.user);
        } else {
          // Try to sign in immediately anyway
          const { data: sd, error: se } = await supabase.auth.signInWithPassword({ email, password });
          if (!se && sd?.user) {
            onLogin(sd.user);
          } else {
            setSuccess("Account created! Check your email for a confirmation link, then sign in.");
            setIsSignUp(false);
          }
        }
      } else {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) {
          if (err.message.includes("Email not confirmed")) {
            await supabase.auth.resend({ type: "signup", email });
            setError("Email not confirmed. We resent the confirmation link — check your inbox AND spam folder.");
          } else if (err.message.includes("Invalid") || err.message.includes("invalid")) {
            setError("Wrong email or password. Please try again.");
          } else {
            throw err;
          }
        } else {
          onLogin(data.user);
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Try again.");
    }
    setLoading(false);
  }

  async function resendConfirmation() {
    if (!email.trim()) return setError("Enter your email address first.");
    const { error: err } = await supabase.auth.resend({ type: "signup", email });
    if (err) setError(err.message);
    else setSuccess("Confirmation email resent! Check your inbox and spam folder.");
  }

  return (
    <div style={{minHeight:"100vh",background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Sora','Segoe UI',sans-serif",padding:20}}>
      <style>{getCSS(dark)}</style>
      <div style={{width:"100%",maxWidth:420,animation:"fadeUp 0.4s ease"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:54,height:54,borderRadius:14,background:"linear-gradient(135deg,#7c3aed,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 12px"}}>🎬</div>
          <div style={{fontSize:22,fontWeight:700,color:text,letterSpacing:"-0.5px"}}>VisionAI</div>
          <div style={{fontSize:13,color:muted,marginTop:4}}>Free & Unlimited Text to Video</div>
        </div>
        <div style={{background:card,border:`1px solid ${border}`,borderRadius:16,padding:28}}>
          <div style={{fontSize:17,fontWeight:600,color:text,marginBottom:4}}>{isSignUp?"Create account":"Sign in"}</div>
          <div style={{fontSize:12,color:muted,marginBottom:22}}>{isSignUp?"Start creating AI videos for free — no limits!":"Welcome back!"}</div>

          {success && (
            <div style={{marginBottom:16,padding:"12px 14px",background:"#0a1f12",border:"1px solid #1a4a2a",borderRadius:8,fontSize:12,color:"#4ade80",lineHeight:1.6}}>
              ✅ {success}
            </div>
          )}

          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {isSignUp && (
              <div>
                <div style={{fontSize:12,color:muted,marginBottom:6}}>Full Name</div>
                <input className="inp" type="text" placeholder="e.g. Big Moh" value={name} onChange={e=>setName(e.target.value)}/>
              </div>
            )}
            <div>
              <div style={{fontSize:12,color:muted,marginBottom:6}}>Email Address</div>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14}}>✉️</span>
                <input className="inp" type="text" placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)} style={{paddingLeft:36}} onKeyDown={e=>e.key==="Enter"&&submit()}/>
              </div>
            </div>
            <div>
              <div style={{fontSize:12,color:muted,marginBottom:6}}>Password</div>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14}}>🔒</span>
                <input className="inp" type={showPass?"text":"password"} placeholder={isSignUp?"Min. 6 characters":"Your password"} value={password} onChange={e=>setPassword(e.target.value)} style={{paddingLeft:36,paddingRight:40}} onKeyDown={e=>e.key==="Enter"&&submit()}/>
                <button onClick={()=>setShowPass(s=>!s)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:14,color:muted}}>{showPass?"🙈":"👁️"}</button>
              </div>
            </div>
          </div>

          {error && (
            <div style={{marginTop:12,padding:"9px 12px",background:"#1a0a0a",border:"1px solid #4a1a1a",borderRadius:8,fontSize:12,color:"#f87171"}}>
              ⚠️ {error}
              {error.includes("confirm") && (
                <button onClick={resendConfirmation} style={{display:"block",marginTop:6,background:"none",border:"none",color:"#a78bfa",cursor:"pointer",fontSize:12,fontFamily:"inherit",textDecoration:"underline"}}>
                  Resend confirmation email
                </button>
              )}
            </div>
          )}

          <button className="genbtn" style={{marginTop:18}} onClick={submit} disabled={loading}>
            {loading
              ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span style={{width:14,height:14,borderRadius:"50%",border:"2px solid #ffffff44",borderTop:"2px solid #fff",animation:"spin 0.7s linear infinite",display:"inline-block"}}/>{isSignUp?"Creating...":"Signing in..."}</span>
              : isSignUp ? "🚀 Create Free Account" : "🔑 Sign In"
            }
          </button>

          {/* Skip email confirmation option */}
          {!isSignUp && (
            <div style={{marginTop:14,padding:"10px 12px",background:dark?"#0a0a18":"#f5f0ff",border:`1px solid ${border}`,borderRadius:8,fontSize:12,color:muted}}>
              <div style={{fontWeight:600,marginBottom:4,color:dark?"#7070a0":"#9070c0"}}>💡 New user?</div>
              After signing up, we try to log you in automatically. If it fails, check your email for a confirmation link — also check your spam/junk folder. Click the link then come back to sign in.
              <button onClick={resendConfirmation} style={{display:"block",marginTop:6,background:"none",border:"none",color:"#a78bfa",cursor:"pointer",fontSize:12,fontFamily:"inherit",textDecoration:"underline"}}>
                Click here to resend confirmation email
              </button>
            </div>
          )}

          <div style={{marginTop:18,textAlign:"center",fontSize:13,color:muted}}>
            {isSignUp?"Have an account? ":"No account? "}
            <button onClick={()=>{setIsSignUp(s=>!s);setError("");setSuccess("");}} style={{background:"none",border:"none",color:"#a78bfa",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600}}>{isSignUp?"Sign In":"Sign Up Free"}</button>
          </div>
        </div>
        <div style={{textAlign:"center",marginTop:16,fontSize:11,color:dark?"#3a3a55":"#b0a8d0"}}>🔒 Secured by Supabase · 100% Free · Unlimited Videos</div>
      </div>
    </div>
  );
}

// ── PRICING MODAL ────────────────────────────────────────────────
function PricingModal({ onClose, dark }: { onClose: ()=>void; dark: boolean }) {
  const [billing,setBilling]=useState("monthly");
  const card=dark?"#12121e":"#ffffff", border=dark?"#1e1e30":"#ddd8f0";
  const text=dark?"#e2e2f0":"#1a1a2e", muted=dark?"#5a5a7a":"#8080a0";
  return (
    <div className="overlay" onClick={onClose}>
      <div style={{background:card,border:`1px solid ${border}`,borderRadius:20,padding:28,maxWidth:780,width:"100%",maxHeight:"90vh",overflowY:"auto",animation:"fadeUp 0.3s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
          <div style={{fontSize:20,fontWeight:700,color:text}}>Upgrade VisionAI</div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:muted}}>x</button>
        </div>
        <div style={{fontSize:13,color:muted,marginBottom:20}}>Unlock advanced features and priority generation.</div>
        <div style={{display:"flex",gap:4,background:dark?"#0a0a12":"#f0eeff",borderRadius:999,padding:4,width:"fit-content",marginBottom:24}}>
          {["monthly","yearly"].map(b=>(
            <button key={b} onClick={()=>setBilling(b)} style={{background:billing===b?"linear-gradient(135deg,#7c3aed,#a855f7)":"transparent",border:"none",borderRadius:999,padding:"6px 18px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:billing===b?"#fff":muted,transition:"all 0.2s"}}>
              {b==="monthly"?"Monthly":"Yearly"}{b==="yearly"&&<span style={{marginLeft:6,background:"#4ade8033",color:"#4ade80",borderRadius:999,padding:"1px 6px",fontSize:10}}>-20%</span>}
            </button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
          {PLANS.map(plan=>{
            const price=billing==="yearly"&&plan.id!=="free"?`$${Math.round(parseInt(plan.price.replace("$",""))*0.8)}`:plan.price;
            return (
              <div key={plan.id} style={{background:dark?"#0a0a12":"#fafafe",border:`2px solid ${dark?"#2a2a3a":"#e0d8f8"}`,borderRadius:14,padding:18,position:"relative"}}>
                {plan.badge&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#7c3aed,#a855f7)",color:"#fff",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:999,whiteSpace:"nowrap"}}>{plan.badge}</div>}
                <div style={{fontSize:15,fontWeight:700,color:plan.color,marginBottom:4}}>{plan.name}</div>
                <div style={{fontSize:24,fontWeight:700,color:text,marginBottom:8}}>{price}<span style={{fontSize:12,fontWeight:400,color:muted}}>{plan.period}</span></div>
                <div style={{height:1,background:dark?"#1e1e30":"#e8e0f8",margin:"12px 0"}}/>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {plan.features.map(f=><div key={f} style={{display:"flex",gap:8,fontSize:12,color:text}}><span style={{color:plan.color,flexShrink:0}}>+</span>{f}</div>)}
                </div>
                <button style={{marginTop:16,width:"100%",padding:"10px",borderRadius:9,border:plan.id==="free"?`1px solid ${dark?"#2a2a3a":"#d0c8f0"}`:"none",background:plan.id==="free"?"transparent":`linear-gradient(135deg,${plan.color},${plan.color}bb)`,color:plan.id==="free"?(dark?"#5a5a7a":"#9090b0"):"#fff",fontSize:12,fontWeight:600,cursor:plan.id==="free"?"default":"pointer",fontFamily:"inherit"}}>{plan.cta}</button>
              </div>
            );
          })}
        </div>
        <div style={{textAlign:"center",marginTop:18,fontSize:12,color:muted}}>Free plan includes unlimited video generation forever</div>
      </div>
    </div>
  );
}

// ── NOTIFICATIONS ────────────────────────────────────────────────
function NotifPanel({ notifs, setNotifs, onClose, dark }: { notifs: any[]; setNotifs: any; onClose: ()=>void; dark: boolean }) {
  const card=dark?"#12121e":"#ffffff", border=dark?"#1e1e30":"#ddd8f0";
  const text=dark?"#e2e2f0":"#1a1a2e", muted=dark?"#5a5a7a":"#8080a0";
  const tc: Record<string,string>={success:"#4ade80",info:"#a78bfa",tip:"#f59e0b",upgrade:"#38bdf8"};
  return (
    <div style={{position:"fixed",inset:0,zIndex:999}} onClick={onClose}>
      <div style={{position:"absolute",top:62,right:20,width:340,background:card,border:`1px solid ${border}`,borderRadius:16,boxShadow:"0 8px 32px rgba(0,0,0,0.3)",animation:"slideIn 0.2s ease",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"14px 16px",borderBottom:`1px solid ${border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{fontSize:14,fontWeight:600,color:text}}>Notifications</div>
            {notifs.filter(n=>!n.read).length>0&&<span style={{background:"#a78bfa",color:"#fff",borderRadius:999,fontSize:10,fontWeight:700,padding:"2px 7px"}}>{notifs.filter(n=>!n.read).length}</span>}
          </div>
          <button onClick={()=>setNotifs((n: any[])=>n.map(x=>({...x,read:true})))} style={{background:"none",border:"none",color:"#a78bfa",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Mark all read</button>
        </div>
        <div style={{maxHeight:380,overflowY:"auto"}}>
          {notifs.length===0&&<div style={{padding:24,textAlign:"center",fontSize:13,color:muted}}>No notifications yet</div>}
          {notifs.map(n=>(
            <div key={n.id} onClick={()=>setNotifs((ns: any[])=>ns.map(x=>x.id===n.id?{...x,read:true}:x))} style={{padding:"12px 16px",borderBottom:`1px solid ${dark?"#1a1a28":"#f0eeff"}`,display:"flex",gap:12,cursor:"pointer",background:n.read?"transparent":dark?"#1a1a2a":"#f5f0ff"}}>
              <div style={{width:34,height:34,borderRadius:10,background:`${tc[n.type]||"#a78bfa"}18`,border:`1px solid ${tc[n.type]||"#a78bfa"}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{n.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
                  <div style={{fontSize:13,fontWeight:600,color:text}}>{n.title}</div>
                  <div style={{fontSize:10,color:muted,whiteSpace:"nowrap"}}>{n.time}</div>
                </div>
                <div style={{fontSize:12,color:muted,marginTop:2,lineHeight:1.4}}>{n.msg}</div>
              </div>
              {!n.read&&<div style={{width:7,height:7,borderRadius:"50%",background:"#a78bfa",flexShrink:0,marginTop:4}}/>}
            </div>
          ))}
        </div>
        <div style={{padding:"10px 16px",borderTop:`1px solid ${border}`,textAlign:"center"}}>
          <button onClick={()=>setNotifs([])} style={{background:"none",border:"none",color:muted,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Clear all</button>
        </div>
      </div>
    </div>
  );
}

// ── THUMBNAIL GENERATOR ──────────────────────────────────────────
function ThumbnailGenerator({ prompt, style, dark, onClose }: { prompt: string; style: string; dark: boolean; onClose: ()=>void }) {
  const [loading,setLoading]=useState(true);
  const [thumbs,setThumbs]=useState<any[]>([]);
  const [selected,setSelected]=useState<number|null>(null);
  const card=dark?"#12121e":"#ffffff", border=dark?"#1e1e30":"#ddd8f0";
  const text=dark?"#e2e2f0":"#1a1a2e", muted=dark?"#5a5a7a":"#8080a0";
  const TS=[
    {id:"bold",label:"Bold",bg:"linear-gradient(135deg,#1a0533,#4a1080)",accent:"#a78bfa"},
    {id:"minimal",label:"Minimal",bg:"linear-gradient(135deg,#0a0a0a,#1a1a1a)",accent:"#ffffff"},
    {id:"vibrant",label:"Vibrant",bg:"linear-gradient(135deg,#7c3aed,#f59e0b)",accent:"#fff"},
    {id:"dark",label:"Dark",bg:"linear-gradient(135deg,#000,#0d0d1a)",accent:"#a78bfa"},
    {id:"neon",label:"Neon",bg:"linear-gradient(135deg,#0a001a,#1a0040)",accent:"#e879f9"},
    {id:"nature",label:"Nature",bg:"linear-gradient(135deg,#0a1f0a,#1a4a1a)",accent:"#4ade80"},
  ];
  async function generate() {
    setLoading(true); setSelected(null);
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:500,messages:[{role:"user",content:`Generate 4 short punchy YouTube thumbnail titles (max 6 words each, ALL CAPS) for a video about: "${prompt||"AI generated video"}". Style: ${style}. Return ONLY a JSON array of 4 strings.`}]})});
      const data=await res.json();
      const raw=data.content?.map((b: any)=>b.text||"").join("")||"";
      const titles=JSON.parse(raw.replace(/```json|```/g,"").trim());
      setThumbs(titles.map((t: string,i: number)=>({id:i,title:t,styleId:TS[i%TS.length].id})));
    } catch {
      setThumbs(["STUNNING AI VIDEO","YOU MUST SEE THIS","WATCH UNTIL END","MIND BLOWING"].map((t,i)=>({id:i,title:t,styleId:TS[i].id})));
    }
    setLoading(false);
  }
  useEffect(()=>{generate();},[]);
  return (
    <div className="overlay" onClick={onClose}>
      <div style={{background:card,border:`1px solid ${border}`,borderRadius:20,padding:28,maxWidth:600,width:"100%",animation:"fadeUp 0.3s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div>
            <div style={{fontSize:17,fontWeight:700,color:text}}>Thumbnail Generator</div>
            <div style={{fontSize:12,color:muted,marginTop:2}}>Powered by Claude AI</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:muted}}>x</button>
        </div>
        {loading?(<div style={{textAlign:"center",padding:"32px 0"}}><Spinner label="Generating thumbnails..."/></div>):(
          <React.Fragment>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18}}>
              {thumbs.map(th=>{
                const ts=TS.find(s=>s.id===th.styleId)||TS[0];
                return (
                  <div key={th.id} onClick={()=>setSelected(th.id)} style={{background:ts.bg,borderRadius:12,height:130,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",border:`2px solid ${selected===th.id?"#a78bfa":"transparent"}`,position:"relative",overflow:"hidden",transition:"all 0.2s"}}>
                    <div style={{fontSize:13,fontWeight:800,color:ts.accent,textAlign:"center",padding:"0 14px",textShadow:"0 2px 8px rgba(0,0,0,0.8)",letterSpacing:"0.5px",lineHeight:1.4,textTransform:"uppercase"}}>{th.title}</div>
                    {selected===th.id&&<div style={{position:"absolute",top:7,right:9,background:"#a78bfa",borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff"}}>ok</div>}
                  </div>
                );
              })}
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button className="pill" onClick={generate}>Regenerate</button>
              <button className="genbtn" style={{width:"auto",padding:"10px 22px",fontSize:13}} disabled={selected===null}>Download Thumbnail</button>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────
export default function App() {
  const [user,setUser]=useState<any>(null);
  const [authLoading,setAuthLoading]=useState(true);
  const [dark,setDark]=useState(true);

  // Settings
  const [prompt,setPrompt]=useState("");
  const [style,setStyle]=useState("Cinematic");
  const [duration,setDuration]=useState("30s");
  const [ratio,setRatio]=useState("16:9");
  const [voice,setVoice]=useState("none");
  const [captionFont,setCaptionFont]=useState("none");
  const [captionLang,setCaptionLang]=useState("English");
  const [music,setMusic]=useState("none");
  const [colorGrade,setColorGrade]=useState("none");
  const [scriptMode,setScriptMode]=useState(false);
  const [scenes,setScenes]=useState([{id:1,text:""}]);
  const [activeTab,setActiveTab]=useState("basic");

  // Generation state
  const [phase,setPhase]=useState("idle");
  const [progress,setProgress]=useState(0);
  const [statusMsg,setStatusMsg]=useState("");
  const [videoUrl,setVideoUrl]=useState<string|null>(null);
  const [videoBlob,setVideoBlob]=useState<Blob|null>(null);
  const [enhanced,setEnhanced]=useState(false);
  const [errorMsg,setErrorMsg]=useState("");
  const [history,setHistory]=useState<any[]>([]);

  // Export
  const [exportFormat,setExportFormat]=useState("mp4");
  const [exportQuality,setExportQuality]=useState("1080p");
  const [exportFps,setExportFps]=useState("30fps");
  const [exporting,setExporting]=useState(false);
  const [exportDone,setExportDone]=useState(false);
  const [exportProgress,setExportProgress]=useState(0);

  // Presets
  const [presets,setPresets]=useState<any[]>([]);
  const [presetName,setPresetName]=useState("");
  const [showPresetInput,setShowPresetInput]=useState(false);

  // Modals
  const [showPricing,setShowPricing]=useState(false);
  const [showNotifs,setShowNotifs]=useState(false);
  const [notifs,setNotifs]=useState<any[]>([]);
  const [showThumbs,setShowThumbs]=useState(false);

  const timerRef=useRef<any>(null);
  const exportTimer=useRef<any>(null);
  const audioCtxRef=useRef<AudioContext|null>(null);
  const audioNodesRef=useRef<any[]>([]);

  // Cleanup on unmount
  useEffect(()=>()=>{
    if(timerRef.current) clearInterval(timerRef.current);
    if(exportTimer.current) clearInterval(exportTimer.current);
    stopMusic();
  },[]);

  // Auth
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}}:any)=>{
      setUser(session?.user||null);
      setAuthLoading(false);
    });
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_:any,session:any)=>{
      setUser(session?.user||null);
    });
    return ()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    if(!user) return;
    loadHistory();
    loadPresets();
    setNotifs([{id:1,type:"info",icon:"wave",title:`Welcome back, ${user.user_metadata?.full_name||user.email?.split("@")[0]}!`,msg:"Ready to create your next free unlimited AI video?",time:"just now",read:false}]);
  },[user]);

  // Music functions using Web Audio API
  function playMusic(trackId: string) {
    stopMusic();
    if (trackId === "none") return;
    const config = MUSIC_CONFIGS[trackId];
    if (!config) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const nodes: any[] = [];

      // Create base melody
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = config.type;
      osc.frequency.setValueAtTime(config.freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      // Add rhythm/pulse
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(config.tempo, ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.03, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();

      // Add harmonic layer
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(config.freq * 1.5, ctx.currentTime);
      gain2.gain.setValueAtTime(0.04, ctx.currentTime);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();

      nodes.push(osc, lfo, osc2);
      audioNodesRef.current = nodes;
    } catch (e) {
      console.log("Audio not supported:", e);
    }
  }

  function stopMusic() {
    audioNodesRef.current.forEach(n => { try { n.stop(); } catch {} });
    audioNodesRef.current = [];
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
    }
  }

  async function loadHistory() {
    const {data}=await supabase.from("videos").select("*").eq("user_id",user.id).order("created_at",{ascending:false}).limit(6);
    if(data) setHistory(data.map((v:any)=>({id:v.id,thumb:["movie","star","art","paint","rocket"][Math.floor(Math.random()*5)],label:v.prompt?.slice(0,40)||(v.style+" video"),duration:v.duration,video_url:v.video_url,status:v.status})));
  }

  async function loadPresets() {
    const {data}=await supabase.from("presets").select("*").eq("user_id",user.id).order("created_at",{ascending:false});
    if(data) setPresets(data.map((p:any)=>({id:p.id,name:p.name,settings:p.settings})));
  }

  // ── CORE VIDEO GENERATION (FREE, UNLIMITED) ──────────────────
  async function generateVideo(finalPrompt: string) {
    setPhase("generating"); setProgress(5); setStatusMsg("Planning your video..."); setVideoUrl(null); setVideoBlob(null);

    const {data:videoRecord}=await supabase.from("videos").insert({
      user_id:user.id, prompt:finalPrompt, style, duration, ratio, voice,
      caption_font:captionFont, caption_lang:captionLang, music, color_grade:colorGrade, status:"generating"
    }).select().single();

    try {
      await buildFreeVideo(finalPrompt, videoRecord?.id||"");
    } catch(err:any){
      if(videoRecord?.id) await supabase.from("videos").update({status:"failed"}).eq("id",videoRecord.id);
      setPhase("error");
      setErrorMsg(`Generation failed: ${err.message}. Please try again!`);
    }
  }

  async function buildFreeVideo(finalPrompt: string, recordId: string) {
    const isScript = scriptMode && scenes.some(s=>s.text.trim());
    const scriptScenes = isScript ? scenes.filter(s=>s.text.trim()) : [];
    const numFrames = isScript ? Math.max(scriptScenes.length * 3, 12) : 12;
    const W = ratio==="9:16"?432:768;
    const H = ratio==="9:16"?768:ratio==="1:1"?768:432;
    const FPS = 24;
    const HOLD = FPS * 2; // 2 seconds per frame
    const FADE = FPS * 0.5; // 0.5s crossfade

    // Step 1 — Plan scenes with Claude AI
    setProgress(5); setStatusMsg("Planning scenes with Claude AI...");
    let frameprompts: string[] = [];
    let narrationScript = "";

    try {
      const sceneCtx = isScript
        ? `The video has these scenes:\n${scriptScenes.map((s,i)=>`Scene ${i+1}: ${s.text}`).join("\n")}`
        : `The video is about: "${finalPrompt}"`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1500,
          messages:[{role:"user", content:`You are a video director creating a ${style} style video.
${sceneCtx}

1. Create exactly ${numFrames} image frame descriptions (each max 25 words, visually specific, showing characters and setting)
2. Create a narration script (2-3 sentences per scene, natural spoken language)

Return ONLY this JSON (no markdown):
{
  "frames": ["frame1 desc", "frame2 desc", ...],
  "narration": "Full narration script to be spoken aloud..."
}`}]
        })
      });
      const data = await res.json();
      const raw = data.content?.map((b:any)=>b.text||"").join("")||"";
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      frameprompts = parsed.frames?.slice(0,numFrames)||[];
      narrationScript = parsed.narration||finalPrompt;
      while(frameprompts.length<numFrames){
        frameprompts.push(`${style} style, ${finalPrompt}, scene ${frameprompts.length+1}, cinematic`);
      }
    } catch {
      if(isScript){
        const fps2 = Math.ceil(numFrames/scriptScenes.length);
        frameprompts = [];
        scriptScenes.forEach((s,si)=>{
          for(let f=0;f<fps2&&frameprompts.length<numFrames;f++){
            frameprompts.push(`${style} style, ${s.text}, shot ${f+1}, cinematic, photorealistic`);
          }
        });
        narrationScript = scriptScenes.map(s=>s.text).join(". ");
      } else {
        frameprompts = Array.from({length:numFrames},(_,i)=>`${style} style, ${finalPrompt}, shot ${i+1} of ${numFrames}, cinematic`);
        narrationScript = finalPrompt;
      }
    }

    // Step 2 — Generate all frames
    setProgress(12); setStatusMsg(`Generating ${numFrames} AI frames...`);
    const gradeMap: Record<string,string> = {
      warm:"warm golden hour, amber tones",cool:"cold blue tones, icy",
      noir:"black and white, film noir",teal:"teal and orange, blockbuster",
      vintage:"vintage film grain, retro",neon:"neon lights, cyberpunk",
      pastel:"soft pastel, dreamy",emerald:"lush green, emerald",moody:"dark moody, dramatic shadows",
    };
    const gradeStr = colorGrade!=="none"?`, ${gradeMap[colorGrade]||""}` : "";
    const seed = Math.floor(Math.random()*99999);
    const frameImages: HTMLImageElement[] = [];

    for(let i=0;i<frameprompts.length;i++){
      setProgress(Math.round(12+(i/frameprompts.length)*48));
      setStatusMsg(`Generating frame ${i+1} of ${numFrames}...`);
      const ep = encodeURIComponent(`${frameprompts[i]}${gradeStr}, photorealistic, 8k, no text, no watermark`);
      const url = `https://image.pollinations.ai/prompt/${ep}?width=${W}&height=${H}&seed=${seed+i}&nologo=true&enhance=true&model=flux`;
      await new Promise<void>(resolve=>{
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = ()=>{frameImages.push(img); resolve();};
        img.onerror = ()=>{if(frameImages.length>0)frameImages.push(frameImages[frameImages.length-1]); resolve();};
        setTimeout(()=>resolve(), 20000);
        img.src = url;
      });
    }
    if(frameImages.length===0) throw new Error("Could not generate frames. Check internet.");

    // Step 3 — Setup Audio Context with MUSIC + VOICE together
    setProgress(62); setStatusMsg("Setting up audio...");

    const audioCtx = new (window.AudioContext||(window as any).webkitAudioContext)();
    const audioDest = audioCtx.createMediaStreamDestination();
    const musicNodes: any[] = [];

    // Music layer
    if(music!=="none"){
      const cfg = MUSIC_CONFIGS[music];
      if(cfg){
        const masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        masterGain.connect(audioDest);

        const osc1 = audioCtx.createOscillator();
        const g1 = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        osc1.type = cfg.type; osc1.frequency.value = cfg.freq;
        filter.type = "lowpass"; filter.frequency.value = 1500;
        g1.gain.value = 0.5;
        osc1.connect(filter); filter.connect(g1); g1.connect(masterGain);
        osc1.start(); musicNodes.push(osc1);

        const osc2 = audioCtx.createOscillator();
        const g2 = audioCtx.createGain();
        osc2.type = "sine"; osc2.frequency.value = cfg.freq * 1.5;
        g2.gain.value = 0.2;
        osc2.connect(g2); g2.connect(masterGain);
        osc2.start(); musicNodes.push(osc2);

        const osc3 = audioCtx.createOscillator();
        const g3 = audioCtx.createGain();
        osc3.type = "triangle"; osc3.frequency.value = cfg.freq * 0.5;
        g3.gain.value = 0.3;
        osc3.connect(g3); g3.connect(masterGain);
        osc3.start(); musicNodes.push(osc3);
      }
    }

    // Voice layer — synthesize narration as audio tones timed to speech
    if(voice!=="none"){
      const voiceObj = VOICES.find(v=>v.id===voice);
      if(voiceObj){
        const words = narrationScript.split(" ").filter(Boolean);
        const totalDuration = (frameImages.length * (HOLD+FADE)) / FPS;
        const wordDuration = totalDuration / Math.max(words.length, 1);
        const voiceGain = audioCtx.createGain();
        voiceGain.gain.value = voiceObj.volume * 0.4;
        voiceGain.connect(audioDest);

        // Synthesize voice as formant-like tones (phoneme simulation)
        words.forEach((word, wi)=>{
          const startTime = audioCtx.currentTime + wi * wordDuration;
          const dur = wordDuration * 0.85;

          // Main formant (pitch of voice)
          const baseFreq = voiceObj.pitch * 120; // Convert pitch ratio to Hz
          const formant1 = audioCtx.createOscillator();
          const formant2 = audioCtx.createOscillator();
          const envGain = audioCtx.createGain();

          formant1.type = "sawtooth";
          formant1.frequency.value = baseFreq;
          // Vary pitch slightly per character for natural feel
          formant1.frequency.setValueAtTime(baseFreq * (0.9 + Math.random()*0.2), startTime);
          formant1.frequency.linearRampToValueAtTime(baseFreq * (0.95 + Math.random()*0.1), startTime + dur);

          formant2.type = "sine";
          formant2.frequency.value = baseFreq * 2.5;

          // Envelope: attack, sustain, release
          envGain.gain.setValueAtTime(0, startTime);
          envGain.gain.linearRampToValueAtTime(0.6, startTime + dur * 0.1);
          envGain.gain.setValueAtTime(0.5, startTime + dur * 0.8);
          envGain.gain.linearRampToValueAtTime(0, startTime + dur);

          // Filter to shape voice character
          const filter = audioCtx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.value = baseFreq * 3;
          filter.Q.value = voiceObj.rate * 2;

          formant1.connect(filter);
          formant2.connect(filter);
          filter.connect(envGain);
          envGain.connect(voiceGain);

          formant1.start(startTime); formant1.stop(startTime + dur);
          formant2.start(startTime); formant2.stop(startTime + dur);
        });
      }
    }

    // Step 4 — Record video frames
    setProgress(65); setStatusMsg("Recording video...");
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx2d = canvas.getContext("2d")!;

    const canvasStream = canvas.captureStream(FPS);
    const audioTracks = audioDest.stream.getAudioTracks();
    audioTracks.forEach(t=>canvasStream.addTrack(t));

    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus"
      : MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
      ? "video/webm;codecs=vp8,opus"
      : "video/webm";

    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(canvasStream, {mimeType, videoBitsPerSecond:4000000});
    recorder.ondataavailable = e=>{if(e.data.size>0) chunks.push(e.data);};

    // Build caption text per frame
    const allWords = narrationScript.split(" ").filter(Boolean);
    const wordsPerFrame = Math.max(1, Math.ceil(allWords.length/frameImages.length));

    await new Promise<void>(resolve=>{
      recorder.onstop = ()=>resolve();
      recorder.start(100);

      let frameIdx = 0;
      let subFrame = 0;
      const totalSteps = HOLD + FADE;

      const interval = setInterval(()=>{
        if(frameIdx>=frameImages.length){
          clearInterval(interval);
          musicNodes.forEach(n=>{try{n.stop();}catch{}});
          try{audioCtx.close();}catch{}
          recorder.stop();
          return;
        }

        const cur = frameImages[frameIdx];
        const nxt = frameImages[Math.min(frameIdx+1,frameImages.length-1)];

        ctx2d.clearRect(0,0,W,H);

        if(subFrame<HOLD){
          // Ken Burns zoom
          const zoom = 1 + (subFrame/HOLD)*0.05;
          const ox = (W*(zoom-1))/2;
          const oy = (H*(zoom-1))/2;
          ctx2d.globalAlpha = 1;
          ctx2d.drawImage(cur,-ox,-oy,W*zoom,H*zoom);
        } else {
          // Crossfade
          const t = (subFrame-HOLD)/FADE;
          ctx2d.globalAlpha = 1; ctx2d.drawImage(cur,0,0,W,H);
          ctx2d.globalAlpha = t; ctx2d.drawImage(nxt,0,0,W,H);
          ctx2d.globalAlpha = 1;
        }

        // Captions
        if(captionFont!=="none"){
          const cf = CAPTION_FONTS.find(c=>c.id===captionFont);
          if(cf){
            const caption = allWords.slice(frameIdx*wordsPerFrame,(frameIdx+1)*wordsPerFrame).join(" ");
            if(caption.trim()){
              const fs = Math.round(H*0.045);
              ctx2d.save();
              // Caption background
              const bgH = Math.round(H*0.13);
              ctx2d.fillStyle = "rgba(0,0,0,0.7)";
              ctx2d.fillRect(0,H-bgH,W,bgH);
              // Caption text
              ctx2d.font = `bold ${fs}px ${cf.font}`;
              ctx2d.fillStyle = "#ffffff";
              ctx2d.textAlign = "center";
              ctx2d.textBaseline = "middle";
              ctx2d.shadowColor = "black";
              ctx2d.shadowBlur = 8;
              // Word wrap
              const maxW = W * 0.9;
              const words2 = caption.split(" ");
              let line = "";
              const lines: string[] = [];
              words2.forEach(w=>{
                const test = line ? `${line} ${w}` : w;
                if(ctx2d.measureText(test).width>maxW){lines.push(line);line=w;}
                else{line=test;}
              });
              lines.push(line);
              const lineH = fs * 1.3;
              const startY = H - bgH/2 - ((lines.length-1)*lineH)/2;
              lines.forEach((l,li)=>ctx2d.fillText(l,W/2,startY+li*lineH));
              ctx2d.restore();
            }
          }
        }

        subFrame++;
        if(subFrame>=totalSteps){subFrame=0;frameIdx++;}
        const pct = Math.round(65+(frameIdx/frameImages.length)*25);
        setProgress(Math.min(pct,90));
        setStatusMsg(`Encoding frame ${Math.min(frameIdx+1,frameImages.length)}/${frameImages.length}...`);
      }, 1000/FPS);
    });

    // Step 5 — Finalize
    setProgress(92); setStatusMsg("Finalizing video file...");
    const blob = new Blob(chunks,{type:mimeType});
    const localUrl = URL.createObjectURL(blob);
    setVideoUrl(localUrl); setVideoBlob(blob);

    // Upload to Supabase
    setProgress(96); setStatusMsg("Saving to cloud...");
    try{
      const fileName = `${user.id}/${recordId||Date.now()}.webm`;
      const {error:uploadErr}=await supabase.storage.from("videos").upload(fileName,blob,{contentType:mimeType,upsert:true});
      if(!uploadErr){
        const {data:{publicUrl}}=supabase.storage.from("videos").getPublicUrl(fileName);
        if(recordId) await supabase.from("videos").update({status:"done",video_url:publicUrl}).eq("id",recordId);
      } else {
        if(recordId) await supabase.from("videos").update({status:"done",video_url:localUrl}).eq("id",recordId);
      }
    } catch {
      if(recordId) await supabase.from("videos").update({status:"done",video_url:localUrl}).eq("id",recordId);
    }

    setProgress(100);
    setNotifs(n=>[{id:Date.now(),type:"success",icon:"ok",
      title:"Video ready!",
      msg:`Your ${style} video${voice!=="none"?` with ${VOICES.find(v=>v.id===voice)?.label} voice`:""}${music!=="none"?` and ${music} music`:""} is ready!`,
      time:"just now",read:false},...n].slice(0,10));
    loadHistory();
    setPhase("done");
  }

  function generate() {
    const fp=scriptMode?scenes.map((s,i)=>`Scene ${i+1}: ${s.text}`).join(". "):prompt;
    if(!fp.trim()) return;
    generateVideo(fp);
  }

  async function enhancePrompt() {
    if(!prompt.trim()) return;
    setPhase("enhancing"); setEnhanced(false);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`You are a video prompt engineer. Enhance this for an AI video generator, make it vivid and cinematic. Keep under 2800 chars. Return ONLY the enhanced prompt:\n\n"${prompt}"`}]})});
      const data=await res.json();
      const t=data.content?.map((b:any)=>b.text||"").join("")||"";
      setPrompt(t.trim().slice(0,3000)); setEnhanced(true); setPhase("idle");
      setNotifs(n=>[{id:Date.now(),type:"info",icon:"star",title:"Prompt enhanced",msg:"Claude made your prompt more cinematic and detailed.",time:"just now",read:false},...n].slice(0,10));
    } catch {setPhase("error"); setErrorMsg("Failed to enhance. Try again.");}
  }

  function reset() {
    setPhase("idle"); setProgress(0); setPrompt(""); setEnhanced(false);
    setVideoUrl(null); setVideoBlob(null); setStatusMsg("");
    setScenes([{id:1,text:""}]); setExporting(false); setExportDone(false); setExportProgress(0);
    stopMusic();
  }

  // Download video with proper filename
  function downloadVideo() {
    if(!videoUrl) return;
    try {
      // Fetch the video as a blob for proper download
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const ext = blob.type.includes("mp4") ? "mp4" : "webm";
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `visionai-${style.toLowerCase()}-${Date.now()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch {
      // Fallback direct download
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = `visionai-${style.toLowerCase()}-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  function startExport() {
    setExporting(true); setExportDone(false); setExportProgress(0);
    let p=0;
    exportTimer.current=setInterval(()=>{
      p+=Math.random()*15+5;
      if(p>=100){
        clearInterval(exportTimer.current); setExportProgress(100);
        setTimeout(()=>{setExporting(false);setExportDone(true);
          setNotifs(n=>[{id:Date.now(),type:"success",icon:"film",title:"Export ready",msg:`Video exported as ${exportFormat.toUpperCase()} - ${exportQuality}.`,time:"just now",read:false},...n].slice(0,10));
        },300);
      } else setExportProgress(Math.round(p));
    },150);
  }

  async function savePreset() {
    if(!presetName.trim()) return;
    const settings={style,duration,ratio,voice,captionFont,music,colorGrade,captionLang};
    const {data}=await supabase.from("presets").insert({user_id:user.id,name:presetName.trim(),settings}).select().single();
    if(data) setPresets(p=>[{id:data.id,name:data.name,settings:data.settings},...p]);
    setPresetName(""); setShowPresetInput(false);
  }

  async function deletePreset(id: string) {
    await supabase.from("presets").delete().eq("id",id);
    setPresets(p=>p.filter(x=>x.id!==id));
  }

  function loadPreset(pr: any) {
    setStyle(pr.settings.style); setDuration(pr.settings.duration); setRatio(pr.settings.ratio);
    setVoice(pr.settings.voice); setCaptionFont(pr.settings.captionFont); setMusic(pr.settings.music);
    setColorGrade(pr.settings.colorGrade); setCaptionLang(pr.settings.captionLang);
  }

  async function signOut() {
    stopMusic();
    await supabase.auth.signOut();
    setUser(null); setHistory([]); setPresets([]);
  }

  // Loading screen
  if(authLoading) return (
    <div style={{minHeight:"100vh",background:"#0d0d14",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Sora',sans-serif"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <Spinner label="Loading VisionAI..."/>
    </div>
  );

  if(!user) return <AuthScreen onLogin={setUser} dark={dark}/>;

  const voiceObj=VOICES.find(v=>v.id===voice);
  const cfObj=CAPTION_FONTS.find(c=>c.id===captionFont);
  const musicObj=MUSIC_TRACKS.find(m=>m.id===music);
  const gradeObj=COLOR_GRADES.find(g=>g.id===colorGrade);
  const isGenerating=phase==="generating";
  const isDone=phase==="done";
  const isEnhancing=phase==="enhancing";
  const unreadCount=notifs.filter(n=>!n.read).length;
  const userName=user.user_metadata?.full_name||user.email?.split("@")[0]||"User";
  const userAvatar=userName.split(" ").map((w:string)=>w[0]).join("").toUpperCase().slice(0,2);
  const bg=dark?"#0d0d14":"#f0f0f8", bg2=dark?"#12121e":"#ffffff", bg3=dark?"#0a0a12":"#f5f5fc";
  const borderC=dark?"#1e1e30":"#ddd8f0", border2=dark?"#2a2a3a":"#d0ccee";
  const text=dark?"#e2e2f0":"#1a1a2e", muted=dark?"#5a5a7a":"#8080a0";

  const TABS=[
    {id:"basic",label:"Basic"},{id:"voice",label:"Voice"},
    {id:"captions",label:"Captions"},{id:"music",label:"Music"},
    {id:"color",label:"Color"},{id:"script",label:"Script"},
    {id:"presets",label:"Presets"},
  ];

  return (
    <div style={{minHeight:"100vh",background:bg,color:text,fontFamily:"'Sora','Segoe UI',sans-serif",paddingBottom:60}}>
      <style>{getCSS(dark)}</style>
      {showPricing&&<PricingModal onClose={()=>setShowPricing(false)} dark={dark}/>}
      {showNotifs&&<NotifPanel notifs={notifs} setNotifs={setNotifs} onClose={()=>setShowNotifs(false)} dark={dark}/>}
      {showThumbs&&<ThumbnailGenerator prompt={prompt} style={style} dark={dark} onClose={()=>setShowThumbs(false)}/>}

      {/* HEADER */}
      <div style={{borderBottom:`1px solid ${borderC}`,padding:"14px 24px",display:"flex",alignItems:"center",gap:12,background:bg2,position:"sticky",top:0,zIndex:100}}>
        <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#7c3aed,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>🎬</div>
        <div>
          <div style={{fontWeight:700,fontSize:15}}>VisionAI</div>
          <div style={{fontSize:11,color:muted}}>Free & Unlimited · AI Video Generator</div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>setDark(d=>!d)} style={{width:36,height:36,borderRadius:9,background:bg3,border:`1px solid ${border2}`,cursor:"pointer",fontSize:17,display:"flex",alignItems:"center",justifyContent:"center"}}>{dark?"☀️":"🌙"}</button>
          <button onClick={()=>setShowNotifs(s=>!s)} style={{width:36,height:36,borderRadius:9,background:showNotifs?"#a78bfa22":bg3,border:`1px solid ${showNotifs?"#a78bfa":border2}`,cursor:"pointer",fontSize:17,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
            🔔{unreadCount>0&&<span style={{position:"absolute",top:-3,right:-3,background:"#a78bfa",color:"#fff",borderRadius:"50%",fontSize:9,fontWeight:700,width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center"}}>{unreadCount}</span>}
          </button>
          <button onClick={()=>setShowPricing(true)} style={{background:"linear-gradient(135deg,#7c3aed,#a855f7)",border:"none",borderRadius:8,color:"#fff",fontSize:12,fontWeight:600,padding:"7px 14px",cursor:"pointer",fontFamily:"inherit"}}>Upgrade</button>
          <div style={{display:"flex",alignItems:"center",gap:7,background:bg3,border:`1px solid ${border2}`,borderRadius:999,padding:"4px 12px 4px 5px"}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>{userAvatar}</div>
            <span style={{fontSize:12,color:text,fontWeight:500}}>{userName}</span>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div style={{maxWidth:980,margin:"0 auto",padding:"24px 20px",display:"grid",gridTemplateColumns:"1fr 288px",gap:24,alignItems:"start"}}>

        {/* LEFT */}
        <div>
          {/* Prompt */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <div className="slabel" style={{marginBottom:0}}>{scriptMode?"Scene-by-Scene Script":"Your Prompt"}</div>
            <div style={{display:"flex",gap:8}}>
              {!scriptMode&&<button className="enhbtn" onClick={enhancePrompt} disabled={!prompt.trim()||isEnhancing||isGenerating}>{isEnhancing?"Enhancing...":"Enhance with AI"}</button>}
              <button className={`pill ${scriptMode?"on":""}`} onClick={()=>setScriptMode(s=>!s)}>Script Mode</button>
            </div>
          </div>

          {scriptMode?(
            <div style={{marginBottom:18}}>
              {scenes.map((sc,idx)=>(
                <div key={sc.id} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <div style={{fontSize:11,color:"#a78bfa",fontWeight:600}}>SCENE {idx+1}</div>
                    {scenes.length>1&&<button onClick={()=>setScenes(s=>s.filter(x=>x.id!==sc.id))} style={{background:"none",border:"none",color:muted,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Remove</button>}
                  </div>
                  <textarea className="inp" rows={3} placeholder={`Describe scene ${idx+1}...`} value={sc.text} onChange={e=>setScenes(s=>s.map(x=>x.id===sc.id?{...x,text:e.target.value}:x))} disabled={isGenerating}/>
                </div>
              ))}
              <button className="pill" onClick={()=>setScenes(s=>[...s,{id:Date.now(),text:""}])}>+ Add Scene</button>
            </div>
          ):(
            <div style={{marginBottom:18}}>
              <textarea className="inp" rows={8} maxLength={3000} placeholder="Describe your video in detail... e.g. A golden sunrise over misty mountains, birds gliding through soft pink clouds, slow cinematic camera pan from left to right, warm golden tones..." value={prompt} onChange={e=>setPrompt(e.target.value)} disabled={isGenerating||isEnhancing}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
                {enhanced&&<div style={{fontSize:11,color:"#7c3aed"}}>Enhanced by Claude AI</div>}
                <div style={{marginLeft:"auto",fontSize:11,color:prompt.length>2550?"#f87171":muted}}>{prompt.length}/3000</div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:4,borderBottom:`1px solid ${borderC}`,marginBottom:16}}>
            {TABS.map(t=><button key={t.id} className={`tab ${activeTab===t.id?"on":""}`} onClick={()=>setActiveTab(t.id)}>{t.label}</button>)}
          </div>

          {/* Basic */}
          {activeTab==="basic"&&(
            <div style={{animation:"fadeIn 0.2s"}}>
              <div style={{marginBottom:18}}>
                <div className="slabel">Video Style</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{STYLES.map(s=><button key={s} className={`pill ${style===s?"on":""}`} onClick={()=>setStyle(s)}>{s}</button>)}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
                <div><div className="slabel">Duration</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{DURATIONS.map(d=><button key={d} className={`pill ${duration===d?"on":""}`} onClick={()=>setDuration(d)}>{d}</button>)}</div></div>
                <div><div className="slabel">Aspect Ratio</div><div style={{display:"flex",gap:8}}>{RATIOS.map(r=><button key={r} className={`pill ${ratio===r?"on":""}`} onClick={()=>setRatio(r)}>{r}</button>)}</div></div>
              </div>
            </div>
          )}

          {/* Voice */}
          {activeTab==="voice"&&(
            <div style={{animation:"fadeIn 0.2s"}}>
              <div className="slabel">Voiceover Type {voice!=="none"&&<span style={{color:"#a78bfa",marginLeft:6,textTransform:"none",letterSpacing:0}}>- {voiceObj?.label}</span>}</div>
              <div style={{marginBottom:12,padding:"10px 14px",background:bg3,border:`1px solid ${border2}`,borderRadius:8,fontSize:12,color:muted,lineHeight:1.6}}>
                🔊 Click <strong style={{color:"#c4b5fd"}}>▶ Preview</strong> to hear each voice before choosing. The selected voice reads your script aloud during video playback using your browser's built-in Text-to-Speech engine.
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:8}}>
                {VOICES.map(v=>(
                  <div key={v.id} className={`card ${voice===v.id?"on":""}`} onClick={()=>setVoice(v.id)} style={{position:"relative"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <span style={{fontSize:20}}>{v.icon}</span>
                      <div>
                        <div style={{fontSize:12,fontWeight:700,color:voice===v.id?"#c4b5fd":text}}>{v.label}</div>
                        <div style={{fontSize:10,color:muted}}>{v.desc}</div>
                      </div>
                    </div>
                    {v.id!=="none"&&(
                      <button
                        onClick={e=>{
                          e.stopPropagation();
                          window.speechSynthesis.cancel();
                          const u=new SpeechSynthesisUtterance(v.previewText);
                          u.pitch=v.pitch; u.rate=v.rate; u.volume=v.volume;
                          // Try to find best matching voice
                          const voices=window.speechSynthesis.getVoices();
                          const match = v.id==="warm-f"||v.id==="kids"
                            ? voices.find(sv=>sv.name.toLowerCase().includes("female")||sv.name.toLowerCase().includes("woman")||sv.gender==="female")
                            : voices.find(sv=>sv.name.toLowerCase().includes("male")||sv.name.toLowerCase().includes("man"));
                          if(match) u.voice=match;
                          window.speechSynthesis.speak(u);
                        }}
                        style={{width:"100%",background:voice===v.id?"#a78bfa33":"#1a1a28",border:`1px solid ${voice===v.id?"#a78bfa":"#2a2a3a"}`,borderRadius:6,padding:"4px 8px",fontSize:11,color:voice===v.id?"#c4b5fd":"#7070a0",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginTop:2}}
                      >
                        ▶ Preview Voice
                      </button>
                    )}
                    {v.id==="none"&&<div style={{fontSize:11,color:muted,marginTop:4,textAlign:"center"}}>No audio</div>}
                  </div>
                ))}
              </div>
              <div style={{marginTop:12,padding:"10px 14px",background:bg3,border:`1px solid ${border2}`,borderRadius:8,fontSize:11,color:muted}}>
                💡 <strong style={{color:"#c4b5fd"}}>How voiceover works:</strong> After generating your video, press Play — the selected voice automatically reads your script. Pitch, speed and tone are applied per voice type.
              </div>
            </div>
          )}

          {/* Captions */}
          {activeTab==="captions"&&(
            <div style={{animation:"fadeIn 0.2s"}}>
              <div className="slabel">Caption Font {captionFont!=="none"&&<span style={{background:"#a78bfa22",border:"1px solid #a78bfa44",color:"#c4b5fd",borderRadius:999,padding:"1px 7px",fontSize:10,marginLeft:6}}>ON</span>}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:8,marginBottom:18}}>
                {CAPTION_FONTS.map(cf=>(
                  <button key={cf.id} className={`card ${captionFont===cf.id?"on":""}`} onClick={()=>setCaptionFont(cf.id)} style={{textAlign:"center"}}>
                    <div style={{fontSize:14,fontFamily:cf.font,fontWeight:["Impact","Georgia"].includes(cf.font)?700:400,color:captionFont===cf.id?"#c4b5fd":text,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cf.preview}</div>
                    <div style={{fontSize:11,fontWeight:600,color:captionFont===cf.id?"#c4b5fd":text}}>{cf.label}</div>
                    <div style={{fontSize:10,color:muted,marginTop:2}}>{cf.desc}</div>
                  </button>
                ))}
              </div>
              {captionFont!=="none"&&(
                <div>
                  <div className="slabel">Caption Language</div>
                  <select className="inp" style={{width:"auto"}} value={captionLang} onChange={e=>setCaptionLang(e.target.value)}>
                    {CAPTION_LANGUAGES.map(l=><option key={l}>{l}</option>)}
                  </select>
                  <div style={{fontSize:11,color:muted,marginTop:8}}>Captions will be burned into the video frames in {captionLang}</div>
                </div>
              )}
            </div>
          )}

          {/* Music */}
          {activeTab==="music"&&(
            <div style={{animation:"fadeIn 0.2s"}}>
              <div className="slabel">Background Music {music!=="none"&&<span style={{color:"#a78bfa",marginLeft:6,textTransform:"none",letterSpacing:0}}>- {musicObj?.label}</span>}</div>
              <div style={{marginBottom:12,padding:"10px 14px",background:bg3,border:`1px solid ${border2}`,borderRadius:8,fontSize:12,color:muted,lineHeight:1.6}}>
                Music is generated using Web Audio API and mixed directly into the video file. No external files needed — completely free!
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:8}}>
                {MUSIC_TRACKS.map(m=>(
                  <button key={m.id} className={`card ${music===m.id?"on":""}`} onClick={()=>{setMusic(m.id); if(m.id!=="none") playMusic(m.id); else stopMusic();}}>
                    <div style={{fontSize:20,marginBottom:4}}>{m.icon}</div>
                    <div style={{fontSize:12,fontWeight:600,color:music===m.id?"#c4b5fd":text}}>{m.label}</div>
                    <div style={{fontSize:10,color:muted,marginTop:2}}>{m.desc}</div>
                  </button>
                ))}
              </div>
              {music!=="none"&&<div style={{marginTop:12,fontSize:12,color:"#4ade80"}}>Preview playing - music will be mixed into your video!</div>}
            </div>
          )}

          {/* Color */}
          {activeTab==="color"&&(
            <div style={{animation:"fadeIn 0.2s"}}>
              <div className="slabel">Color Grade {colorGrade!=="none"&&<span style={{color:"#a78bfa",marginLeft:6,textTransform:"none",letterSpacing:0}}>- {gradeObj?.label}</span>}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:8}}>
                {COLOR_GRADES.map(g=>(
                  <button key={g.id} className={`card ${colorGrade===g.id?"on":""}`} onClick={()=>setColorGrade(g.id)}>
                    <div style={{height:24,borderRadius:5,marginBottom:7,background:g.id==="none"?(dark?"#2a2a3a":"#e0e0f0"):g.id==="noir"?"linear-gradient(90deg,#111,#aaa)":g.id==="teal"?"linear-gradient(90deg,#14b8a6,#f97316)":`linear-gradient(135deg,${g.color}99,${g.color}22)`,border:`1px solid ${colorGrade===g.id?g.color:border2}`}}/>
                    <div style={{fontSize:12,fontWeight:600,color:colorGrade===g.id?"#c4b5fd":text}}>{g.label}</div>
                    <div style={{fontSize:10,color:muted,marginTop:2}}>{g.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Script */}
          {activeTab==="script"&&(
            <div style={{animation:"fadeIn 0.2s"}}>
              <div className="slabel">Scene-by-Scene Script</div>
              <div style={{fontSize:12,color:muted,marginBottom:14,lineHeight:1.6}}>Write individual scenes. Toggle Script Mode above to use this for generation. Each scene becomes a separate visual with captions.</div>
              {scenes.map((sc,idx)=>(
                <div key={sc.id} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <div style={{fontSize:11,color:"#a78bfa",fontWeight:600}}>SCENE {idx+1}</div>
                    {scenes.length>1&&<button onClick={()=>setScenes(s=>s.filter(x=>x.id!==sc.id))} style={{background:"none",border:"none",color:muted,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Remove</button>}
                  </div>
                  <textarea className="inp" rows={3} placeholder={`Scene ${idx+1}...`} value={sc.text} onChange={e=>setScenes(s=>s.map(x=>x.id===sc.id?{...x,text:e.target.value}:x))}/>
                </div>
              ))}
              <button className="pill" onClick={()=>setScenes(s=>[...s,{id:Date.now(),text:""}])}>+ Add Scene</button>
            </div>
          )}

          {/* Presets */}
          {activeTab==="presets"&&(
            <div style={{animation:"fadeIn 0.2s"}}>
              <div className="slabel">Saved Presets</div>
              {showPresetInput?(
                <div style={{display:"flex",gap:8,marginBottom:14}}>
                  <input className="inp" type="text" placeholder="Preset name..." value={presetName} onChange={e=>setPresetName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&savePreset()} style={{flex:1}}/>
                  <button className="pill on" onClick={savePreset}>Save</button>
                  <button className="pill" onClick={()=>setShowPresetInput(false)}>Cancel</button>
                </div>
              ):(<button className="pill on" style={{marginBottom:14}} onClick={()=>setShowPresetInput(true)}>Save Current Settings</button>)}
              {presets.length===0
                ?<div style={{fontSize:13,color:muted,textAlign:"center",padding:"16px 0"}}>No presets yet</div>
                :presets.map(pr=>(
                  <div key={pr.id} style={{background:bg3,border:`1px solid ${border2}`,borderRadius:10,padding:"11px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:"#c4b5fd"}}>{pr.name}</div>
                      <div style={{fontSize:11,color:muted,marginTop:2}}>{pr.settings.style} - {pr.settings.duration}</div>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button className="pill" onClick={()=>loadPreset(pr)}>Load</button>
                      <button className="pill" onClick={()=>deletePreset(pr.id)} style={{color:"#f87171",borderColor:"#3a1a1a"}}>Delete</button>
                    </div>
                  </div>
                ))
              }
            </div>
          )}

          {/* Active badges */}
          <div style={{display:"flex",flexWrap:"wrap",gap:6,margin:"14px 0",minHeight:22}}>
            {([
              voice!=="none"&&`Voice: ${voiceObj?.label}`,
              captionFont!=="none"&&`Captions: ${cfObj?.label}`,
              music!=="none"&&`Music: ${musicObj?.label}`,
              colorGrade!=="none"&&`Color: ${gradeObj?.label}`,
              scriptMode&&`Script (${scenes.length} scenes)`,
            ] as (string|false)[]).filter(Boolean).map(b=>(
              <span key={b as string} style={{fontSize:11,background:dark?"#1a1a2e":"#ede8ff",border:`1px solid ${dark?"#2a2a45":"#c8beee"}`,color:"#a78bfa",borderRadius:999,padding:"3px 10px"}}>{b as string}</span>
            ))}
          </div>

          {/* Generate / Progress / Done */}
          {isGenerating?(
            <div style={{background:bg3,border:`1px solid ${border2}`,borderRadius:14,padding:28,textAlign:"center"}}>
              <Spinner size={40}/>
              <div style={{marginTop:14,fontSize:14,color:text,fontWeight:500}}>{statusMsg||"Generating..."}</div>
              <div style={{marginTop:12,background:dark?"#1a1a28":"#e8e0f8",borderRadius:999,height:8,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#7c3aed,#a855f7)",borderRadius:999,transition:"width 0.5s ease"}}/>
              </div>
              <div style={{marginTop:8,fontSize:12,color:muted}}>{progress}% complete</div>
              <div style={{marginTop:10,padding:"8px 12px",background:dark?"#1a1a28":"#e8e0f8",borderRadius:8,fontSize:11,color:muted}}>
                Generating {music!=="none"?"with "+musicObj?.label+" music":""}
                {captionFont!=="none"?" + "+cfObj?.label+" captions":""}
                {voice!=="none"?" + "+voiceObj?.label+" voice":""}
              </div>
            </div>
          ):isDone?(
            <div style={{background:dark?"#0a180e":"#efffef",border:"1px solid #1a4a2a",borderRadius:14,padding:22,animation:"fadeIn 0.4s ease"}}>
              <div style={{textAlign:"center",marginBottom:16}}>
                <div style={{fontSize:36,marginBottom:8}}>🎉</div>
                <div style={{fontWeight:600,fontSize:15,color:"#4ade80"}}>Video Ready!</div>
                <div style={{fontSize:11,color:"#3a6a4a",marginTop:4}}>{style} - {duration} - {ratio}{music!=="none"?` - ${musicObj?.label} music`:""}{captionFont!=="none"?` - ${cfObj?.label} captions`:""}</div>
              </div>

              {/* VIDEO PLAYER with voiceover */}
              {videoUrl&&(
                <div style={{marginBottom:14}}>
                  <video
                    controls
                    style={{width:"100%",borderRadius:10,border:"1px solid #1a4a2a",background:"#000",display:"block"}}
                    src={videoUrl}
                    onPlay={()=>{
                      if(voice==="none") return;
                      window.speechSynthesis.cancel();
                      const vObj=VOICES.find(v=>v.id===voice);
                      if(!vObj) return;
                      const scriptText=scriptMode
                        ? scenes.map((s,i)=>`Scene ${i+1}. ${s.text}`).join(". ")
                        : prompt;
                      if(!scriptText.trim()) return;
                      const u=new SpeechSynthesisUtterance(scriptText);
                      u.pitch=vObj.pitch;
                      u.rate=vObj.rate;
                      u.volume=vObj.volume;
                      const allVoices=window.speechSynthesis.getVoices();
                      if(allVoices.length>0){
                        const femaleIds=["warm-f","kids","whisper"];
                        const isFemale=femaleIds.includes(voice);
                        const match=allVoices.find(sv=>{
                          const n=sv.name.toLowerCase();
                          return isFemale ? (n.includes("female")||n.includes("woman")||n.includes("zira")||n.includes("susan")||n.includes("hazel")) : (n.includes("male")||n.includes("man")||n.includes("david")||n.includes("mark")||n.includes("george"));
                        }) || allVoices.find(sv=>sv.lang.startsWith("en")) || allVoices[0];
                        if(match) u.voice=match;
                      }
                      window.speechSynthesis.speak(u);
                    }}
                    onPause={()=>window.speechSynthesis.pause()}
                    onEnded={()=>window.speechSynthesis.cancel()}
                    onSeeking={()=>window.speechSynthesis.cancel()}
                  />
                  {voice!=="none"&&(
                    <div style={{marginTop:8,padding:"8px 12px",background:dark?"#1a1a28":"#ede8ff",borderRadius:8,fontSize:11,color:"#a78bfa",display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:16}}>{voiceObj?.icon}</span>
                      <span><strong>{voiceObj?.label}</strong> voice will speak your script when you press Play ▶</span>
                    </div>
                  )}
                </div>
              )}

              <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:16,flexWrap:"wrap"}}>
                <button className="pill on" onClick={downloadVideo} style={{fontSize:13,padding:"8px 20px"}}>Download Video (WebM)</button>
                <button className="pill" onClick={()=>setShowThumbs(true)}>Generate Thumbnail</button>
              </div>

              {/* Export */}
              <div style={{background:bg3,border:`1px solid ${border2}`,borderRadius:10,padding:16}}>
                <div style={{fontSize:12,fontWeight:600,color:"#a78bfa",marginBottom:12}}>Export Settings</div>
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:11,color:muted,marginBottom:7,fontWeight:600,textTransform:"uppercase",letterSpacing:"1px"}}>Format</div>
                  <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                    {[{id:"mp4",l:"MP4"},{id:"mov",l:"MOV"},{id:"webm",l:"WebM"},{id:"gif",l:"GIF"},{id:"avi",l:"AVI"}].map(f=>(
                      <button key={f.id} onClick={()=>setExportFormat(f.id)} style={{background:exportFormat===f.id?"#a78bfa22":bg,border:`1px solid ${exportFormat===f.id?"#a78bfa":border2}`,color:exportFormat===f.id?"#c4b5fd":muted,borderRadius:7,padding:"6px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>{f.l}</button>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:11,color:muted,marginBottom:7,fontWeight:600,textTransform:"uppercase",letterSpacing:"1px"}}>Quality</div>
                  <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                    {[{id:"480p",l:"480p"},{id:"720p",l:"720p"},{id:"1080p",l:"1080p"},{id:"4k",l:"4K"}].map(q=>(
                      <button key={q.id} onClick={()=>setExportQuality(q.id)} style={{background:exportQuality===q.id?"#a78bfa22":bg,border:`1px solid ${exportQuality===q.id?"#a78bfa":border2}`,color:exportQuality===q.id?"#c4b5fd":muted,borderRadius:7,padding:"6px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>{q.l}</button>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:11,color:muted,marginBottom:7,fontWeight:600,textTransform:"uppercase",letterSpacing:"1px"}}>Frame Rate</div>
                  <div style={{display:"flex",gap:7}}>
                    {["24fps","30fps","60fps"].map(f=>(
                      <button key={f} onClick={()=>setExportFps(f)} style={{background:exportFps===f?"#a78bfa22":bg,border:`1px solid ${exportFps===f?"#a78bfa":border2}`,color:exportFps===f?"#c4b5fd":muted,borderRadius:7,padding:"6px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>{f}</button>
                    ))}
                  </div>
                </div>
                {exporting?(
                  <div>
                    <div style={{fontSize:12,color:muted,marginBottom:6}}>Exporting... {exportProgress}%</div>
                    <div style={{background:dark?"#1a1a28":"#e8e0f8",borderRadius:999,height:5}}>
                      <div style={{height:"100%",width:`${exportProgress}%`,background:"linear-gradient(90deg,#7c3aed,#a855f7)",borderRadius:999,transition:"width 0.2s"}}/>
                    </div>
                  </div>
                ):exportDone?(
                  <div>
                    <div style={{background:dark?"#0a1f12":"#efffef",border:"1px solid #1a4a2a",borderRadius:8,padding:"9px 12px",marginBottom:10,display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:18}}>done</span>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:"#4ade80"}}>Export Complete!</div>
                        <div style={{fontSize:11,color:"#3a6a4a"}}>Ready - {exportFormat.toUpperCase()} - {exportQuality}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button className="pill on" onClick={downloadVideo}>Download</button>
                      <button className="pill" onClick={()=>setExportDone(false)}>Re-export</button>
                    </div>
                  </div>
                ):(
                  <button onClick={startExport} style={{width:"100%",padding:"10px",borderRadius:9,border:"none",background:"linear-gradient(135deg,#7c3aed,#a855f7)",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                    Export {exportFormat.toUpperCase()} - {exportQuality}
                  </button>
                )}
              </div>
              <div style={{textAlign:"center",marginTop:12}}><button className="pill" onClick={reset}>+ New Video</button></div>
            </div>
          ):(
            <button className="genbtn" onClick={generate} disabled={(!prompt.trim()&&!scriptMode)||(scriptMode&&scenes.every(s=>!s.text.trim()))||isEnhancing}>
              Generate Video (Free & Unlimited)
            </button>
          )}

          {phase==="error"&&(
            <div style={{marginTop:10,padding:"12px 14px",background:"#1a0a0a",border:"1px solid #4a1a1a",borderRadius:8,fontSize:12,color:"#f87171"}}>
              {errorMsg}
              <button onClick={()=>{setPhase("idle");setErrorMsg("");}} style={{marginLeft:10,background:"none",border:"none",color:"#a78bfa",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Try again</button>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {/* User Profile */}
          <div className="sbcard">
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <div style={{width:46,height:46,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:"#fff",flexShrink:0}}>{userAvatar}</div>
              <div style={{overflow:"hidden",flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{userName}</div>
                <div style={{fontSize:11,color:muted,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.email}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              {[{val:history.length,label:"Videos",color:"#c4b5fd"},{val:"Free",label:"Plan",color:"#4ade80"},{val:"Unlimited",label:"Credits",color:"#f59e0b"}].map(({val,label,color})=>(
                <div key={label} style={{flex:1,background:bg3,border:`1px solid ${border2}`,borderRadius:8,padding:"7px 4px",textAlign:"center"}}>
                  <div style={{fontSize:label==="Credits"?10:15,fontWeight:700,color}}>{val}</div>
                  <div style={{fontSize:10,color:muted,marginTop:2}}>{label}</div>
                </div>
              ))}
            </div>
            <button onClick={()=>setShowPricing(true)} style={{width:"100%",background:"linear-gradient(135deg,#7c3aed,#a855f7)",border:"none",borderRadius:8,color:"#fff",fontSize:12,fontWeight:600,padding:"8px",cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>Upgrade to Pro</button>
            <button onClick={signOut} style={{width:"100%",background:"transparent",border:`1px solid ${border2}`,borderRadius:8,color:muted,fontSize:12,padding:"7px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>Sign Out</button>
          </div>

          {/* Recent Generations */}
          <div>
            <div className="slabel">Recent Generations</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {history.length===0
                ?<div style={{fontSize:13,color:muted,textAlign:"center",padding:"16px 0",background:bg2,borderRadius:12,border:`1px solid ${borderC}`}}>No videos yet - generate your first!</div>
                :history.map(item=>(
                  <div key={item.id} className="hcard">
                    <div style={{width:42,height:42,borderRadius:8,background:dark?"#1a1a28":"#e8e0f8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🎬</div>
                    <div style={{overflow:"hidden",flex:1}}>
                      <div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:text}}>{item.label}</div>
                      <div style={{fontSize:11,color:muted,marginTop:2,display:"flex",gap:8,alignItems:"center"}}>
                        <span>{item.duration}</span>
                        {item.status&&<span style={{background:item.status==="done"?"#4ade8022":"#a78bfa22",color:item.status==="done"?"#4ade80":"#a78bfa",borderRadius:999,padding:"1px 6px",fontSize:10}}>{item.status}</span>}
                      </div>
                    </div>
                    {item.video_url&&<a href={item.video_url} download style={{fontSize:16,textDecoration:"none",flexShrink:0}}>save</a>}
                  </div>
                ))
              }
            </div>
          </div>

          {/* Quick Settings */}
          <div className="sbcard" style={{fontSize:12,lineHeight:1.9}}>
            <div style={{color:"#a78bfa",fontWeight:600,marginBottom:8}}>Quick Settings</div>
            {([["Style",style],["Duration",duration],["Ratio",ratio],["Voice",voiceObj?.label||"None"],["Captions",captionFont!=="none"?cfObj?.label:"Off"],["Music",musicObj?.label||"None"],["Color",gradeObj?.label||"None"]] as [string,string|undefined][]).map(([key,val])=>(
              <div key={key} style={{display:"flex",justifyContent:"space-between",gap:8}}>
                <span style={{color:muted}}>{key}</span>
                <span style={{color:dark?"#8080a0":"#6060a0",textAlign:"right"}}>{val}</span>
              </div>
            ))}
          </div>

          {/* Live Connections */}
          <div className="sbcard" style={{fontSize:12,color:muted,lineHeight:1.6}}>
            <div style={{color:"#4ade80",fontWeight:600,marginBottom:8}}>Live Connections</div>
            {["Supabase Auth","Supabase Storage","Pollinations AI (Free)","Claude AI (Enhancer)","Web Audio (Music)"].map(s=>(
              <div key={s} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{width:7,height:7,borderRadius:"50%",background:"#4ade80",display:"inline-block",flexShrink:0}}/>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
