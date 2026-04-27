import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════ */
const C = {
  bg0:        "#07090d",
  bg1:        "#0c1018",
  bg2:        "#111620",
  bg3:        "#161d2a",
  border:     "#1c2840",
  borderHi:   "#2a3d5c",
  accent:     "#2979ff",
  accentHi:   "#5b9aff",
  accentGlow: "rgba(41,121,255,0.15)",
  accentSoft: "rgba(41,121,255,0.08)",
  green:      "#00d4a0",
  greenSoft:  "rgba(0,212,160,0.1)",
  amber:      "#f0a500",
  amberSoft:  "rgba(240,165,0,0.1)",
  red:        "#ff5252",
  textHi:     "#e4edfb",
  text:       "#7d96b5",
  textDim:    "#3d5270",
  mono:       "'DM Mono','Fira Code',monospace",
  display:    "'Bricolage Grotesque','Segoe UI',sans-serif",
};

/* ═══════════════════════════════════════════════════════════
   FONT LOADER
═══════════════════════════════════════════════════════════ */
const useGoogleFonts = () => {
  useEffect(() => {
    if (document.getElementById("bls-fonts")) return;
    const l = document.createElement("link");
    l.id = "bls-fonts";
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&display=swap";
    document.head.appendChild(l);
  }, []);
};

