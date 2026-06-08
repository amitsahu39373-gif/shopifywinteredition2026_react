import { useState, useEffect, useRef, useCallback } from "react";

const SECTIONS = [
  { id: "sidekick", label: "Sidekick", num: "I" },
  { id: "agentic", label: "Agentic", num: "II" },
  { id: "online", label: "Online", num: "III" },
  { id: "retail", label: "Retail", num: "IV" },
  { id: "marketing", label: "Marketing", num: "V" },
  { id: "checkout", label: "Checkout", num: "VI" },
  { id: "operations", label: "Operations", num: "VII" },
  { id: "shopapp", label: "Shop app", num: "VIII" },
  { id: "b2b", label: "B2B", num: "IX" },
  { id: "finance", label: "Finance", num: "X" },
  { id: "shipping", label: "Shipping", num: "XI" },
  { id: "developer", label: "Developer", num: "XII" },
];

const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

/* ─── STYLES ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=DM+Serif+Display:ital@0;1&family=Instrument+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #e8e5de;
    --cream-dark: #d8d4c8;
    --cream-light: #f0ede6;
    --ink: #1a1814;
    --ink-muted: #5a5650;
    --ink-faint: #9a9690;
    --accent-pink: #f514a0;
    --accent-pink-dark: #c00080;
    --white: #ffffff;
    --nav-h: 52px;
    --serif: 'DM Serif Display', 'EB Garamond', Georgia, serif;
    --sans: 'Instrument Sans', system-ui, sans-serif;
  }

  html { scroll-behavior: smooth; }

  body, #root {
    font-family: var(--sans);
    background: var(--cream);
    color: var(--ink);
    overflow-x: hidden;
  }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    height: var(--nav-h);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px;
    background: transparent;
    transition: background 0.3s;
  }
  .nav.scrolled { background: rgba(232,229,222,0.92); backdrop-filter: blur(8px); }
  .nav-logo { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #fff; transition: color 0.3s; }
  .nav.scrolled .nav-logo { color: var(--ink); }
  .nav-logo-badge { font-size: 11px; background: var(--ink); color: var(--cream); padding: 2px 6px; border-radius: 3px; font-weight: 600; }
  .nav-logo-winter { font-size: 12px; color: rgba(255,255,255,0.7); margin-left: 2px; transition: color 0.3s; }
  .nav.scrolled .nav-logo-winter { color: var(--ink-muted); }
  .nav-center { display: flex; gap: 24px; align-items: center; }
  .nav-link { font-size: 13px; color: #fff; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: color 0.3s; }
  .nav.scrolled .nav-link { color: var(--ink); }
  .nav-right { display: flex; gap: 12px; align-items: center; }
  .nav-btn {
    font-size: 13px; padding: 6px 14px; border-radius: 20px;
    border: 1.5px solid rgba(255,255,255,0.8); background: transparent; color: #fff;
    cursor: pointer; font-weight: 500; font-family: var(--sans);
    transition: all 0.3s;
  }
  .nav-btn:hover { background: #fff; color: var(--ink); border-color: #fff; }
  .nav.scrolled .nav-btn {
    border: 1.5px solid var(--ink); background: var(--white); color: var(--ink);
  }
  .nav.scrolled .nav-btn:hover { background: var(--ink); color: var(--white); }
  .nav-link-plain { font-size: 13px; color: #fff; cursor: pointer; transition: color 0.3s; }
  .nav.scrolled .nav-link-plain { color: var(--ink); }

  /* LEFT SIDEBAR NAV */
  .sidenav {
    position: fixed; left: 0; top: 0; bottom: 0; z-index: 90;
    width: 160px; padding-bottom: 30px; padding-left: 20px;
    display: flex; flex-direction: column; justify-content: flex-end; gap: 2.5px;
    pointer-events: none;
    mix-blend-mode: difference;
  }
  .sidenav-item {
    display: flex; align-items: baseline; justify-content: space-between;
    padding-right: 12px;
    font-size: 11.5px; color: rgba(255, 255, 255, 0.55); cursor: pointer;
    pointer-events: all; transition: color 0.15s;
    font-family: var(--sans);
    line-height: 1.7;
  }
  .sidenav-item:hover, .sidenav-item.active { color: rgba(255, 255, 255, 0.95); }
  .sidenav-num { font-size: 10px; color: rgba(255, 255, 255, 0.4); }
  .sidenav-title {
    font-size: 11px; line-height: 1.35; color: rgba(255, 255, 255, 0.85);
    padding-right: 12px; margin-bottom: 8px; font-style: italic;
    font-family: var(--serif);
  }

  /* HERO */
  .hero {
    position: relative; height: 100vh; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
  }
  /* Real Shopify banner as background */
  .hero-bg {
    position: absolute; inset: 0;
    background-image: url('https://cdn.shopify.com/s/files/1/0817/4980/3064/articles/PR_Launch_NewsroomBanner_Main_2320x1000_e70a458b-f992-45d0-b19f-08a63efb91b2.jpg?v=1765387001');
    background-size: cover;
    background-position: center top;
    background-repeat: no-repeat;
  }
  /* Dark vignette overlay so card text stays readable */
  .hero-bg::after {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 70% 60% at 35% 50%, rgba(0,0,0,0.18) 0%, transparent 70%),
      linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%);
  }
  /* Three.js canvas overlay */
  .hero-three-canvas {
    position: absolute; inset: 0;
    pointer-events: none;
    z-index: 2;
  }
  /* Hide old CSS painting / tree / sky placeholders */
  .hero-painting { display: none; }
  .hero-tree-l, .hero-tree-r { display: none; }
  .hero-sky { display: none; }
  /* Figures */
  .figure-l, .figure-r {
    position: absolute; bottom: 5%; width: 280px; height: 460px;
  }
  .figure-l { left: 10%; animation: floatL 6s ease-in-out infinite; }
  .figure-r { right: 10%; animation: floatR 7s ease-in-out infinite 1s; }
  .figure-body {
    width: 100%; height: 100%; border-radius: 50% 50% 30% 30%;
    position: relative; overflow: hidden;
  }
  .figure-l .figure-body {
    background: linear-gradient(160deg, #f0e8d8 20%, #d8c8a8 50%, #c4a870 80%);
    clip-path: polygon(40% 0%, 60% 0%, 75% 15%, 80% 40%, 70% 60%, 75% 100%, 25% 100%, 30% 60%, 20% 40%, 25% 15%);
  }
  .figure-r .figure-body {
    background: linear-gradient(160deg, #d4905a 20%, #c07040 50%, #a05030 80%);
    clip-path: polygon(35% 0%, 65% 0%, 80% 20%, 85% 50%, 70% 65%, 72% 100%, 28% 100%, 30% 65%, 15% 50%, 20% 20%);
  }
  .figure-accent-l {
    position: absolute; bottom: 30%; left: 10%;
    width: 30px; height: 50px;
    background: #f514a0; border-radius: 50% 50% 30% 30%;
    opacity: 0.9;
  }
  .figure-accent-r {
    position: absolute; bottom: 20%; right: -5%;
    width: 80px; height: 70px;
    background: linear-gradient(135deg, #f514a0, #ff40b0);
    clip-path: polygon(50% 0%, 100% 40%, 80% 100%, 20% 100%, 0% 40%);
  }
  .skateboard {
    position: absolute; bottom: -8%; left: 20%;
    width: 120px; height: 20px;
    background: linear-gradient(90deg, #f514a0 0%, #ff40b0 40%, #f514a0 100%);
    border-radius: 6px; transform: rotate(-20deg);
    animation: skateFloat 4s ease-in-out infinite;
  }

  @keyframes floatL {
    0%, 100% { transform: translateY(0px) rotate(-2deg); }
    50% { transform: translateY(-18px) rotate(2deg); }
  }
  @keyframes floatR {
    0%, 100% { transform: translateY(0px) rotate(2deg); }
    50% { transform: translateY(-22px) rotate(-2deg); }
  }
  @keyframes skateFloat {
    0%, 100% { transform: rotate(-20deg) translateY(0); }
    50% { transform: rotate(-15deg) translateY(-10px); }
  }

  /* Hero card */
  .hero-card {
    position: absolute; left: 50%; top: 50%; transform: translate(-45%, -48%);
    border: 1px solid rgba(255,255,255,0.35); background: rgba(255,255,255,0.07);
    backdrop-filter: blur(1px); padding: 28px 32px 28px 28px; width: 300px;
    animation: fadeSlideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .hero-title {
    font-family: var(--serif); font-size: 46px; line-height: 1.0;
    color: var(--white); font-weight: 400; margin-bottom: 16px;
  }
  .hero-title em { font-style: italic; }
  .hero-title .ai-italic { font-style: italic; font-family: 'EB Garamond', Georgia, serif; }
  .hero-subtitle { font-size: 13px; color: rgba(255,255,255,0.85); margin-bottom: 24px; line-height: 1.5; }
  .hero-menu { display: flex; flex-direction: column; gap: 0; }
  .hero-menu-item {
    display: flex; align-items: baseline; justify-content: space-between;
    font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.9);
    border-bottom: 1px solid rgba(255,255,255,0.12); padding: 4px 0;
    cursor: pointer; transition: color 0.15s;
  }
  .hero-menu-item:hover { color: var(--white); }
  .hero-menu-num { font-size: 10px; color: rgba(255,255,255,0.4); }

  /* CONTENT WRAPPER */
  .content { margin-left: 160px; }

  /* SECTION BASE */
  .section { min-height: 100vh; padding: 80px 60px 80px 0; }
  .section-header { margin-bottom: 48px; }
  .section-big-title {
    font-family: var(--serif); font-size: clamp(52px, 8vw, 96px);
    color: var(--ink); font-weight: 400; line-height: 1.0;
    margin-bottom: 0;
  }
  .section-big-title em { font-style: italic; }
  .section-big-title .drop-cap-script {
    font-family: 'EB Garamond', Georgia, serif;
    font-style: italic; font-size: 1.3em; line-height: 0.8;
    vertical-align: -0.15em;
  }
  .section-label { font-size: 13px; font-weight: 600; color: var(--ink); margin-bottom: 8px; letter-spacing: 0.01em; }
  .section-desc { font-size: 15px; line-height: 1.65; color: var(--ink-muted); max-width: 480px; }

  /* SIDEKICK SECTION */
  .sidekick-hero {
    position: relative; width: 100%; height: 75vh;
    background: #0a0818; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    flex-direction: column;
  }
  .sk-stars {
    position: absolute; inset: 0; overflow: hidden;
  }
  .sk-star {
    position: absolute; background: white; border-radius: 50%;
    animation: starTwinkle var(--dur, 3s) ease-in-out infinite var(--delay, 0s);
  }
  @keyframes starTwinkle {
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.5); }
  }
  .sk-figure {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, transparent 0%, rgba(80,40,120,0.3) 50%, transparent 100%);
    display: flex; align-items: center; justify-content: center;
  }
  .sk-figure-body {
    width: 340px; height: 420px; position: relative;
    background: linear-gradient(160deg, #9040a0 0%, #7030a0 30%, #501080 60%, #3a0868 100%);
    clip-path: polygon(30% 0%, 70% 0%, 85% 12%, 88% 45%, 72% 62%, 74% 100%, 26% 100%, 28% 62%, 12% 45%, 15% 12%);
  }
  .sk-mask {
    position: absolute; top: 5%; left: 25%; width: 50%; height: 18%;
    background: #7030c8; border-radius: 40% 40% 60% 60%;
    clip-path: polygon(0 40%, 15% 0%, 85% 0%, 100% 40%, 85% 100%, 15% 100%);
  }
  .sk-laptop {
    position: absolute; bottom: 5%; left: 15%; right: 15%; height: 28%;
    background: linear-gradient(180deg, #d0d0d0 0%, #b0b0b0 100%);
    border-radius: 4px 4px 0 0;
  }
  .sk-laptop-screen {
    position: absolute; inset: 8px 8px 0 8px; bottom: 2px;
    background: #1a1a2e; border-radius: 2px;
  }
  .sk-globe {
    position: absolute; bottom: 8%; left: 8%; width: 100px; height: 100px;
    border-radius: 50%; background: linear-gradient(135deg, #d4a020, #a07010);
    display: flex; align-items: center; justify-content: center; overflow: hidden;
  }
  .sk-globe::before {
    content: ''; position: absolute; inset: 0; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.4);
    box-shadow: inset 0 0 20px rgba(0,0,0,0.3);
  }
  .sk-globe-ring {
    position: absolute; width: 130%; height: 30%; top: 35%;
    border-top: 2px solid rgba(255,255,255,0.3);
    border-bottom: 2px solid rgba(255,255,255,0.3);
    transform: rotate(-20deg);
  }
  .sk-big-text {
    position: absolute; top: 4%; left: 0; right: 0;
    font-family: var(--serif); font-size: clamp(80px, 12vw, 140px);
    color: rgba(255,255,255,0.08); text-align: center;
    font-weight: 400; line-height: 1;
    pointer-events: none; user-select: none;
    animation: fadeSlideDown 1s ease both;
  }
  .sk-big-text-visible {
    position: absolute; top: 4%; left: 5%; right: 5%;
    font-family: var(--serif); font-size: clamp(60px, 9vw, 110px);
    color: var(--white); text-align: center;
    font-weight: 400; line-height: 1;
    animation: fadeSlideDown 0.8s ease both;
  }
  .sk-quote {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 32px; text-align: center;
    background: linear-gradient(0deg, rgba(10,8,24,0.9) 0%, transparent 100%);
  }
  .sk-quote p {
    font-family: var(--serif); font-style: italic;
    font-size: clamp(18px, 3vw, 28px); color: rgba(255,255,255,0.9);
    line-height: 1.4; max-width: 760px; margin: 0 auto;
  }
  .sk-quote p em { font-style: normal; }

  /* Content sections on cream bg */
  .cream-section {
    background: var(--cream); padding: 80px 60px 80px 0;
  }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
  .three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }

  /* Feature card */
  .feat-card {
    background: var(--cream-light); border: 1px solid var(--cream-dark);
    border-radius: 8px; overflow: hidden;
  }
  .feat-card-img {
    height: 220px; position: relative; overflow: hidden;
    background: linear-gradient(135deg, #2a3020 0%, #1a2010 100%);
  }
  .feat-card-body { padding: 20px; }
  .feat-card-title { font-size: 14px; font-weight: 600; margin-bottom: 6px; }
  .feat-card-desc { font-size: 13px; color: var(--ink-muted); line-height: 1.5; }

  /* UI mockup */
  .ui-mock {
    background: white; border-radius: 10px; overflow: hidden;
    border: 1px solid rgba(0,0,0,0.1); box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  }
  .ui-mock-bar {
    height: 36px; background: #1a1a1a; display: flex; align-items: center;
    padding: 0 12px; gap: 8px;
  }
  .ui-mock-dot { width: 8px; height: 8px; border-radius: 50%; }
  .ui-mock-search {
    flex: 1; height: 22px; background: rgba(255,255,255,0.1);
    border-radius: 4px; margin: 0 8px;
    display: flex; align-items: center; padding: 0 8px;
    font-size: 11px; color: rgba(255,255,255,0.5);
  }
  .ui-mock-body { padding: 0; display: flex; }
  .ui-mock-sidebar {
    width: 160px; background: #f5f5f5; padding: 12px 0;
    border-right: 1px solid #e8e8e8; flex-shrink: 0;
  }
  .ui-mock-nav-item {
    display: flex; align-items: center; gap: 8px; padding: 7px 14px;
    font-size: 12px; color: #555; cursor: pointer;
  }
  .ui-mock-nav-item.active { background: #e8e8e8; color: #111; font-weight: 500; }
  .ui-mock-main { flex: 1; padding: 16px; }

  /* Pulse widget */
  .pulse-widget {
    background: white; border-radius: 8px;
    border: 1px solid #e0e0e0; overflow: hidden;
  }
  .pulse-header {
    padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid #f0f0f0;
  }
  .pulse-badge {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: #555;
  }
  .pulse-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; animation: pulseDot 2s ease-in-out infinite; }
  @keyframes pulseDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  .pulse-actions-btn {
    font-size: 11px; background: #f0f0f0; border: none; border-radius: 4px;
    padding: 3px 8px; cursor: pointer; color: #555; font-family: var(--sans);
  }
  .pulse-content { padding: 16px; }
  .pulse-heading { font-family: var(--serif); font-size: 22px; font-weight: 400; margin-bottom: 8px; }
  .pulse-subtext { font-size: 12px; color: #888; line-height: 1.5; }

  /* Chat bubble */
  .chat-bubble {
    display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px;
    animation: fadeSlideUp 0.5s ease both;
  }
  .chat-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, #7040e0, #9060f0);
    flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    font-size: 12px; color: white; font-weight: 600;
  }
  .chat-text {
    background: white; border-radius: 0 12px 12px 12px;
    padding: 10px 14px; font-size: 13px; line-height: 1.5;
    color: #222; border: 1px solid #e8e8e8; flex: 1;
  }
  .chat-tag {
    display: inline-block; font-size: 10px; padding: 2px 7px; border-radius: 20px;
    font-weight: 600; margin-top: 4px; margin-right: 4px;
  }
  .chat-send {
    width: 26px; height: 26px; border-radius: 50%;
    background: linear-gradient(135deg, #7040e0, #9060f0);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; cursor: pointer; align-self: flex-end;
  }

  /* Read help doc button */
  .help-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; padding: 7px 14px; border: 1px solid var(--ink);
    border-radius: 4px; color: var(--ink); background: transparent;
    cursor: pointer; font-family: var(--sans); margin-top: 20px;
    transition: background 0.15s, color 0.15s;
  }
  .help-btn:hover { background: var(--ink); color: var(--cream); }

  /* Agentic section */
  .agentic-hero {
    position: relative; overflow: hidden;
    min-height: 55vh; background: var(--cream);
    display: flex; align-items: flex-end; padding-bottom: 0;
  }
  .agentic-bg {
    position: absolute; inset: 0;
    background: 
      radial-gradient(ellipse 70% 60% at 50% 50%, rgba(180,200,180,0.4) 0%, transparent 60%),
      linear-gradient(180deg, #d4d8c0 0%, #c0c4a8 100%);
  }
  .agentic-figure-group {
    position: absolute; right: 0; top: 0; bottom: 0; width: 60%;
    overflow: hidden;
  }
  .agentic-figure {
    position: absolute; right: 5%; top: 0; bottom: 0;
    width: 340px;
    background: linear-gradient(180deg, #c8a870 0%, #a08050 40%, #806040 80%, transparent 100%);
    clip-path: polygon(25% 0%, 75% 0%, 90% 20%, 92% 60%, 78% 75%, 80% 100%, 20% 100%, 22% 75%, 8% 60%, 10% 20%);
  }
  .agentic-content { position: relative; z-index: 2; padding: 100px 0 60px 0; width: 50%; }

  /* Command cloud */
  .cmd-cloud {
    position: relative; min-height: 320px;
    display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
    gap: 0; padding: 40px 0;
  }
  .cmd-item {
    position: absolute; font-family: var(--serif);
    color: var(--ink); cursor: default; transition: opacity 0.3s;
    white-space: nowrap;
  }
  .cmd-item:hover { opacity: 1 !important; }

  /* Store mockup */
  .store-mock {
    border-radius: 8px; overflow: hidden;
    border: 1px solid rgba(0,0,0,0.1);
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  }
  .store-nav-bar {
    background: #1a1a1a; padding: 10px 16px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .store-nav-logo { font-size: 14px; font-weight: 700; color: white; letter-spacing: 0.05em; }
  .store-hero-img {
    height: 200px; background: linear-gradient(135deg, #2a3a4a 0%, #1a2a3a 100%);
    display: flex; align-items: center; padding: 24px;
    position: relative; overflow: hidden;
  }
  .store-hero-text h3 { font-size: 22px; font-weight: 700; color: white; line-height: 1.2; }
  .store-shop-btn {
    margin-top: 12px; display: inline-block;
    border: 1.5px solid white; color: white; padding: 6px 16px;
    font-size: 11px; letter-spacing: 0.08em; font-weight: 600;
    background: transparent; cursor: pointer; font-family: var(--sans);
  }
  .store-products {
    background: white; padding: 16px; display: grid;
    grid-template-columns: repeat(5, 1fr); gap: 10px;
  }
  .store-product { text-align: center; }
  .store-product-img {
    width: 100%; aspect-ratio: 1; border-radius: 6px;
    background: #f0f0f0; margin-bottom: 6px; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
  }
  .store-product-name { font-size: 10px; color: #333; line-height: 1.3; }
  .store-product-price { font-size: 10px; color: #666; }

  /* Target rings animation */
  .target-rings {
    position: absolute; left: 30px; top: 50%; transform: translateY(-50%);
    width: 160px; height: 160px;
  }
  .ring {
    position: absolute; border: 1.5px solid rgba(80,80,200,0.35);
    border-radius: 50%; animation: ringExpand 3s ease-in-out infinite;
  }
  @keyframes ringExpand {
    0% { transform: scale(0.5); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: scale(1); opacity: 0; }
  }

  /* Marketing — command scatter */
  .scatter-area {
    position: relative; height: 320px; overflow: hidden;
  }
  .scatter-cmd {
    position: absolute; font-family: var(--serif);
    color: var(--ink-muted); pointer-events: none;
    animation: scatterFloat var(--dur) ease-in-out infinite var(--delay);
  }
  @keyframes scatterFloat {
    0%, 100% { transform: translateY(0); opacity: var(--op); }
    50% { transform: translateY(-8px); opacity: calc(var(--op) + 0.15); }
  }

  /* Rollout timeline */
  .rollout-layout {
    display: grid; grid-template-columns: 1fr auto; gap: 40px; align-items: start;
  }
  .rollout-timeline {
    display: flex; flex-direction: column; align-items: center;
    padding: 80px 32px;
  }
  .timeline-line {
    width: 1.5px; background: var(--ink); flex: 1; min-height: 200px;
    position: relative;
  }
  .timeline-node {
    width: 10px; height: 10px; border-radius: 50%;
    border: 1.5px solid var(--ink); background: var(--cream);
    margin: 0; position: relative; z-index: 1;
  }
  .timeline-label {
    background: var(--cream-light); border: 1px solid var(--cream-dark);
    border-radius: 6px; padding: 10px 14px; white-space: nowrap;
    position: absolute; left: 24px; top: 50%; transform: translateY(-50%);
    min-width: 200px;
  }
  .timeline-label-header {
    display: flex; align-items: center; gap: 6px; margin-bottom: 4px;
  }
  .timeline-cal-icon { font-size: 11px; }
  .timeline-date { font-size: 12px; font-weight: 600; color: var(--ink); }
  .timeline-desc { font-size: 11px; color: var(--ink-muted); }
  .timeline-toggle {
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; color: var(--ink-muted); margin-top: 6px;
  }
  .timeline-switch {
    width: 28px; height: 14px; background: var(--ink); border-radius: 7px;
    position: relative; cursor: pointer;
  }
  .timeline-switch::after {
    content: ''; position: absolute; top: 2px; right: 3px;
    width: 10px; height: 10px; border-radius: 50%; background: white;
  }

  /* Animations */
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeSlideDown {
    from { opacity: 0; transform: translateY(-16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .reveal {
    opacity: 0; transform: translateY(30px);
    transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal.visible { opacity: 1; transform: none; }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }
  .reveal-delay-4 { transition-delay: 0.4s; }

  /* SimGym section */
  .simgym-section { position: relative; overflow: hidden; }
  .simgym-wave {
    position: absolute; bottom: 0; left: 0; right: 0; height: 200px;
    background: linear-gradient(180deg, transparent 0%, #2a1a0a 40%, #1a0a00 100%);
    clip-path: polygon(0 60%, 5% 40%, 12% 55%, 20% 35%, 28% 50%, 35% 30%, 42% 48%, 50% 25%, 58% 45%, 65% 28%, 72% 50%, 80% 32%, 87% 52%, 95% 38%, 100% 55%, 100% 100%, 0 100%);
  }

  /* Feedback bubbles */
  .feedback-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
    position: relative;
  }
  .feedback-card {
    background: white; border-radius: 8px; padding: 12px 14px;
    border: 1px solid #e8e8e8;
    animation: fadeSlideUp 0.6s ease both;
  }
  .feedback-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .feedback-avatar { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; }
  .feedback-text { font-size: 12px; color: #333; line-height: 1.45; margin-bottom: 8px; }
  .feedback-tags { display: flex; gap: 4px; flex-wrap: wrap; }
  .feedback-tag {
    font-size: 10px; padding: 2px 7px; border-radius: 20px;
    font-weight: 500;
  }
  .tag-blue { background: #e8f0fe; color: #1a56c4; }
  .tag-gray { background: #f0f0f0; color: #555; }
  .tag-green { background: #e8f5e9; color: #2e7d32; }

  /* Shimmer loading */
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .shimmer {
    background: linear-gradient(90deg, #e8e5de 25%, #f0ede6 50%, #e8e5de 75%);
    background-size: 200% 100%; animation: shimmer 1.8s infinite;
    border-radius: 4px;
  }
    /* Prompt overlay bars for mockups */
  .sk-prompt-bar {
    position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
    width: 85%; max-width: 320px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 30px; padding: 6px 6px 6px 12px;
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 12px 32px rgba(0,0,0,0.15);
    border: 1px solid rgba(255,255,255,0.4);
    z-index: 10;
  }
  .sk-prompt-icon {
    width: 18px; height: 18px; border-radius: 50%;
    background: linear-gradient(135deg, #7040e0, #9060f0);
    flex-shrink: 0;
  }
  .sk-prompt-text {
    font-size: 11px; color: #111; flex: 1;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    font-weight: 500;
  }
  .sk-prompt-submit {
    width: 24px; height: 24px; border-radius: 50%;
    background: linear-gradient(135deg, #7040e0, #9060f0);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  
  /* Helper for the 3-column UI grids */
  .mock-grid-3 {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
    margin-top: 16px;
  }
  .mock-img-box {
    position: relative; height: 220px; border-radius: 8px; overflow: hidden;
    border: 1px solid rgba(0,0,0,0.08);
  }
    .sk-nebula {
  position: absolute; top: 10%; left: 30%; width: 60%; height: 55%;
  background: radial-gradient(ellipse 80% 70% at 50% 40%, rgba(140,100,30,.28) 0%, rgba(180,130,40,.12) 40%, transparent 70%);
  z-index: 2; pointer-events: none;
}
.sk-sphere-wrap { position: absolute; left: 4%; bottom: 6%; z-index: 4; width: 160px; height: 160px; }
.sk-sphere { position: relative; width: 160px; height: 160px; }
.sk-ring { position: absolute; border-radius: 50%; border: 3px solid rgba(200,160,40,.75); top: 50%; left: 50%; transform: translate(-50%,-50%); width: 150px; height: 150px; }
.sk-ring-1 { transform: translate(-50%,-50%) rotate(25deg); }
.sk-ring-2 { transform: translate(-50%,-50%) rotateX(70deg); border-color: rgba(180,140,30,.5); }
.sk-ring-3 { transform: translate(-50%,-50%) rotateY(70deg) rotate(10deg); border-color: rgba(160,120,25,.45); }
.sk-globe-core { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 90px; height: 90px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #c8a030, #8a6010 55%, #5a3a08 100%); }
.sk-globe-line { position: absolute; top: 50%; left: 50%; border-radius: 50%; border-top: 1.5px solid rgba(255,255,255,.3); }
.sk-globe-l1 { width: 88px; height: 88px; margin: -44px 0 0 -44px; }
.sk-globe-l2 { width: 88px; height: 88px; margin: -44px 0 0 -44px; transform: rotate(60deg); }
.sk-globe-l3 { width: 88px; height: 88px; margin: -44px 0 0 -44px; transform: rotate(120deg); }
.sk-globe-eq { position: absolute; top: 50%; left: 50%; width: 90px; height: 20px; margin: -10px 0 0 -45px; border-top: 1.5px solid rgba(255,255,255,.25); border-bottom: 1.5px solid rgba(255,255,255,.25); }
.sk-stand { position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); width: 4px; height: 20px; background: linear-gradient(180deg,rgba(200,160,40,.8),rgba(160,120,30,.4)); }
.sk-stand-base { position: absolute; bottom: -24px; left: 50%; transform: translateX(-50%); width: 40px; height: 6px; border-radius: 3px; background: rgba(180,140,30,.6); }
.sk-laptop-wrap { position: absolute; left: 14%; bottom: 3%; z-index: 4; width: 220px; }
.sk-laptop-lid { width: 220px; height: 140px; background: linear-gradient(160deg,#c8c4be,#a0a09a); border-radius: 6px 6px 0 0; position: relative; overflow: hidden; }
.sk-laptop-screen { position: absolute; inset: 8px 10px 4px 10px; background: #0a0a18; border-radius: 3px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.sk-screen-inner { width: 100%; height: 100%; background: linear-gradient(135deg,#1a2a3a,#0a1a2a); display: flex; flex-direction: column; padding: 6px; }
.sk-screen-bar { height: 8px; background: #1a1a1a; border-radius: 2px; margin-bottom: 4px; display: flex; gap: 3px; align-items: center; padding: 0 4px; }
.sk-screen-dot { width: 4px; height: 4px; border-radius: 50%; }
.sk-screen-row { height: 2px; background: rgba(255,255,255,.08); border-radius: 1px; margin: 2px 0; }
.sk-laptop-hinge { width: 220px; height: 3px; background: linear-gradient(90deg,#888 0%,#aaa 20%,#888 100%); }
.sk-laptop-base { width: 220px; height: 14px; background: linear-gradient(180deg,#b0b0aa,#909090); border-radius: 0 0 4px 4px; }
.sk-robe { position: absolute; right: 5%; bottom: 0; width: 340px; height: 520px; }
.sk-robe-body { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 280px; height: 460px; background: linear-gradient(170deg,#6b2d8a 0%,#4a1a6e 30%,#3a1258 60%,#2a0a42 100%); clip-path: polygon(30% 0%,70% 0%,88% 18%,92% 55%,80% 72%,82% 100%,18% 100%,20% 72%,8% 55%,12% 18%); }
.sk-robe-collar { position: absolute; top: 8%; left: 50%; transform: translateX(-50%); width: 200px; height: 60px; background: linear-gradient(180deg,#e8d070,#c8a830 50%,#a88020 100%); clip-path: polygon(20% 0%,80% 0%,90% 40%,70% 100%,50% 85%,30% 100%,10% 40%); opacity: .9; }
.sk-robe-shirt { position: absolute; top: 6%; left: 50%; transform: translateX(-50%); width: 100px; height: 40px; background: #f0ece0; clip-path: polygon(20% 0%,80% 0%,90% 60%,50% 100%,10% 60%); }
.sk-head { position: absolute; bottom: 72%; left: 50%; transform: translateX(-50%); width: 100px; height: 120px; background: linear-gradient(160deg,#d4a880,#c09060 50%,#a07040 100%); border-radius: 50% 50% 45% 45%; }
.sk-hair { position: absolute; top: -20px; left: -10px; width: 120px; height: 80px; background: linear-gradient(180deg,#3a2010,#2a1808 60%,transparent 100%); border-radius: 50% 50% 30% 30%; }
.sk-mask { position: absolute; top: 22%; left: 50%; transform: translateX(-50%); width: 80px; height: 28px; background: #7030b8; clip-path: polygon(0 40%,12% 0%,88% 0%,100% 40%,88% 100%,50% 80%,12% 100%); }
.sk-eye-l, .sk-eye-r { position: absolute; top: 30%; width: 20px; height: 10px; background: #0a0818; border-radius: 50%; }
.sk-eye-l { left: 22%; }
.sk-eye-r { right: 22%; }
.sk-figure-wrap { position: absolute; right: 0; top: 0; bottom: 0; width: 55%; z-index: 3; }  

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--cream-dark); border-radius: 2px; }
`;


/* ─── STARS ─── */
function Stars({ count = 40 }) {
  const stars = useRef([]);
  if (!stars.current.length) {
    stars.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      dur: (Math.random() * 3 + 2).toFixed(1) + "s",
      delay: (Math.random() * 3).toFixed(1) + "s",
    }));
  }
  return (
    <div className="sk-stars">
      {stars.current.map((s) => (
        <div
          key={s.id}
          className="sk-star"
          style={{
            left: s.x + "%",
            top: s.y + "%",
            width: s.size + "px",
            height: s.size + "px",
            "--dur": s.dur,
            "--delay": s.delay,
          }}
        />
      ))}
    </div>
  );
}


/* ─── HERO ─── */
function Hero({ onSectionClick }) {
  return (
    <section className="hero">
      {/* Real Shopify image background */}
      <div className="hero-bg" />

  

      {/* Hidden legacy CSS-only elements */}
      <div className="hero-painting" />
      <div className="hero-sky" />

    

      
    </section>
  );
}
/* ─── SIDEKICK SECTION ─── */
function SidekickSection() {
  const [ref, visible] = useScrollReveal(0.1);
  const [chatStep, setChatStep] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const t1 = setTimeout(() => setChatStep(1), 600);
    const t2 = setTimeout(() => setChatStep(2), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [visible]);

  const skCommands = [
    { text: "/marketing-mix", size: 22, x: "10%", y: "15%", op: 0.9 },
    { text: "/bundle-finder", size: 28, x: "35%", y: "25%", op: 1 },
    { text: "/checkout-drops", size: 18, x: "70%", y: "20%", op: 0.7 },
    { text: "/social-posts", size: 24, x: "15%", y: "55%", op: 0.85 },
    { text: "/win-back", size: 16, x: "50%", y: "45%", op: 0.65 },
    { text: "/brand-image", size: 14, x: "80%", y: "50%", op: 0.55 },
    { text: "/email-campaign", size: 16, x: "35%", y: "75%", op: 0.6 },
    { text: "/go-global", size: 20, x: "65%", y: "80%", op: 0.75 },
    { text: "/inventory-check", size: 15, x: "85%", y: "10%", op: 0.5 }
  ];

  return (
    <section id="sidekick" ref={ref}>
      {/* Dark hero */}
   {/* Replace the existing <div className="sidekick-hero"> block with: */}
<div className="sidekick-hero">
  <Stars count={55} />
  <div className="sk-nebula" />

  <div className="sk-big-text">Sidekick</div>
  <div className="sk-big-text-visible" style={{ top: "3%" }}>Sidekick</div>

  {/* Armillary sphere — bottom left */}
  <div className="sk-sphere-wrap">
    <div className="sk-sphere">
      <div className="sk-ring sk-ring-1" />
      <div className="sk-ring sk-ring-2" />
      <div className="sk-ring sk-ring-3" />
      <div className="sk-globe-core">
        <div className="sk-globe-line sk-globe-l1" />
        <div className="sk-globe-line sk-globe-l2" />
        <div className="sk-globe-line sk-globe-l3" />
        <div className="sk-globe-eq" />
      </div>
    </div>
    <div className="sk-stand" />
    <div className="sk-stand-base" />
  </div>

  {/* Laptop mockup — lower left */}
  <div className="sk-laptop-wrap">
    <div className="sk-laptop-lid">
      <div className="sk-laptop-screen">
        <div className="sk-screen-inner">
          <div className="sk-screen-bar">
            <div className="sk-screen-dot" style={{ background: "#ff5f57" }} />
            <div className="sk-screen-dot" style={{ background: "#ffbd2e" }} />
            <div className="sk-screen-dot" style={{ background: "#28c840" }} />
          </div>
          <div style={{ display: "flex", flex: 1, gap: 4 }}>
            <div style={{ width: 28, background: "rgba(255,255,255,.04)", borderRadius: 1, flexShrink: 0 }} />
            <div style={{ flex: 1, padding: "3px 4px", display: "flex", flexDirection: "column", gap: 2 }}>
              <div className="sk-screen-row" style={{ width: "70%" }} />
              <div className="sk-screen-row" style={{ width: "50%", background: "rgba(255,255,255,.14)" }} />
              <div className="sk-screen-row" style={{ width: "80%" }} />
              <div style={{ height: 30, background: "rgba(110,70,200,.25)", borderRadius: 2, marginTop: 4 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="sk-laptop-hinge" />
    <div className="sk-laptop-base" />
  </div>

  {/* Renaissance figure with purple mask — right */}
  <div className="sk-figure-wrap">
    <div className="sk-robe">
      <div className="sk-robe-body" />
      <div className="sk-robe-collar" />
      <div className="sk-robe-shirt" />
      <div className="sk-head">
        <div className="sk-hair" />
        <div className="sk-mask">
          <div className="sk-eye-l" />
          <div className="sk-eye-r" />
        </div>
      </div>
    </div>
  </div>

  <div className="sk-quote">
    <p><em>T</em>he AI-powered Shopify expert who's just as<br />obsessed with your business as you are.</p>
  </div>
</div>

      {/* Cream content */}
      <div className="cream-section">
        
        {/* 1. Insights, proactively delivered */}
        <div className={`reveal ${visible ? "visible" : ""}`}>
          <h2 className="section-big-title" style={{ marginBottom: 48 }}>
            <span className="drop-cap-script">I</span>nsights, proactively delivered
          </h2>
        </div>

        <div className="two-col">
          <div className={`reveal reveal-delay-1 ${visible ? "visible" : ""}`}>
            <div className="section-label">Smart suggestions</div>
            <p className="section-desc">
              Sidekick Pulse delivers personalized recommendations and next steps
              for your business using market trends and data from your store.
            </p>
            <button className="help-btn">Read help doc ↗</button>
          </div>

          <div className={`reveal reveal-delay-2 ${visible ? "visible" : ""}`}>
            <div className="ui-mock">
              <div className="ui-mock-bar">
                <div className="ui-mock-dot" style={{ background: "#ff5f57" }} />
                <div className="ui-mock-dot" style={{ background: "#ffbd2e" }} />
                <div className="ui-mock-dot" style={{ background: "#28c840" }} />
                <div className="ui-mock-search">⌘K</div>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>MVSE</span>
              </div>
              <div className="ui-mock-body">
                <div className="ui-mock-sidebar">
                  {["Home", "Orders", "Products", "Customers", "Marketing"].map((item, i) => (
                    <div key={item} className={`ui-mock-nav-item ${i === 0 ? "active" : ""}`}>
                      <span style={{ fontSize: 11 }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="ui-mock-main">
                  <div className="pulse-widget">
                    <div className="pulse-header">
                      <div className="pulse-badge">
                        <div className="pulse-dot" />
                        <span>Pulse</span>
                      </div>
                      <button className="pulse-actions-btn">3 next actions</button>
                    </div>
                    <div className="pulse-content">
                      <div className="pulse-heading">New year momentum:</div>
                      <p className="pulse-subtext">
                        Your January traffic is up 24%. Here are your top recommendations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Complexity, delegated */}
        <div style={{ marginTop: 100 }}>
          <div className={`reveal ${visible ? "visible" : ""}`}>
            <h2 className="section-big-title" style={{ marginBottom: 48 }}>
              <span className="drop-cap-script">C</span>omplexity, delegated
            </h2>
          </div>
          <div className="two-col">
            <div className={`reveal reveal-delay-1 ${visible ? "visible" : ""}`}>
              <div className="section-label">Automated workflows</div>
              <p className="section-desc">
                Get Sidekick to handle repetitive tasks and build custom tools designed specifically for your business needs.
              </p>
              <button className="help-btn">Read help doc ↗</button>
            </div>
            <div className={`reveal reveal-delay-2 ${visible ? "visible" : ""}`}>
              {chatStep >= 1 && (
                <div className="chat-bubble">
                  <div className="chat-avatar">S</div>
                  <div className="chat-text">
                    Create a bulk B2B company importer that uploads companies from a CSV file.
                  </div>
                  <div className="chat-send">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 10V2M6 2L2 6M6 2L10 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              )}
              {chatStep >= 2 && (
                <div className="chat-bubble" style={{ animationDelay: "0.2s" }}>
                  <div className="chat-avatar" style={{ background: "linear-gradient(135deg, #7040e0, #5020c0)" }}>AI</div>
                  <div className="chat-text">
                    I'll create a B2B importer app for you. Building the CSV parser and company creation workflow now...
                    <div style={{ marginTop: 8 }}>
                      <span className="chat-tag" style={{ background: "#f0eaff", color: "#7040e0", fontSize: 10, padding: "2px 7px", borderRadius: 20 }}>
                        Building app
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Designs, refined */}
        <div style={{ marginTop: 100 }}>
          <div className={`reveal ${visible ? "visible" : ""}`}>
            <h2 className="section-big-title" style={{ marginBottom: 48 }}>
              <span className="drop-cap-script">D</span>esigns, refined
            </h2>
          </div>
          <div className="two-col" style={{ alignItems: "flex-start" }}>
            <div className={`reveal reveal-delay-1 ${visible ? "visible" : ""}`}>
              <div className="section-label">Theme edits</div>
              <p className="section-desc">
                Tell Sidekick to easily adjust design elements on your storefront—from changing colors and layouts to adding entirely new sections.
              </p>
              <button className="help-btn">Read help doc ↗</button>
            </div>

            <div className={`reveal reveal-delay-2 ${visible ? "visible" : ""}`}>
              {/* Store Mockup centered */}
              <div className="store-mock">
                <div className="store-nav-bar">
                  <div style={{ display: "flex", gap: 20, fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                    {["ALL", "APPAREL", "SKATE"].map(t => <span key={t} style={{ cursor: "pointer" }}>{t}</span>)}
                  </div>
                  <div className="store-nav-logo">mrse</div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>🔍</span>
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>🛒</span>
                  </div>
                </div>
                <div className="store-hero-img">
                  <div className="target-rings">
                    {[60, 90, 120, 150].map((s, i) => (
                      <div key={i} className="ring" style={{ width: s, height: s, top: `calc(50% - ${s / 2}px)`, left: `calc(50% - ${s / 2}px)`, animationDelay: (i * 0.6) + "s", animationDuration: "3s" }} />
                    ))}
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 28, height: 28, borderRadius: "50%", border: "2px solid rgba(80,80,200,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(80,80,200,0.7)" }} />
                    </div>
                  </div>
                  <div className="store-hero-text" style={{ marginLeft: 180 }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", marginBottom: 6 }}>SPRING 26 LOOKBOOK</div>
                    <h3>PUSHING<br />BOUNDARIES</h3>
                    <div className="store-shop-btn">SHOP NOW</div>
                  </div>
                </div>
                <div className="store-products">
                  {[
                    { name: "Ye Ole Skateboard Deck", price: "$70" },
                    { name: "MVSE Vergier Beanie", price: "$28" },
                    { name: "Clandestino Deck", price: "$80" },
                    { name: "MVSE Forte Wheels", price: "$48" },
                    { name: "Freedom Deck", price: "$60" },
                  ].map((p, i) => (
                    <div key={i} className="store-product">
                      <div className="store-product-img">
                        <div style={{ width: "60%", height: "70%", background: ["#2a2a2a", "#3a4a2a", "#1a1a2a", "#5040a0", "#2a3a2a"][i], borderRadius: 4 }} />
                      </div>
                      <div className="store-product-name">{p.name}</div>
                      <div className="store-product-price">{p.price}.00</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Bottom 3 Mockups with Chat Overlays */}
              <div className="mock-grid-3">
                <div className="mock-img-box" style={{ background: "linear-gradient(135deg, #1a3a4a, #2a5a6a)" }}>
                  <div className="sk-prompt-bar">
                    <div className="sk-prompt-icon" />
                    <span className="sk-prompt-text">Make this an image with...</span>
                    <div className="sk-prompt-submit"><svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M4 7V1M4 1L1 4M4 1L7 4" stroke="white" strokeWidth="1.2" /></svg></div>
                  </div>
                </div>
                <div className="mock-img-box" style={{ background: "linear-gradient(135deg, #4a5a3a, #2a3a1a)" }}>
                  <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", width: "70%", height: "80%", background: "#fff", borderRadius: "12px 12px 0 0", border: "1px solid #ddd" }}>
                    <div style={{ height: 20, background: "#111", borderRadius: "12px 12px 0 0" }} />
                  </div>
                  <div className="sk-prompt-bar">
                    <div className="sk-prompt-icon" />
                    <span className="sk-prompt-text">Make the navigation...</span>
                    <div className="sk-prompt-submit"><svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M4 7V1M4 1L1 4M4 1L7 4" stroke="white" strokeWidth="1.2" /></svg></div>
                  </div>
                </div>
                <div className="mock-img-box" style={{ background: "linear-gradient(135deg, #501040, #300a20)" }}>
                  <div style={{ position: "absolute", top: 40, left: 20, right: 20, height: 100, background: "rgba(255,255,255,0.1)", borderRadius: 6 }} />
                  <div className="sk-prompt-bar">
                    <div className="sk-prompt-icon" />
                    <span className="sk-prompt-text">Add the SS26 lookbook to...</span>
                    <div className="sk-prompt-submit"><svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M4 7V1M4 1L1 4M4 1L7 4" stroke="white" strokeWidth="1.2" /></svg></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Extensive tooling applied */}
        <div style={{ marginTop: 100 }}>
          <div className={`reveal ${visible ? "visible" : ""}`}>
            <h2 className="section-big-title" style={{ marginBottom: 48 }}>
              <span className="drop-cap-script">E</span>xtensive tooling applied
            </h2>
          </div>
          <div className="two-col" style={{ alignItems: "flex-start" }}>
            <div className={`reveal reveal-delay-1 ${visible ? "visible" : ""}`}>
              <div className="section-label">Prompt commands</div>
              <p className="section-desc">
                Access 150+ commands designed to help you run and grow your business faster. Just type `/` to pull up actions.
              </p>
              <button className="help-btn">Read help doc ↗</button>
            </div>

            <div className={`reveal reveal-delay-2 ${visible ? "visible" : ""}`}>
              {/* Command Scatter Area */}
              <div className="scatter-area" style={{ height: 260, marginBottom: 20 }}>
                {skCommands.map((cmd, i) => (
                  <div
                    key={cmd.text}
                    className="scatter-cmd"
                    style={{
                      left: cmd.x, top: cmd.y, fontSize: cmd.size,
                      "--op": cmd.op, "--dur": (3 + (i % 4)) + "s", "--delay": (i * 0.3 % 3) + "s",
                      opacity: cmd.op,
                    }}
                  >
                    {cmd.text}
                  </div>
                ))}
              </div>

              {/* Bottom 2 mockups */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="mock-img-box" style={{ background: "linear-gradient(135deg, #6a4a3a, #3a2a1a)" }}>
                  {/* Decorative product circle */}
                  <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", width: 100, height: 100, background: "#fff", borderRadius: "50%", opacity: 0.1 }} />
                  <div className="sk-prompt-bar" style={{ width: "90%" }}>
                    <div className="sk-prompt-icon" />
                    <span className="sk-prompt-text">Show me the highest margi...</span>
                    <div className="sk-prompt-submit"><svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M4 7V1M4 1L1 4M4 1L7 4" stroke="white" strokeWidth="1.2" /></svg></div>
                  </div>
                </div>
                <div className="mock-img-box" style={{ background: "linear-gradient(135deg, #a0b090, #506040)" }}>
                  {/* Mobile app icon mock */}
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 64, height: 64, background: "#fff", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
                     <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #7040e0, #9060f0)" }} />
                  </div>
                  <div className="sk-prompt-bar" style={{ width: "90%" }}>
                    <div className="sk-prompt-icon" />
                    <span className="sk-prompt-text">Summarize my top perform...</span>
                    <div className="sk-prompt-submit"><svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M4 7V1M4 1L1 4M4 1L7 4" stroke="white" strokeWidth="1.2" /></svg></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─── ONLINE / AGENTIC SECTION ─── */
function AgenticSection() {
  const [ref, visible] = useScrollReveal(0.1);

  const commands = [
    { text: "/marketing-mix", size: 22, x: "42%", y: "18%", op: 0.9 },
    { text: "/bundle-finder", size: 28, x: "58%", y: "35%", op: 1 },
    { text: "/checkout-drops", size: 18, x: "30%", y: "45%", op: 0.7 },
    { text: "/social-posts", size: 24, x: "62%", y: "55%", op: 0.85 },
    { text: "/win-back", size: 16, x: "48%", y: "10%", op: 0.65 },
    { text: "/retention-check", size: 14, x: "28%", y: "22%", op: 0.6 },
    { text: "/brand-image", size: 14, x: "18%", y: "38%", op: 0.55 },
    { text: "/email-campaign", size: 16, x: "36%", y: "62%", op: 0.6 },
    { text: "/promo-setup", size: 13, x: "12%", y: "15%", op: 0.5 },
    { text: "/go-global", size: 20, x: "65%", y: "70%", op: 0.75 },
    { text: "/discount-strategy", size: 13, x: "10%", y: "55%", op: 0.45 },
    { text: "/gift-guide", size: 15, x: "45%", y: "75%", op: 0.6 },
    { text: "/new-buyer", size: 14, x: "32%", y: "80%", op: 0.55 },
    { text: "/return-patterns", size: 12, x: "8%", y: "72%", op: 0.4 },
    { text: "/build-collections", size: 14, x: "22%", y: "68%", op: 0.5 },
    { text: "/product-deep-dive", size: 13, x: "28%", y: "56%", op: 0.5 },
    { text: "/inventory-check", size: 16, x: "65%", y: "8%", op: 0.7 },
  ];

  return (
    <section id="agentic" ref={ref}>
      <div className="cream-section">
        <div className={`reveal ${visible ? "visible" : ""}`}>
          <h2 className="section-big-title" style={{ marginBottom: 16 }}>
            <span className="drop-cap-script">A</span>gentic commerce
          </h2>
          <p className="section-desc" style={{ marginBottom: 48 }}>
            AI agents that act on your behalf across your entire business.
          </p>
        </div>

        {/* Command cloud */}
        <div className={`reveal reveal-delay-1 ${visible ? "visible" : ""}`}>
          <div className="scatter-area">
            {commands.map((cmd, i) => (
              <div
                key={cmd.text}
                className="scatter-cmd"
                style={{
                  left: cmd.x,
                  top: cmd.y,
                  fontSize: cmd.size,
                  "--op": cmd.op,
                  "--dur": (3 + (i % 4)) + "s",
                  "--delay": (i * 0.3 % 3) + "s",
                  opacity: cmd.op,
                }}
              >
                {cmd.text}
              </div>
            ))}
          </div>
        </div>

        {/* Two product demos */}
        <div style={{ marginTop: 60 }}>
          <div className="two-col">
            <div className={`reveal reveal-delay-1 ${visible ? "visible" : ""}`}>
              <div className="feat-card">
                <div
                  className="feat-card-img"
                  style={{
                    background: "linear-gradient(135deg, #1a2a1a 0%, #0a1a0a 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", overflow: "hidden",
                  }}
                >
                  {/* Botanical leaf texture */}
                  {[...Array(5)].map((_, i) => (
                    <div key={i} style={{
                      position: "absolute",
                      width: `${60 + i * 20}px`, height: `${80 + i * 15}px`,
                      left: `${i * 22}%`, top: `${10 + i * 5}%`,
                      background: `rgba(40,80,40,${0.4 + i * 0.1})`,
                      borderRadius: "50% 50% 50% 0",
                      transform: `rotate(${i * 30 - 30}deg)`,
                    }} />
                  ))}
                  <div style={{
                    position: "absolute", bottom: 16, left: 16, right: 16,
                    background: "rgba(255,255,255,0.95)", borderRadius: 8, padding: "12px 14px",
                  }}>
                    <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>New exploration</div>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "6px 10px",
                      background: "white", border: "1px solid #e0e0e0", borderRadius: 20,
                    }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg, #7040e0, #9060f0)" }} />
                      <span style={{ fontSize: 11, color: "#333", flex: 1 }}>
                        Show me high value products in the past three months
                      </span>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#7040e0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M4 7V1M4 1L1 4M4 1L7 4" stroke="white" strokeWidth="1.2" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="feat-card-body">
                  <div className="feat-card-title">Custom analytics reports</div>
                  <div className="feat-card-desc">Generate custom reports and data visualizations using the ShopifyQL query editor.</div>
                </div>
              </div>
            </div>

            <div className={`reveal reveal-delay-2 ${visible ? "visible" : ""}`}>
              <div className="feat-card">
                <div
                  className="feat-card-img"
                  style={{
                    background: "linear-gradient(135deg, #2a3a2a 0%, #1a2a1a 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", overflow: "hidden",
                  }}
                >
                  {/* Green textured bg */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(135deg, #3a5a3a 0%, #2a4a2a 50%, #1a3a1a 100%)",
                  }} />
                  <div style={{
                    position: "absolute", bottom: 16, left: 16, right: 16,
                    background: "rgba(255,255,255,0.95)", borderRadius: 8, padding: "12px 14px",
                  }}>
                    <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>New segment</div>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "6px 10px",
                      background: "white", border: "1px solid #e0e0e0", borderRadius: 20,
                    }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg, #7040e0, #9060f0)" }} />
                      <span style={{ fontSize: 11, color: "#333", flex: 1 }}>
                        Show customers subscribed to marketing with no purchases
                      </span>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#7040e0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M4 7V1M4 1L1 4M4 1L7 4" stroke="white" strokeWidth="1.2" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="feat-card-body">
                  <div className="feat-card-title">Segmentation support</div>
                  <div className="feat-card-desc">Sidekick can help you build segments or generate them from scratch.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── ONLINE SECTION ─── */
function OnlineSection() {
  const [ref, visible] = useScrollReveal(0.1);
  const [activeRollout, setActiveRollout] = useState(false);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setActiveRollout(true), 800);
      return () => clearTimeout(t);
    }
  }, [visible]);

  return (
    <section id="online" ref={ref}>
      <div className="cream-section">
        <div className={`reveal ${visible ? "visible" : ""}`}>
          <h2 className="section-big-title" style={{ marginBottom: 48 }}>
            <span className="drop-cap-script">O</span>nline store
          </h2>
        </div>

        {/* Store mockup + rollout */}
        <div className="rollout-layout">
          <div className={`reveal reveal-delay-1 ${visible ? "visible" : ""}`}>
            <div style={{ marginBottom: 24 }}>
              {/* Rollout breadcrumb */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16,
                background: "white", border: "1px solid #e0e0e0", borderRadius: 6,
                padding: "6px 12px", fontSize: 12,
              }}>
                <span style={{ color: "#888" }}>🔄 Rollouts</span>
                <span style={{ color: "#999" }}>/</span>
                <span style={{ color: "#333", fontWeight: 500 }}>New Years Sale</span>
                <span style={{
                  background: "#22c55e", color: "white", fontSize: 10,
                  padding: "1px 6px", borderRadius: 3, fontWeight: 600,
                }}>Active</span>
              </div>
              <div className="store-mock">
                <div className="store-nav-bar">
                  <div style={{ display: "flex", gap: 20, fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                    {["ALL", "APPAREL", "SKATE"].map(t => (
                      <span key={t} style={{ cursor: "pointer" }}>{t}</span>
                    ))}
                  </div>
                  <div className="store-nav-logo">mrse</div>
                  <div style={{ display: "flex", gap: 12 }}>
                    {["🔍", "🛒"].map((i, idx) => (
                      <span key={idx} style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>{i}</span>
                    ))}
                  </div>
                </div>
                <div className="store-hero-img">
                  <div className="target-rings">
                    {[60, 90, 120, 150].map((s, i) => (
                      <div key={i} className="ring" style={{
                        width: s, height: s,
                        top: `calc(50% - ${s / 2}px)`, left: `calc(50% - ${s / 2}px)`,
                        animationDelay: (i * 0.6) + "s",
                        animationDuration: "3s",
                      }} />
                    ))}
                    <div style={{
                      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                      width: 28, height: 28, borderRadius: "50%",
                      border: "2px solid rgba(80,80,200,0.6)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(80,80,200,0.7)" }} />
                    </div>
                  </div>
                  <div className="store-hero-text" style={{ marginLeft: 180 }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", marginBottom: 6 }}>SPRING 26 LOOKBOOK</div>
                    <h3>PUSHING<br />BOUNDARIES</h3>
                    <div className="store-shop-btn">SHOP NOW</div>
                  </div>
                </div>
                <div className="store-products">
                  {[
                    { name: "Ye Ole Skateboard Deck", price: "$70" },
                    { name: "MVSE Vergier Beanie", price: "$28" },
                    { name: "Clandestino Deck", price: "$80" },
                    { name: "MVSE Forte Wheels", price: "$48" },
                    { name: "Freedom Deck", price: "$60" },
                  ].map((p, i) => (
                    <div key={i} className="store-product">
                      <div className="store-product-img">
                        <div style={{
                          width: "60%", height: "70%",
                          background: ["#2a2a2a", "#3a4a2a", "#1a1a2a", "#5040a0", "#2a3a2a"][i],
                          borderRadius: 4,
                        }} />
                      </div>
                      <div className="store-product-name">{p.name}</div>
                      <div className="store-product-price">{p.price}.00</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="section-label">Rollouts</div>
              <p className="section-desc">
                Schedule and preview theme changes across time windows. Launch your campaign
                exactly when you want it, with zero manual intervention.
              </p>
              <button className="help-btn">Read help doc ↗</button>
            </div>
          </div>

          {/* Timeline */}
          <div className={`rollout-timeline reveal reveal-delay-2 ${visible ? "visible" : ""}`}>
            <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              <div className="timeline-node" />
              <div className="timeline-line" style={{ height: 100, position: "relative" }}>
                <div
                  className="timeline-label"
                  style={{
                    opacity: activeRollout ? 1 : 0,
                    transform: activeRollout ? "translateY(-50%)" : "translateY(-50%) translateX(-10px)",
                    transition: "all 0.5s ease 0.3s",
                    top: "30%",
                  }}
                >
                  <div className="timeline-label-header">
                    <span className="timeline-cal-icon">📅</span>
                    <span className="timeline-date">January 1, 2026 at 12:00am EST</span>
                  </div>
                  <div className="timeline-toggle">
                    <span>Changes launch to all</span>
                    <div className="timeline-switch" />
                  </div>
                </div>
              </div>
              <div className="timeline-node" />
              <div className="timeline-line" style={{ height: 100, position: "relative" }}>
                <div
                  className="timeline-label"
                  style={{
                    opacity: activeRollout ? 1 : 0,
                    transform: activeRollout ? "translateY(-50%)" : "translateY(-50%) translateX(-10px)",
                    transition: "all 0.5s ease 0.6s",
                    top: "50%",
                  }}
                >
                  <div className="timeline-label-header">
                    <span className="timeline-cal-icon">📅</span>
                    <span className="timeline-date">January 5, 2026 at 12:00am EST</span>
                  </div>
                </div>
              </div>
              <div className="timeline-node" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── MARKETING SECTION ─── */
function MarketingSection() {
  const [ref, visible] = useScrollReveal(0.1);
  const mktCmds = [
    { text: "/marketing-mix", size: 22, x: "42%", y: "18%", op: 0.9, dur: 4, delay: 0 },
    { text: "/bundle-finder", size: 28, x: "58%", y: "35%", op: 1, dur: 5, delay: 0.5 },
    { text: "/checkout-drops", size: 18, x: "30%", y: "45%", op: 0.7, dur: 3.5, delay: 1 },
    { text: "/social-posts", size: 24, x: "62%", y: "55%", op: 0.85, dur: 4.5, delay: 0.3 },
    { text: "/win-back", size: 16, x: "48%", y: "10%", op: 0.65, dur: 3, delay: 0.8 },
    { text: "/brand-image", size: 14, x: "18%", y: "38%", op: 0.55, dur: 4, delay: 1.2 },
    { text: "/email-campaign", size: 16, x: "36%", y: "62%", op: 0.6, dur: 3.8, delay: 0.2 },
    { text: "/go-global", size: 20, x: "65%", y: "70%", op: 0.75, dur: 5, delay: 0.7 },
  ];

  return (
    <section id="marketing" ref={ref}>
      <div className="cream-section">
        <div className={`reveal ${visible ? "visible" : ""}`}>
          <h2 className="section-big-title" style={{ marginBottom: 48 }}>
            <span className="drop-cap-script">M</span>arketing
          </h2>
        </div>

        <div className="two-col" style={{ marginBottom: 60 }}>
          <div className={`reveal reveal-delay-1 ${visible ? "visible" : ""}`}>
            <div className="section-label">Sidekick playbooks</div>
            <p className="section-desc">
              150+ built-in marketing commands let you execute any campaign with a single prompt.
              From bundle finders to global expansion strategies.
            </p>
            <button className="help-btn">Read help doc ↗</button>
          </div>
          <div className={`reveal reveal-delay-2 ${visible ? "visible" : ""}`} style={{ position: "relative", height: 280 }}>
            {mktCmds.map((cmd, i) => (
              <div
                key={cmd.text}
                style={{
                  position: "absolute", left: cmd.x, top: cmd.y,
                  fontSize: cmd.size, fontFamily: "var(--serif)",
                  color: "var(--ink-muted)", opacity: cmd.op,
                  animation: `scatterFloat ${cmd.dur}s ease-in-out infinite ${cmd.delay}s`,
                  "--op": cmd.op, "--dur": cmd.dur + "s", "--delay": cmd.delay + "s",
                }}
              >
                {cmd.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SIMGYM / SHOP APP SECTION ─── */
function ShopAppSection() {
  const [ref, visible] = useScrollReveal(0.1);

  const feedbacks = [
    {
      text: "Moving around the site was much easier than I expected!",
      tags: [{ label: "Current theme", color: "tag-blue" }, { label: "Navigation", color: "tag-gray" }],
      avatarColor: "#7040e0",
    },
    {
      text: "I found exactly what I was looking for within seconds using the search bar!",
      tags: [{ label: "Published theme", color: "tag-green" }, { label: "Product discovery", color: "tag-gray" }],
      avatarColor: "#e06040",
    },
    {
      text: "I loved seeing actual customer photos in the reviews section.",
      tags: [{ label: "Current theme", color: "tag-blue" }, { label: "Trust signals", color: "tag-green" }],
      avatarColor: "#40a0e0",
    },
    {
      text: "Finding the 'About us' page was difficult, consider making it easier to find.",
      tags: [{ label: "Unpublished theme", color: "tag-gray" }, { label: "Navigation", color: "tag-blue" }],
      avatarColor: "#8040c0",
    },
  ];

  return (
    <section id="shopapp" ref={ref}>
      <div className="cream-section simgym-section" style={{ position: "relative" }}>
        <div className={`reveal ${visible ? "visible" : ""}`}>
          <h2 className="section-big-title" style={{ marginBottom: 8 }}>
            <span className="drop-cap-script">S</span>hopify SimGym app
          </h2>
        </div>

        <div className="two-col" style={{ marginTop: 40 }}>
          <div className={`reveal reveal-delay-1 ${visible ? "visible" : ""}`}>
            <p className="section-desc" style={{ marginBottom: 20 }}>
              Simulate shopper behavior with AI agents that use data from billions of purchases,
              and get actionable recommendations before going live.
            </p>
            <button className="help-btn">Get app ↗</button>

            {/* Theme comparison cards */}
            <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Current theme", sub: "Pushing Boundaries Hero", ver: "Horizon 3.0", img: "#3a5a8a" },
                { label: "Unpublished theme", sub: "Art in Motion Hero", ver: "Horizon 3.1", img: "#8a5a3a" },
              ].map((theme, i) => (
                <div key={i} style={{
                  background: "white", borderRadius: 6, overflow: "hidden",
                  border: "1px solid #e0e0e0",
                }}>
                  <div style={{ height: 70, background: theme.img, position: "relative" }}>
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.3))",
                    }} />
                    <div style={{
                      position: "absolute", bottom: 8, left: 8, right: 8,
                      fontSize: 9, fontWeight: 700, color: "white", letterSpacing: "0.05em",
                    }}>PUSHING BOUNDARIES</div>
                  </div>
                  <div style={{ padding: "8px 10px" }}>
                    <div style={{ fontSize: 10, color: "#888", marginBottom: 2 }}>{theme.label}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#222" }}>{theme.sub}</div>
                    <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>{theme.ver}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`reveal reveal-delay-2 ${visible ? "visible" : ""}`}>
            <div className="feedback-grid">
              {feedbacks.map((fb, i) => (
                <div key={i} className="feedback-card" style={{ animationDelay: (i * 0.15) + "s" }}>
                  <div className="feedback-header">
                    <div className="feedback-avatar" style={{ background: fb.avatarColor, width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }} />
                  </div>
                  <div className="feedback-text">{fb.text}</div>
                  <div className="feedback-tags">
                    {fb.tags.map((tag) => (
                      <span key={tag.label} className={`feedback-tag ${tag.color}`}>{tag.label}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="simgym-wave" />
      </div>
    </section>
  );
}

/* ─── GENERIC SECTION ─── */
function GenericSection({ id, num, title, label, desc }) {
  const [ref, visible] = useScrollReveal(0.15);
  return (
    <section id={id} ref={ref}>
      <div className="cream-section">
        <div className={`reveal ${visible ? "visible" : ""}`}>
          <h2 className="section-big-title" style={{ marginBottom: 16 }}>
            <span className="drop-cap-script" style={{ fontFamily: "'EB Garamond', Georgia, serif", fontStyle: "italic" }}>
              {title[0]}
            </span>
            {title.slice(1)}
          </h2>
        </div>
        <div className="two-col" style={{ marginTop: 40 }}>
          <div className={`reveal reveal-delay-1 ${visible ? "visible" : ""}`}>
            <div className="section-label">{label}</div>
            <p className="section-desc">{desc}</p>
            <button className="help-btn">Read help doc ↗</button>
          </div>
          <div className={`reveal reveal-delay-2 ${visible ? "visible" : ""}`}>
            {/* Placeholder UI */}
            <div style={{
              background: "var(--cream-light)", borderRadius: 8, padding: 24,
              border: "1px solid var(--cream-dark)", minHeight: 180,
            }}>
              <div className="shimmer" style={{ height: 14, width: "60%", marginBottom: 10 }} />
              <div className="shimmer" style={{ height: 10, width: "80%", marginBottom: 6 }} />
              <div className="shimmer" style={{ height: 10, width: "70%", marginBottom: 6 }} />
              <div className="shimmer" style={{ height: 10, width: "50%", marginBottom: 20 }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="shimmer" style={{ height: 60, borderRadius: 6 }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── MAIN APP ─── */
export default function ShopifyEditions() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("sidekick");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      // Determine active section
      const sectionEls = SECTIONS.map(s => ({
        id: s.id,
        el: document.getElementById(s.id),
      })).filter(s => s.el);

      for (let i = sectionEls.length - 1; i >= 0; i--) {
        const { id, el } = sectionEls[i];
        if (el.getBoundingClientRect().top <= 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-logo">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <path d="M9 0C4 0 0 4 0 9s4 9 9 9 9-4 9-9S14 0 9 0zm0 16.5C4.86 16.5 1.5 13.14 1.5 9S4.86 1.5 9 1.5 16.5 4.86 16.5 9 13.14 16.5 9 16.5z" />
          </svg>
          <span>Shopify Editions</span>
          <span className="nav-logo-winter">Winter '26</span>
        </div>
        <div className="nav-center">
          <span className="nav-link">Editions ▾</span>
          <span className="nav-link">Search 🔍</span>
        </div>
        <div className="nav-right">
          <span className="nav-link-plain">Shopify.com</span>
          <button className="nav-btn">Start for free</button>
        </div>
      </nav>

      {/* SIDE NAV */}
      <aside className="sidenav">
        <div className="sidenav-title">
          The<br />
          Ren<em>ai</em>ssance<br />
          Edition
        </div>
        {SECTIONS.map((s) => (
          <div
            key={s.id}
            className={`sidenav-item ${activeSection === s.id ? "active" : ""}`}
            onClick={() => scrollTo(s.id)}
          >
            <span>{s.label}</span>
            <span className="sidenav-num">{s.num}</span>
          </div>
        ))}
      </aside>

      {/* MAIN CONTENT */}
      <main>
        <Hero onSectionClick={scrollTo} />

        <div className="content">
          <SidekickSection />
          <AgenticSection />
          <OnlineSection />

          <GenericSection
            id="retail"
            num="IV"
            title="Retail"
            label="Point of Sale"
            desc="A faster, more flexible checkout for your in-person sales. Sell anywhere with the hardware and software built for modern retail."
          />

          <MarketingSection />

          <GenericSection
            id="checkout"
            num="VI"
            title="Checkout"
            label="One-page checkout"
            desc="The world's highest-converting checkout, now even faster. Reduce friction and increase conversion with a streamlined one-page flow."
          />

          <GenericSection
            id="operations"
            num="VII"
            title="Operations"
            label="Bulk operations"
            desc="Manage inventory, orders, and fulfillment at scale. New bulk tools let you update thousands of records in a single action."
          />

          <ShopAppSection />

          <GenericSection
            id="b2b"
            num="IX"
            title="B2B"
            label="Company management"
            desc="A complete toolkit for wholesale and business buyers. Manage company profiles, locations, payment terms, and custom catalogs from one place."
          />

          <GenericSection
            id="finance"
            num="X"
            title="Finance"
            label="Shopify Balance"
            desc="Get paid faster, spend smarter. Shopify Balance now includes instant payouts, a Shopify card, and cashback rewards built for merchants."
          />

          <GenericSection
            id="shipping"
            num="XI"
            title="Shipping"
            label="Ship smarter"
            desc="Faster delivery, lower costs. New carrier integrations and rate shopping tools help you find the best shipping option for every order."
          />

          <GenericSection
            id="developer"
            num="XII"
            title="Developer"
            label="Platform updates"
            desc="150+ API updates, new checkout extensions, and improved dev tools. Build faster with Shopify CLI 4.0 and the new React-based UI library."
          />

          {/* Footer */}
          <footer style={{
            padding: "80px 60px 80px 0", borderTop: "1px solid var(--cream-dark)",
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          }}>
            <div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 28, marginBottom: 8 }}>
                The Ren<em>ai</em>ssance Edition
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-muted)" }}>Shopify Editions · Winter '26</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
              <button className="nav-btn" style={{ fontSize: 14, padding: "10px 24px" }}>
                Start for free
              </button>
              <span style={{ fontSize: 12, color: "var(--ink-muted)" }}>shopify.com</span>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