/* ═══════════════════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body {
    background: ${C.bg0};
    color: ${C.text};
    font-family: ${C.mono};
    font-size: 14px;
    line-height: 1.75;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  #root { height: 100%; }
  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; border: none; background: none; font-family: inherit; color: inherit; }
  ::selection { background: ${C.accentGlow}; color: ${C.textHi}; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: ${C.bg0}; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes slideIn  { from { transform:translateX(100%); } to { transform:translateX(0); } }
  @keyframes slideOut { from { transform:translateX(0); } to { transform:translateX(100%); } }
  @keyframes pulse    { 0%,100%{opacity:1;} 50%{opacity:0.35;} }
  @keyframes blink    { 0%,100%{opacity:1;} 50%{opacity:0;} }
  @keyframes gridDrift { from{transform:translateY(0);} to{transform:translateY(56px);} }
  @keyframes pageEnter { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }

  .page-enter { animation: pageEnter 0.4s cubic-bezier(.22,1,.36,1) both; }
  .fade-up-1  { animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) 0.05s both; }
  .fade-up-2  { animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) 0.15s both; }
  .fade-up-3  { animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) 0.25s both; }
  .fade-up-4  { animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) 0.35s both; }
  .fade-up-5  { animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) 0.45s both; }

  .card {
    background: ${C.bg1};
    border: 1px solid ${C.border};
    border-radius: 10px;
    transition: border-color .2s, transform .2s, box-shadow .2s;
  }
  .card:hover {
    border-color: ${C.borderHi};
    transform: translateY(-2px);
    box-shadow: 0 10px 36px rgba(0,0,0,.35);
  }

  .btn-primary {
    display:inline-flex; align-items:center; gap:8px;
    padding:11px 22px; border-radius:7px;
    background:${C.accent}; color:#fff;
    font-family:${C.mono}; font-size:13px; font-weight:500; letter-spacing:.04em;
    border:1px solid transparent;
    transition:all .2s;
  }
  .btn-primary:hover { background:#1860e0; transform:translateY(-1px); box-shadow:0 0 20px ${C.accentGlow}; }

  .btn-ghost {
    display:inline-flex; align-items:center; gap:8px;
    padding:10px 22px; border-radius:7px;
    background:transparent; color:${C.text};
    font-family:${C.mono}; font-size:13px; letter-spacing:.04em;
    border:1px solid ${C.border};
    transition:all .2s;
  }
  .btn-ghost:hover { border-color:${C.accent}; color:${C.textHi}; background:${C.accentSoft}; }

  .tag {
    display:inline-block;
    padding:3px 10px; border-radius:5px; font-size:11px;
    background:${C.accentSoft}; color:${C.accentHi};
    border:1px solid rgba(41,121,255,.18);
    letter-spacing:.03em;
  }

  .section-label {
    display:inline-flex; align-items:center; gap:10px;
    font-size:11px; letter-spacing:.18em; text-transform:uppercase;
    color:${C.accent}; margin-bottom:1.25rem;
  }
  .section-label::before {
    content:''; display:block; width:18px; height:1px; background:${C.accent};
  }

  @media (max-width:768px) {
    .hide-mobile { display:none !important; }
  }
  @media (min-width:769px) {
    .hide-desktop { display:none !important; }
  }
`;

const GlobalStyle = () => (
  <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
);

/* ═══════════════════════════════════════════════════════════
   GRID BACKGROUND
═══════════════════════════════════════════════════════════ */
const GridBg = ({ opacity = 0.3 }) => (
  <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
    <div style={{
      position:"absolute", inset:"-56px",
      backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,
      backgroundSize:"56px 56px",
      opacity,
      animation:"gridDrift 12s linear infinite",
    }}/>
    <div style={{
      position:"absolute", inset:0,
      background:`radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, ${C.bg0} 100%)`,
    }}/>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGES CONFIG
═══════════════════════════════════════════════════════════ */
const PAGES = [
  { id:"home",     label:"Home" },
  { id:"about",    label:"About" },
  { id:"skills",   label:"Skills" },
  { id:"projects", label:"Projects" },
  { id:"contact",  label:"Contact" },
];

/* ═══════════════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════════════ */
const Nav = ({ page, setPage }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close drawer on ESC
  useEffect(() => {
    const fn = e => { if (e.key === "Escape") setDrawerOpen(false); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const navigate = useCallback((id) => {
    setPage(id);
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [setPage]);

  return (
    <>
      {/* ── NAV BAR ── */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:300,
        height:60,
        borderBottom:`1px solid ${scrolled ? C.border : "transparent"}`,
        background: scrolled ? "rgba(7,9,13,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        transition:"all .3s",
        display:"flex", alignItems:"center",
      }}>
        <div style={{
          maxWidth:1100, margin:"0 auto", padding:"0 1.5rem",
          width:"100%",
          display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          {/* Logo */}
          <button
            onClick={() => navigate("home")}
            style={{
              fontFamily:C.display, fontWeight:800, fontSize:18,
              color:C.textHi, letterSpacing:"-0.01em",
              background:"none", border:"none",
            }}
          >
            BLS<span style={{ color:C.accent }}>.</span>
          </button>

          {/* Desktop links */}
          <div className="hide-mobile" style={{ display:"flex", alignItems:"center", gap:"0.25rem" }}>
            {PAGES.map(p => (
              <button
                key={p.id}
                onClick={() => navigate(p.id)}
                style={{
                  padding:"6px 14px", borderRadius:6, fontSize:12,
                  letterSpacing:"0.08em", textTransform:"uppercase",
                  color: page === p.id ? C.textHi : C.textDim,
                  background: page === p.id ? C.accentSoft : "transparent",
                  border:`1px solid ${page === p.id ? C.borderHi : "transparent"}`,
                  transition:"all .2s",
                  fontFamily:C.mono,
                }}
                onMouseEnter={e => { if (page !== p.id) e.currentTarget.style.color = C.text; }}
                onMouseLeave={e => { if (page !== p.id) e.currentTarget.style.color = C.textDim; }}
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={() => navigate("contact")}
              className="btn-primary"
              style={{ marginLeft:"0.75rem", padding:"7px 18px", fontSize:12 }}
            >
              Hire Me
            </button>
          </div>

          {/* Hamburger */}
          <button
            className="hide-desktop"
            onClick={() => setDrawerOpen(o => !o)}
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            style={{
              width:40, height:40, display:"flex",
              flexDirection:"column", justifyContent:"center",
              alignItems:"center", gap:5,
              borderRadius:8,
              border:`1px solid ${drawerOpen ? C.borderHi : C.border}`,
              background: drawerOpen ? C.accentSoft : "transparent",
              transition:"all .2s",
              padding:0,
            }}
          >
            <span style={{
              display:"block", width:18, height:1.5, background:C.textHi,
              transition:"all .25s",
              transform: drawerOpen ? "translateY(6.5px) rotate(45deg)" : "none",
            }}/>
            <span style={{
              display:"block", width:18, height:1.5, background:C.textHi,
              transition:"all .25s",
              opacity: drawerOpen ? 0 : 1,
              transform: drawerOpen ? "scaleX(0)" : "none",
            }}/>
            <span style={{
              display:"block", width:18, height:1.5, background:C.textHi,
              transition:"all .25s",
              transform: drawerOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
            }}/>
          </button>
        </div>
      </nav>

      {/* ── DRAWER OVERLAY ── */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position:"fixed", inset:0, zIndex:290,
            background:"rgba(7,9,13,0.6)",
            backdropFilter:"blur(4px)",
            WebkitBackdropFilter:"blur(4px)",
            animation:"fadeIn .2s ease both",
          }}
        />
      )}

      {/* ── DRAWER PANEL ── */}
      <div
        className="hide-desktop"
        style={{
          position:"fixed", top:0, right:0, bottom:0,
          width:"min(320px, 85vw)",
          zIndex:400,
          background:C.bg1,
          borderLeft:`1px solid ${C.border}`,
          display:"flex", flexDirection:"column",
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
          transition:"transform .3s cubic-bezier(.22,1,.36,1)",
          boxShadow: drawerOpen ? "-20px 0 60px rgba(0,0,0,.5)" : "none",
        }}
      >
        {/* Drawer header */}
        <div style={{
          height:60, padding:"0 1.5rem",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          borderBottom:`1px solid ${C.border}`,
          flexShrink:0,
        }}>
          <span style={{ fontFamily:C.display, fontWeight:800, fontSize:17, color:C.textHi }}>
            BLS<span style={{ color:C.accent }}>.</span>
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{
              width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center",
              borderRadius:6, border:`1px solid ${C.border}`,
              color:C.text, fontSize:16, transition:"all .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHi; e.currentTarget.style.color = C.textHi; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;   e.currentTarget.style.color = C.text; }}
          >
            ✕
          </button>
        </div>

        {/* Drawer links */}
        <div style={{ flex:1, padding:"1.5rem 1rem", overflowY:"auto", display:"flex", flexDirection:"column", gap:"0.35rem" }}>
          {PAGES.map((p, i) => (
            <button
              key={p.id}
              onClick={() => navigate(p.id)}
              style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"14px 16px", borderRadius:8, width:"100%", textAlign:"left",
                fontFamily:C.mono, fontSize:15,
                color:    page === p.id ? C.textHi   : C.text,
                background: page === p.id ? C.accentSoft : "transparent",
                border:`1px solid ${page === p.id ? C.borderHi : "transparent"}`,
                transition:"all .15s",
                animation:`fadeUp .3s cubic-bezier(.22,1,.36,1) ${i * 0.05 + 0.05}s both`,
              }}
              onMouseEnter={e => { if (page !== p.id) { e.currentTarget.style.background = C.bg2; e.currentTarget.style.color = C.textHi; }}}
              onMouseLeave={e => { if (page !== p.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.text; }}}
            >
              <span>{p.label}</span>
              {page === p.id && <span style={{ color:C.accent, fontSize:12 }}>●</span>}
            </button>
          ))}
        </div>

        {/* Drawer footer CTA */}
        <div style={{ padding:"1.25rem", borderTop:`1px solid ${C.border}`, flexShrink:0 }}>
          <button
            onClick={() => navigate("contact")}
            className="btn-primary"
            style={{ width:"100%", justifyContent:"center", padding:"13px" }}
          >
            Get In Touch →
          </button>
          <div style={{ marginTop:"1rem", display:"flex", justifyContent:"center", gap:"1.5rem" }}>
            {[
              { label:"GitHub",   href:"https://github.com/CalmAfterReboot" },
              { label:"LinkedIn", href:"https://linkedin.com" },
            ].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize:11, color:C.textDim, letterSpacing:"0.08em", transition:"color .2s" }}
                onMouseEnter={e => e.target.style.color = C.accent}
                onMouseLeave={e => e.target.style.color = C.textDim}
              >{l.label}</a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════════════════════ */
const TypeWriter = ({ text, delay = 0 }) => {
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        setShown(text.slice(0, ++i));
        if (i >= text.length) clearInterval(iv);
      }, 36);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay]);

  return (
    <span>
      {shown}
      {shown.length < text.length && (
        <span style={{ animation:"blink .8s step-end infinite", color:C.accent }}>▮</span>
      )}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════
   PAGE: HOME
═══════════════════════════════════════════════════════════ */
const HomePage = ({ setPage }) => (
  <div className="page-enter" style={{ minHeight:"100vh", display:"flex", alignItems:"center", paddingTop:60, position:"relative", overflow:"hidden" }}>
    <GridBg opacity={0.28}/>

    {/* Glow */}
    <div style={{ position:"absolute", width:640, height:640, top:"20%", right:"-15%",
      background:`radial-gradient(circle,rgba(41,121,255,0.05) 0%,transparent 65%)`, pointerEvents:"none" }}/>

    <div style={{ maxWidth:1100, margin:"0 auto", padding:"4rem 1.5rem", position:"relative", zIndex:1, width:"100%" }}>

      {/* Availability pill */}
      <div className="fade-up-1" style={{ marginBottom:"2rem" }}>
        <span style={{
          display:"inline-flex", alignItems:"center", gap:8,
          padding:"6px 14px", borderRadius:20,
          background:C.greenSoft, border:`1px solid rgba(0,212,160,.2)`,
          fontSize:11, letterSpacing:".12em", textTransform:"uppercase", color:C.green,
        }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:C.green, animation:"pulse 2s ease-in-out infinite" }}/>
          Available · Remote · UK-Based
        </span>
      </div>

      {/* Name */}
      <h1 className="fade-up-2" style={{
        fontFamily:C.display, fontWeight:800,
        fontSize:"clamp(3rem,8vw,6rem)",
        lineHeight:1.0, letterSpacing:"-0.035em",
        color:C.textHi, marginBottom:"1.25rem",
      }}>
        Mihai<br/>Ferencz
      </h1>

      {/* Typewriter role */}
      <div className="fade-up-3" style={{
        fontFamily:C.mono, fontSize:"clamp(.95rem,2vw,1.2rem)",
        color:C.accent, marginBottom:"1.75rem", minHeight:"1.8rem",
      }}>
        <TypeWriter text="Cloud & DevOps Engineer — Blue Layer Systems" delay={500}/>
      </div>

      {/* Strapline */}
      <p className="fade-up-3" style={{ maxWidth:540, fontSize:14, color:C.text, lineHeight:1.9, marginBottom:"2.5rem" }}>
        3+ years MSP infrastructure. IaC-first. Security-aware.
        Building production-grade cloud platforms under the BLS brand —
        everything ships to GitHub with full Terraform, CI/CD, and runbooks.
      </p>

      {/* CTAs */}
      <div className="fade-up-4" style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
        <button onClick={() => setPage("projects")} className="btn-primary">View Projects →</button>
        <button onClick={() => setPage("contact")}  className="btn-ghost">Get In Touch</button>
        <a href="https://github.com/CalmAfterReboot" target="_blank" rel="noopener noreferrer" className="btn-ghost">
          <GithubIcon/> GitHub
        </a>
      </div>

      {/* Stats */}
      <div className="fade-up-5" style={{
        display:"flex", gap:"2.5rem", flexWrap:"wrap",
        marginTop:"4rem", paddingTop:"2rem",
        borderTop:`1px solid ${C.border}`,
      }}>
        {[
          { v:"2+",     l:"Years Internal IT" },
          { v:"8mo+",   l:"MSP Operations" },
          { v:"AZ-104", l:"Microsoft Azure" },
          { v:"IaC",    l:"Terraform · Ansible" },
        ].map(s => (
          <div key={s.l}>
            <div style={{ fontFamily:C.display, fontWeight:700, fontSize:24, color:C.textHi }}>{s.v}</div>
            <div style={{ fontSize:11, color:C.textDim, letterSpacing:".06em", marginTop:2 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: ABOUT
═══════════════════════════════════════════════════════════ */
const AboutPage = ({ setPage }) => (
  <div className="page-enter" style={{ minHeight:"100vh", paddingTop:60 }}>
    <style>{`
      .about-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        align-items: start;
      }
      @media (max-width: 768px) {
        .about-grid {
          grid-template-columns: 1fr !important;
          gap: 2rem !important;
        }
      }

      /* Experience timeline */
      .exp-entry { padding: 1rem 0; border-bottom: 1px solid ${C.border}; }
      .exp-entry:last-child { border-bottom: none; }
    `}</style>

    <div style={{ maxWidth:1100, margin:"0 auto", padding:"4rem 1.5rem" }}>

      <div className="section-label fade-up-1">About</div>
      <h2 className="fade-up-1" style={{
        fontFamily:C.display, fontWeight:800,
        fontSize:"clamp(2rem,5vw,3.2rem)",
        color:C.textHi, letterSpacing:"-0.03em",
        marginBottom:"3rem", lineHeight:1.1,
      }}>
        Infrastructure Engineer<br/>Going Cloud-Native
      </h2>

      <div className="about-grid">

        {/* ── LEFT: Bio + Experience ── */}
        <div className="fade-up-2">
          <p style={{ color:C.text, lineHeight:1.95, marginBottom:"1.25rem", fontSize:14 }}>
            Based in Carlisle, UK. Background spans internal IT infrastructure, MSP operations,
            and helpdesk engineering. 2+ years owning multi-site on-prem infrastructure at
            Carrs Group, 8+ months managing multi-tenant cloud and network operations at
            Global4 Communications.
          </p>
          <p style={{ color:C.text, lineHeight:1.95, marginBottom:"1.25rem", fontSize:14 }}>
            Building Blue Layer Systems as a public, verifiable engineering identity.
            Every project ships with full IaC, CI/CD pipelines, runbooks, and cost analysis.
            No toy demos — production patterns, homelab scale.
          </p>
          <p style={{ color:C.text, lineHeight:1.95, marginBottom:"2rem", fontSize:14 }}>
            Cert roadmap: AZ-104 → Terraform Associate → AZ-400 → AZ-305.
            Portfolio delivery takes priority over cert-chasing. SC Clearance pursuit
            running as a parallel track.
          </p>

          {/* Experience entries */}
          <div style={{ marginBottom:"2rem" }}>
            <div style={{ fontSize:11, letterSpacing:".14em", textTransform:"uppercase", color:C.textDim, marginBottom:"0.75rem" }}>
              Experience
            </div>

            {[
              {
                title: "TechOps Engineer",
                org:   "Global4 Communications Ltd",
                period:"2024 – Present · 8+ months",
                color: C.accent,
                desc:  "Multi-tenant MSP operations across 50+ client accounts. Azure, Entra ID, Intune, Hyper-V, Datto RMM, Sophos, Cisco Meraki, DrayTek, Windows Server. Vendor management, DNS, licence renewals, endpoint diagnostics, change control.",
              },
              {
                title: "Senior IT Operations Analyst",
                org:   "Carrs Group",
                period:"2021 – 2024 · 2+ years",
                color: C.green,
                desc:  "Four-site infrastructure ownership. Cisco Meraki network architecture, VLAN segmentation, IoT/OT integration, Entra ID & Intune, Hyper-V, SCCM, Autodesk Vault upgrade, firmware management under ITIL change control.",
              },
              {
                title: "IT Support / Helpdesk",
                org:   "STK / NHS Contract",
                period:"~1 year",
                color: C.textDim,
                desc:  "Windows 10 deployment engineer on NHS contract. 2,000+ device rollout using SCCM. Also covered hospital switchboard and comms operations (Mitie).",
              },
            ].map(e => (
              <div key={e.title} className="exp-entry">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:4, marginBottom:"0.35rem" }}>
                  <span style={{ fontFamily:C.display, fontWeight:700, fontSize:14, color:C.textHi }}>{e.title}</span>
                  <span style={{ fontSize:11, color:C.textDim, letterSpacing:".04em", whiteSpace:"nowrap" }}>{e.period}</span>
                </div>
                <div style={{ fontSize:11, color:e.color, marginBottom:"0.4rem", letterSpacing:".04em" }}>{e.org}</div>
                <p style={{ fontSize:12.5, color:C.text, lineHeight:1.75 }}>{e.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
            <button onClick={() => setPage("projects")} className="btn-primary">See Projects →</button>
            <button onClick={() => setPage("skills")} className="btn-ghost">Skills</button>
          </div>
        </div>

        {/* ── RIGHT: Terminal + Homelab ── */}
        <div className="fade-up-3">
          {/* Terminal card */}
          <div style={{ background:C.bg0, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden", fontFamily:C.mono }}>
            <div style={{ background:C.bg3, padding:"10px 16px", display:"flex", alignItems:"center", gap:8, borderBottom:`1px solid ${C.border}` }}>
              {["#ff5f57","#ffbd2e","#28c840"].map(c => (
                <div key={c} style={{ width:11, height:11, borderRadius:"50%", background:c }}/>
              ))}
              <span style={{ marginLeft:6, fontSize:11, color:C.textDim }}>~/bls — whoami</span>
            </div>
            <div style={{ padding:"1.25rem 1.5rem", fontSize:12.5, lineHeight:2.15 }}>
              {[
                { k:"name",     v:"Mihai Ferencz" },
                { k:"role",     v:"Cloud / DevOps Engineer" },
                { k:"location", v:"Carlisle, UK (Remote-first)" },
                { k:"current",  v:"Global4 Communications Ltd" },
                { k:"certs",    v:"AZ-104 · Terraform (WIP)" },
                { k:"brand",    v:"bluelayersystems.com" },
                { k:"github",   v:"CalmAfterReboot" },
                { k:"target",   v:"£45–65k Cloud/DevOps/SRE" },
                { k:"status",   v:"Open to Opportunities", hi:true },
              ].map(r => (
                <div key={r.k} style={{ display:"flex", gap:0, alignItems:"baseline" }}>
                  <span style={{ color:C.textDim, minWidth:76, flexShrink:0 }}>{r.k}</span>
                  <span style={{ color:C.textDim, marginRight:8 }}>:</span>
                  <span style={{ color:r.hi ? C.green : C.textHi, wordBreak:"break-word" }}>
                    {r.v}{r.hi && <span style={{ animation:"blink .8s step-end infinite" }}> _</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Homelab card */}
          <div style={{ marginTop:"1.25rem", background:C.bg1, border:`1px solid ${C.border}`, borderRadius:10, padding:"1.25rem 1.5rem" }}>
            <div style={{ fontSize:11, letterSpacing:".12em", textTransform:"uppercase", color:C.textDim, marginBottom:"0.85rem" }}>
              Homelab
            </div>
            {[
              ["Hypervisor",  "Proxmox · 128GB RAM · 6-core Xeon"],
              ["Firewall",    "pfSense"],
              ["Switching",   "TP-Link Managed · Omada Controller"],
              ["VLANs",       "10 / 20 / 30 / 40 / 50 / 99 / 200"],
              ["Domain",      "bluelayersystems.com"],
            ].map(([k,v]) => (
              <div key={k} style={{
                display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:4,
                fontSize:12.5, padding:"5px 0", borderBottom:`1px solid ${C.border}`,
              }}>
                <span style={{ color:C.textDim, flexShrink:0 }}>{k}</span>
                <span style={{ color:C.text, textAlign:"right" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: SKILLS
═══════════════════════════════════════════════════════════ */
const SKILLS = [
  { domain:"Cloud & IaC",              icon:"☁",  items:["Azure (IaaS/PaaS/IAM)","Terraform","Ansible","Bicep / ARM","GitHub Actions","Checkov","Infracost","Azure Policy"] },
  { domain:"Infrastructure & Compute", icon:"⚙",  items:["Windows Server 2016–2022","Hyper-V","Proxmox","RDS / FSLogix / AVD","Active Directory DS","Group Policy","Datto RMM"] },
  { domain:"Identity & Security",      icon:"🔐", items:["Entra ID / Azure AD","Intune MDM/MAM","Conditional Access","RBAC / PIM","Sophos XDR","MFA / SSPR","Zero Trust basics"] },
  { domain:"Networking",               icon:"🌐", items:["pfSense / DrayTek","Cisco Meraki","UniFi / TP-Link Omada","VLANs / 802.1Q","BGP fundamentals","DNS / DHCP / IPAM"] },
  { domain:"Scripting & Automation",   icon:"💻", items:["PowerShell (advanced)","Bash","Python (intermediate)","PnP PowerShell","REST / Graph API","YAML / JSON / HCL"] },
  { domain:"Observability",            icon:"📊", items:["Azure Monitor","Log Analytics / KQL","Grafana (homelab)","Prometheus basics","Event Viewer / Syslog","ITSM / ITIL"] },
];

const SkillsPage = () => (
  <div className="page-enter" style={{ minHeight:"100vh", paddingTop:60 }}>
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"4rem 1.5rem" }}>
      <div className="section-label fade-up-1">Competencies</div>
      <h2 className="fade-up-1" style={{ fontFamily:C.display, fontWeight:800, fontSize:"clamp(2rem,5vw,3rem)", color:C.textHi, letterSpacing:"-0.03em", marginBottom:"0.75rem" }}>
        Full-Stack Infrastructure
      </h2>
      <p className="fade-up-2" style={{ color:C.text, marginBottom:"3rem", maxWidth:500, fontSize:14 }}>
        From bare-metal to cloud-native. Every item below has been used in production or homelab environments.
      </p>

      <div className="fade-up-3" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.25rem" }}>
        {SKILLS.map((s) => (
          <div key={s.domain} className="card" style={{ padding:"1.5rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1rem" }}>
              <span style={{ fontSize:20 }}>{s.icon}</span>
              <span style={{ fontFamily:C.display, fontWeight:700, fontSize:15, color:C.textHi }}>{s.domain}</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {s.items.map(item => (
                <div key={item} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12.5, color:C.text }}>
                  <span style={{ color:C.accent, fontSize:9, flexShrink:0 }}>▸</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: PROJECTS
═══════════════════════════════════════════════════════════ */
const PROJECTS = [
  { num:"01", title:"Azure Landing Zone",         status:"progress", tags:["Terraform","GitHub Actions","Checkov","Infracost","Azure Policy"],    tagline:"Hub-spoke IaC with policy, RBAC, and CI/CD guardrails.",               desc:"Production-pattern landing zone: hub VNet with spokes, Defender for Cloud, Azure Policy at management group scope, cost guardrails via Infracost in CI. Every PR validates, plans, and cost-checks before merge." },
  { num:"02", title:"Config Management Platform", status:"planned",  tags:["Ansible","AWX","Windows Server","Proxmox"],                           tagline:"Ansible + AWX automating server baselines across hybrid estate.",        desc:"Idempotent server baseline playbooks: patching, CIS L1 hardening, monitoring agents, drift detection. AWX provides audit trail and RBAC-controlled execution." },
  { num:"03", title:"Observability Stack",         status:"planned",  tags:["Grafana","Prometheus","Loki","Azure Monitor","KQL"],                  tagline:"Unified metrics, logs, and traces across homelab and Azure.",            desc:"Azure Monitor → Log Analytics, Prometheus scraping homelab exporters, Loki aggregating syslog — all surfaced in Grafana. Alerting routed via PagerDuty webhook." },
  { num:"04", title:"Identity & Zero Trust Lab",  status:"planned",  tags:["Entra ID","PIM","Conditional Access","Terraform","Graph API"],        tagline:"Conditional Access and PIM policies managed as Terraform code.",         desc:"CA policies as Terraform resources via Graph API. PIM role assignments with approval workflows. Access reviews automated via PowerShell. Fully version-controlled identity posture." },
  { num:"05", title:"Kubernetes Platform",         status:"planned",  tags:["K3s","FluxCD","Helm","Proxmox","Cert-Manager"],                      tagline:"K3s on Proxmox with GitOps via FluxCD.",                                desc:"Lightweight production-pattern Kubernetes on homelab hardware. FluxCD for GitOps, Helm for workload packaging, cert-manager for TLS, MetalLB for LoadBalancer services." },
  { num:"06", title:"AI Gateway",                  status:"planned",  tags:["LiteLLM","Docker","Azure OpenAI","Ollama","Proxmox"],                 tagline:"LiteLLM routing across DeepSeek, Azure OpenAI, Anthropic, and Ollama.", desc:"Multi-provider LLM gateway with unified API, cost tracking, rate limiting, fallback routing. Local Ollama for private workloads. Metrics exported to Grafana." },
];

const STATUS_MAP = {
  live:     { label:"Live",        color:C.green, bg:C.greenSoft },
  progress: { label:"In Progress", color:C.amber, bg:C.amberSoft },
  planned:  { label:"Planned",     color:C.textDim, bg:"rgba(61,82,112,0.12)" },
};

const ProjectCard = ({ num, title, status, tags, tagline, desc }) => {
  const [open, setOpen] = useState(false);
  const s = STATUS_MAP[status];

  return (
    <div
      className="card"
      style={{ padding:"1.75rem", cursor:"pointer", position:"relative", userSelect:"none" }}
      onClick={() => setOpen(o => !o)}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.75rem" }}>
        <span style={{ fontFamily:C.mono, fontSize:11, color:C.textDim, letterSpacing:".1em" }}>{num}</span>
        <span style={{ fontSize:10, letterSpacing:".1em", textTransform:"uppercase", padding:"3px 10px", borderRadius:20, color:s.color, background:s.bg, fontWeight:500 }}>{s.label}</span>
      </div>
      <h3 style={{ fontFamily:C.display, fontWeight:700, fontSize:17, color:C.textHi, marginBottom:"0.5rem" }}>{title}</h3>
      <p style={{ fontSize:13, color:C.text, marginBottom:"1.25rem", lineHeight:1.7 }}>{tagline}</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
        {tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>

      {open && (
        <div style={{ marginTop:"1.25rem", paddingTop:"1.25rem", borderTop:`1px solid ${C.border}`, animation:"fadeUp .25s ease both" }}>
          <p style={{ fontSize:13, color:C.text, lineHeight:1.85 }}>{desc}</p>
          <a href="https://github.com/CalmAfterReboot" target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ display:"inline-flex", alignItems:"center", gap:6, marginTop:"1rem", fontSize:12, color:C.accent }}
          >
            View on GitHub →
          </a>
        </div>
      )}

      <div style={{ position:"absolute", bottom:14, right:18, fontSize:11, color:C.textDim }}>
        {open ? "▲" : "▼"}
      </div>
    </div>
  );
};

const ProjectsPage = () => (
  <div className="page-enter" style={{ minHeight:"100vh", paddingTop:60 }}>
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"4rem 1.5rem" }}>
      <div className="section-label fade-up-1">Portfolio</div>
      <h2 className="fade-up-1" style={{ fontFamily:C.display, fontWeight:800, fontSize:"clamp(2rem,5vw,3rem)", color:C.textHi, letterSpacing:"-0.03em", marginBottom:"0.75rem" }}>
        Six Projects.<br/>One Stack.
      </h2>
      <p className="fade-up-2" style={{ color:C.text, marginBottom:"3rem", maxWidth:520, fontSize:14 }}>
        Every project ships with full IaC, CI/CD, runbooks, and Infracost analysis.
        Tap a card to expand. Status updates as builds complete.
      </p>
      <div className="fade-up-3" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:"1.25rem" }}>
        {PROJECTS.map(p => <ProjectCard key={p.num} {...p}/>)}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE: CONTACT
═══════════════════════════════════════════════════════════ */
const ContactPage = () => {
  const [form, setForm] = useState({ name:"", email:"", message:"", type:"permanent" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
    // Production: POST to Formspree endpoint
  };

  const inp = {
    width:"100%", background:C.bg0,
    border:`1px solid ${C.border}`, borderRadius:7,
    padding:"11px 14px", color:C.textHi,
    fontFamily:C.mono, fontSize:13, outline:"none",
    transition:"border-color .2s",
  };

  const LINKS = [
    { label:"GitHub",   val:"CalmAfterReboot",          href:"https://github.com/CalmAfterReboot",       icon:"⌥" },
    { label:"LinkedIn", val:"linkedin.com/in/mihai-b",  href:"https://linkedin.com",                     icon:"in" },
    { label:"Email",    val:"mihai@bluelayersystems.com",href:"mailto:mihai@bluelayersystems.com",        icon:"@" },
    { label:"Domain",   val:"bluelayersystems.com",      href:"https://bluelayersystems.com",             icon:"⬡" },
  ];

  return (
    <div className="page-enter" style={{ minHeight:"100vh", paddingTop:60, position:"relative", overflow:"hidden" }}>
      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
      <GridBg opacity={0.2}/>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"4rem 1.5rem", position:"relative", zIndex:1 }}>

        <div className="section-label fade-up-1">Contact</div>
        <h2 className="fade-up-1" style={{ fontFamily:C.display, fontWeight:800, fontSize:"clamp(2rem,5vw,3rem)", color:C.textHi, letterSpacing:"-0.03em", marginBottom:"3rem", lineHeight:1.1 }}>
          Let's Build<br/>Something
        </h2>

        <div className="contact-grid">

          {/* Left */}
          <div className="fade-up-2">
            <p style={{ color:C.text, lineHeight:1.9, marginBottom:"2rem", fontSize:14 }}>
              Open to Cloud Engineer, DevOps Engineer, Platform Engineer, and SRE roles.
              Remote-first. Permanent or contract. £45–65k range. Happy to discuss.
            </p>

            <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem", marginBottom:"2.5rem" }}>
              {LINKS.map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                  style={{
                    display:"flex", alignItems:"center", gap:14,
                    padding:"12px 16px", borderRadius:8,
                    background:C.bg1, border:`1px solid ${C.border}`,
                    transition:"all .2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=C.borderHi; e.currentTarget.style.transform="translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=C.border;   e.currentTarget.style.transform="none"; }}
                >
                  <span style={{ width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:6, background:C.accentSoft, color:C.accent, fontSize:11, flexShrink:0 }}>{l.icon}</span>
                  <div>
                    <div style={{ fontSize:10, color:C.textDim, letterSpacing:".1em", textTransform:"uppercase" }}>{l.label}</div>
                    <div style={{ fontSize:12.5, color:C.textHi }}>{l.val}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Role types */}
            <div style={{ padding:"1.25rem", background:C.bg1, border:`1px solid ${C.border}`, borderRadius:8 }}>
              <div style={{ fontSize:11, letterSpacing:".12em", textTransform:"uppercase", color:C.textDim, marginBottom:"0.75rem" }}>Open To</div>
              {["Cloud Engineer","DevOps Engineer","Platform Engineer","Site Reliability Engineer"].map(r => (
                <div key={r} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:C.text, padding:"4px 0" }}>
                  <span style={{ color:C.green, fontSize:10 }}>✓</span> {r}
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="fade-up-3 card" style={{ padding:"2rem" }}>
            {sent ? (
              <div style={{ textAlign:"center", padding:"3rem 0" }}>
                <div style={{ fontSize:48, marginBottom:"1rem" }}>✓</div>
                <p style={{ fontFamily:C.display, fontWeight:700, fontSize:20, color:C.green }}>Message Sent</p>
                <p style={{ fontSize:13, color:C.textDim, marginTop:8 }}>I'll respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
                <div>
                  <label style={{ display:"block", fontSize:10, color:C.textDim, letterSpacing:".12em", textTransform:"uppercase", marginBottom:6 }}>Name</label>
                  <input type="text" name="name" required placeholder="Your name" value={form.name} onChange={set}
                    style={inp}
                    onFocus={e=>e.target.style.borderColor=C.accent}
                    onBlur={e=>e.target.style.borderColor=C.border}
                  />
                </div>
                <div>
                  <label style={{ display:"block", fontSize:10, color:C.textDim, letterSpacing:".12em", textTransform:"uppercase", marginBottom:6 }}>Email</label>
                  <input type="email" name="email" required placeholder="your@company.com" value={form.email} onChange={set}
                    style={inp}
                    onFocus={e=>e.target.style.borderColor=C.accent}
                    onBlur={e=>e.target.style.borderColor=C.border}
                  />
                </div>
                <div>
                  <label style={{ display:"block", fontSize:10, color:C.textDim, letterSpacing:".12em", textTransform:"uppercase", marginBottom:6 }}>Opportunity Type</label>
                  <select name="type" value={form.type} onChange={set}
                    style={{ ...inp, appearance:"none", cursor:"pointer" }}
                    onFocus={e=>e.target.style.borderColor=C.accent}
                    onBlur={e=>e.target.style.borderColor=C.border}
                  >
                    <option value="permanent">Permanent Role</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance / Project</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display:"block", fontSize:10, color:C.textDim, letterSpacing:".12em", textTransform:"uppercase", marginBottom:6 }}>Message</label>
                  <textarea name="message" required rows={5} placeholder="Tell me about the role, team, or project..." value={form.message} onChange={set}
                    style={{ ...inp, resize:"vertical", minHeight:120 }}
                    onFocus={e=>e.target.style.borderColor=C.accent}
                    onBlur={e=>e.target.style.borderColor=C.border}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ justifyContent:"center", opacity: loading ? 0.7 : 1 }} disabled={loading}>
                  {loading ? "Sending..." : "Send Message →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════ */
const Footer = ({ setPage }) => (
  <footer style={{ borderTop:`1px solid ${C.border}`, background:C.bg1, padding:"2rem 0" }}>
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem" }}>
      <button onClick={() => setPage("home")} style={{ fontFamily:C.display, fontWeight:800, fontSize:16, color:C.textHi }}>
        BLS<span style={{ color:C.accent }}>.</span>
      </button>
      <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap" }}>
        {PAGES.map(p => (
          <button key={p.id} onClick={() => setPage(p.id)}
            style={{ fontSize:11, color:C.textDim, letterSpacing:".08em", transition:"color .2s" }}
            onMouseEnter={e => e.currentTarget.style.color=C.text}
            onMouseLeave={e => e.currentTarget.style.color=C.textDim}
          >{p.label}</button>
        ))}
      </div>
      <span style={{ fontSize:11, color:C.textDim }}>© 2025 Blue Layer Systems</span>
    </div>
  </footer>
);

/* ═══════════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════════ */
const GithubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   ROOT APP — PAGE ROUTER
═══════════════════════════════════════════════════════════ */
export default function App() {
  useGoogleFonts();
  const [page, setPage] = useState("home");

  // Scroll to top on every page change
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [page]);

  const navigate = useCallback((id) => {
    setPage(id);
  }, []);

  const renderPage = () => {
    switch (page) {
      case "home":     return <HomePage     setPage={navigate}/>;
      case "about":    return <AboutPage    setPage={navigate}/>;
      case "skills":   return <SkillsPage/>;
      case "projects": return <ProjectsPage/>;
      case "contact":  return <ContactPage/>;
      default:         return <HomePage     setPage={navigate}/>;
    }
  };

  return (
    <>
      <GlobalStyle/>
      <Nav page={page} setPage={navigate}/>
      <main style={{ minHeight:"calc(100vh - 60px)" }}>
        {renderPage()}
      </main>
      <Footer setPage={navigate}/>
    </>
  );
}
