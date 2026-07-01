import { useState } from "react";
import { Sparkles, RefreshCw, Compass, Copy, Check, Grid, Layers, ShieldCheck } from "lucide-react";

type MockupType = "card" | "letterhead" | "tag" | "acrylic";

export default function InteractiveSandbox() {
  const [brandName, setBrandName] = useState("VIBE-LAB");
  const [vibe, setVibe] = useState<"Brutalist" | "Minimal" | "Herbal" | "Trophy">("Brutalist");
  const [colorScheme, setColorScheme] = useState<string>("#FF3E00");
  const [copied, setCopied] = useState(false);

  const [selectedIcon, setSelectedIcon] = useState<"helix" | "compass" | "crest" | "shield" | "clover" | "trigrid">("helix");
  const [showVectorGuides, setShowVectorGuides] = useState<boolean>(false);
  const [activeMockupType, setActiveMockupType] = useState<MockupType>("card");

  const vibePresets = [
    { id: "Brutalist", label: "Brutalist Tech", desc: "Heavy uppercase layout, thick high-contrast grids, technical telemetry." },
    { id: "Minimal", label: "Cosmic Minimal", desc: "Elegant spacious hierarchy, fine-line layout, centered identity focus." },
    { id: "Herbal", label: "Ayurvedic Botanical", desc: "Soft frame borders, technical regulatory layout, wellness alignments." },
    { id: "Trophy", label: "Laser Trophy Medal", desc: "Precision curved alignment guide, double borders, engraving parameters." },
  ] as const;

  const colorPresets = [
    { name: "Orange Volt", hex: "#FF3E00" },
    { name: "Oceanic Cyan", hex: "#06b6d4" },
    { name: "Amber Ochre", hex: "#f59e0b" },
    { name: "Trophy Gold", hex: "#fbbf24" },
    { name: "Cyber Fuchsia", hex: "#ec4899" },
  ];

  const renderIcon = (className: string = "w-6 h-6") => {
    switch (selectedIcon) {
      case "helix":
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5-1.25-2.5-3.5-2.5-6 0-4.5 4-8 8.5-8s8.5 3.5 8.5 8c0 2.5-1 4.75-2.5 6" />
            <path d="M12 10a2.5 2.5 0 0 1 2.5 2.5c0 1.5-.75 2.5-2.5 3.5-1.75-1-2.5-2-2.5-3.5A2.5 2.5 0 0 1 12 10z" />
            <path d="M8 14.5c2 1 4 1 6 0" />
          </svg>
        );
      case "compass":
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        );
      case "crest":
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 8v8" />
            <path d="M9 12h6" />
          </svg>
        );
      case "shield":
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <circle cx="12" cy="11" r="3" />
          </svg>
        );
      case "clover":
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 12c-2-2-4-2-4 0s2 4 4 4 4-2 4-4-2-2-4 0z" />
            <path d="M12 12c2-2 2-4 0-4s-4 2-4 4 2 4 4 4-2-2-4-0z" />
            <path d="M12 12c2 2 4 2 4 0s-2-4-4-4-4 2-4 4 2 2 4-0z" />
            <path d="M12 12c-2 2-2 4 0 4s4-2 4-4-2-4-4-4 2 2 4 0z" />
          </svg>
        );
      case "trigrid":
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 22 8.5 22 20 12 13.5 2 20 2 8.5 12 2" />
            <line x1="12" y1="13.5" x2="12" y2="22" />
          </svg>
        );
    }
  };

  const handleCopySpec = () => {
    const spec = `Brand: ${brandName}\nStyle Preset: ${vibe}\nColor Accent: ${colorScheme}\nRendered via Momin Affan Designer Sandbox — 2026`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(spec).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
          fallbackCopyText(spec);
        });
      } else {
        fallbackCopyText(spec);
      }
    } catch (_) {
      fallbackCopyText(spec);
    }
  };

  const fallbackCopyText = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.warn("Unable to copy to clipboard", err);
    }
  };

  return (
    <div
      className="w-full relative"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Inputs Configurator Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div>
            <div className="font-mono text-[9px] text-[#FF3E00] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <span>[06 // PRE-FLIGHT SANDBOX]</span>
              <span className="h-[1px] w-8 bg-[#FF3E00]/40"></span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tighter uppercase leading-none select-none">
              Brand Identity<br />
              Simulator
            </h3>
            <p className="text-sm text-[#737373] mt-3 max-w-sm">
              Prospective clients can interact with Momin's design rules live. Input your brand name, select a structure system, and watch our pre-flight vector canvas render an instant physical mockup.
            </p>

            {/* Input name */}
            <div className="mt-8">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-white mb-2">
                User Brand Spec Name
              </label>
              <input
                type="text"
                maxLength={20}
                value={brandName}
                onChange={(e) => setBrandName(e.target.value.toUpperCase() || "BRAND")}
                className="w-full bg-[#111]/30 backdrop-blur-md border border-white/5 p-3 text-sm text-white font-mono tracking-widest focus:outline-none focus:border-[#FF3E00] uppercase rounded-lg"
                placeholder="ENTER BRAND..."
              />
            </div>

            {/* Vibe Selection */}
            <div className="mt-6">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white mb-2">
                Structural Vibe Select
              </span>
              <div className="grid grid-cols-2 gap-2">
                {vibePresets.map((vp) => (
                  <button
                    key={vp.id}
                    onClick={() => setVibe(vp.id)}
                    className={`p-3 text-left cursor-pointer text-xs font-mono transition-all border rounded-lg ${
                      vibe === vp.id
                        ? "bg-[#FF3E00] text-black border-[#FF3E00] font-black font-extrabold shadow-md"
                        : "bg-[#111]/30 backdrop-blur-md text-[#A3A3A3] border-white/5 hover:border-[#FF3E00]/40 hover:text-white"
                    }`}
                  >
                    {vp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Select */}
            <div className="mt-6">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white mb-2">
                Core Corporate Color Accent
              </span>
              <div className="flex gap-2.5">
                {colorPresets.map((cp) => (
                  <button
                    key={cp.hex}
                    onClick={() => setColorScheme(cp.hex)}
                    style={{ backgroundColor: cp.hex }}
                    className={`w-8 h-8 rounded cursor-pointer transition-all ${
                      colorScheme === cp.hex
                        ? "ring-2 ring-white scale-110 border-2 border-black"
                        : "opacity-85 hover:opacity-100"
                    }`}
                    title={cp.name}
                  />
                ))}
              </div>
            </div>

            {/* Logo Icon Select */}
            <div className="mt-6">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white mb-2">
                Select Identity Mark Icon
              </span>
              <div className="grid grid-cols-6 gap-2">
                {(["helix", "compass", "crest", "shield", "clover", "trigrid"] as const).map((ic) => (
                  <button
                    key={ic}
                    onClick={() => setSelectedIcon(ic)}
                    className={`p-2 border rounded flex items-center justify-center cursor-pointer transition-all ${
                      selectedIcon === ic
                        ? "bg-[#FF3E00] text-black border-[#FF3E00] shadow-sm"
                        : "bg-[#111]/30 border-white/5 text-[#737373] hover:text-white hover:border-[#FF3E00]/40"
                    }`}
                    title={`Icon: ${ic.toUpperCase()}`}
                  >
                    {renderIcon("w-4 h-4")}
                  </button>
                ))}
              </div>
            </div>

            {/* Guides & Mockups Settings */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-white mb-2">
                  Construction Guides
                </span>
                <button
                  onClick={() => setShowVectorGuides(!showVectorGuides)}
                  className={`w-full py-2 font-mono text-[9px] uppercase tracking-wider border rounded cursor-pointer transition-all ${
                    showVectorGuides
                      ? "bg-[#FF3E00]/10 border-[#FF3E00]/40 text-[#FF3E00]"
                      : "bg-[#111]/30 border-white/5 text-[#737373] hover:text-white"
                  }`}
                >
                  {showVectorGuides ? "Guides: ON" : "Guides: OFF"}
                </button>
              </div>

              <div>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-white mb-2">
                  Stationary Type
                </span>
                <select
                  value={activeMockupType}
                  onChange={(e) => setActiveMockupType(e.target.value as MockupType)}
                  className="w-full bg-[#111]/30 border border-white/5 p-2 text-[9px] font-mono text-white focus:outline-none focus:border-[#FF3E00] uppercase rounded cursor-pointer"
                >
                  <option value="card">Business Card</option>
                  <option value="letterhead">Corporate Letterhead</option>
                  <option value="tag">Product Hangtag</option>
                  <option value="acrylic">Acrylic Shield Plate</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex gap-3">
            <button
              onClick={handleCopySpec}
              className="flex-grow flex items-center justify-center gap-2 bg-[#111]/30 backdrop-blur-md text-white border border-white/5 py-3 font-mono text-[10px] uppercase tracking-wider hover:border-[#FF3E00] hover:text-[#FF3E00] cursor-pointer transition-all rounded-lg"
            >
              {copied ? <Check className="w-4 text-[#FF3E00] animate-bounce" /> : <Copy className="w-4" />}
              <span>{copied ? "Copied Spec!" : "Copy Identity Spec"}</span>
            </button>
            <button
              onClick={() => {
                setBrandName("FAREEHA");
                setVibe("Brutalist");
                setColorScheme("#FF3E00");
              }}
              className="p-3 bg-[#111]/30 backdrop-blur-md border border-white/5 hover:border-[#FF3E00] text-[#737373] hover:text-white cursor-pointer transition-colors rounded-lg"
              title="Reset configuration"
            >
              <RefreshCw className="w-4" />
            </button>
          </div>
        </div>

        {/* Right Output Vector Live Preview Canvas */}
        <div className="lg:col-span-7 bg-[#111]/30 border border-white/5 rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between min-h-[460px] shadow-xl">
          
          {/* Subtle Vector Background Circles */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-white"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-white border-dashed"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white"></div>
          </div>

          {/* Canvas Decorative Header */}
          <div className="flex justify-between items-center font-mono text-[8px] text-[#737373] border-b border-white/5 pb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF3E00] animate-pulse"></span>
              <span>LIVE CORELDRAW DIGITAL MOCK // CHANNEL-A</span>
            </div>
            <div>STATUS: PRE-FLIGHT COMPLIANT</div>
          </div>

          {/* MAIN RENDER ACCORDING TO USER CONFIG */}
          {/* Guides helper */}
          {(() => {
            if (!showVectorGuides) return null;
            return (
              <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#FF007F]/30 border-t border-dashed border-[#FF007F]/20" />
                <div className="absolute top-0 left-1/2 w-[1px] h-full border-l border-dashed border-[#FF007F]/20" />
                <div className="absolute top-1/2 left-1/2 w-[240px] h-[240px] border border-dashed border-[#FF007F]/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute top-1/2 left-1/2 w-[140px] h-[140px] border border-dotted border-[#FF007F]/15 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute top-2 left-2 font-mono text-[6px] text-[#FF007F] opacity-70">
                  GRID_ALIGN_PASS: 90° RADIAL
                </div>
                <div className="absolute bottom-2 right-2 font-mono text-[6px] text-[#FF007F] opacity-70">
                  COREL_VECTOR: 1:1 TRUE_LINE
                </div>
              </div>
            );
          })()}

          {/* MAIN RENDER ACCORDING TO USER CONFIG */}
          <div className="my-6 flex flex-col items-center justify-center flex-1 z-10">
            
            {/* BUSINESS CARD MOCKUP */}
            {activeMockupType === "card" && (
              <div 
                className={`w-[290px] sm:w-[320px] h-[180px] bg-black border p-5 flex flex-col justify-between relative rounded-xl shadow-2xl transition-all duration-300 ${
                  vibe === "Brutalist" ? "border-2 rounded-none" :
                  vibe === "Herbal" ? "border rounded-2xl border-dashed" :
                  vibe === "Trophy" ? "border-2 border-double" : "border-white/10"
                }`}
                style={{ borderColor: vibe === "Brutalist" ? colorScheme : vibe === "Minimal" ? "rgba(255,255,255,0.1)" : colorScheme + "50" }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div style={{ color: colorScheme }}>
                      {renderIcon("w-5 h-5")}
                    </div>
                    <span className={`font-mono text-[8px] tracking-widest text-[#A3A3A3] uppercase ${vibe === 'Brutalist' ? 'font-black text-white' : ''}`}>
                      {brandName}
                    </span>
                  </div>
                  <span className="text-[5.5px] font-mono text-gray-600">85x55mm B_CARD</span>
                </div>

                <div className="text-left my-auto py-2">
                  <h4 
                    className={`text-white uppercase leading-none ${
                      vibe === "Brutalist" ? "text-2xl font-black tracking-tighter" :
                      vibe === "Minimal" ? "text-lg font-bold tracking-[0.2em]" :
                      vibe === "Herbal" ? "text-xl font-extrabold tracking-tight" : "text-xl font-black tracking-wider"
                    }`}
                    style={vibe === "Brutalist" ? { color: colorScheme } : {}}
                  >
                    {brandName || "MUTED"}
                  </h4>
                  <p className="text-[7.5px] font-mono text-[#737373] mt-1">
                    ESTD 2026 // {vibe.toUpperCase()} BRAND CAPSULE
                  </p>
                </div>

                <div className="flex justify-between items-end border-t border-white/5 pt-1.5 font-mono text-[6px] text-gray-500">
                  <span>PLATE APPROVED: OK</span>
                  <span>ACCENT: {colorScheme}</span>
                </div>
              </div>
            )}

            {/* LETTERHEAD MOCKUP */}
            {activeMockupType === "letterhead" && (
              <div 
                className={`w-[220px] h-[290px] bg-black border p-4 flex flex-col justify-between relative shadow-2xl transition-all duration-300 ${
                  vibe === "Brutalist" ? "border-2 rounded-none" :
                  vibe === "Herbal" ? "border rounded-xl border-dashed" :
                  vibe === "Trophy" ? "border-2 border-double" : "border-white/10"
                }`}
                style={{ borderColor: vibe === "Brutalist" ? colorScheme : vibe === "Minimal" ? "rgba(255,255,255,0.1)" : colorScheme + "50" }}
              >
                {/* Header block */}
                <div className="border-b border-white/5 pb-2 flex justify-between items-start">
                  <div className="flex items-center gap-1.5">
                    <div style={{ color: colorScheme }}>
                      {renderIcon("w-4 h-4")}
                    </div>
                    <span className="text-[7px] font-mono font-bold uppercase tracking-wider text-white">
                      {brandName}
                    </span>
                  </div>
                  <div className="text-[5px] font-mono text-gray-600 text-right">
                    COREL_PROOF_R1
                  </div>
                </div>

                {/* Letter Body Lines */}
                <div className="flex-1 py-4 space-y-2 select-none pointer-events-none opacity-20">
                  <div className="h-[2px] bg-white w-4/5 rounded-full" />
                  <div className="h-[2px] bg-white w-full rounded-full" />
                  <div className="h-[2px] bg-white w-3/4 rounded-full" />
                  <div className="h-[2px] bg-white w-5/6 rounded-full" />
                  <div className="h-[2px] bg-white w-2/3 rounded-full" />
                </div>

                {/* Footer block */}
                <div className="border-t border-white/5 pt-2 flex justify-between items-center font-mono text-[5.5px] text-gray-500">
                  <span>INFO@BRAND.COM</span>
                  <span>PAGE 01 / VECTOR_OK</span>
                </div>
              </div>
            )}

            {/* PRODUCT HANGTAG */}
            {activeMockupType === "tag" && (
              <div 
                className={`w-[130px] h-[220px] bg-black border p-4 flex flex-col justify-between relative shadow-2xl transition-all duration-300 ${
                  vibe === "Brutalist" ? "border-2 rounded-none" :
                  vibe === "Herbal" ? "border rounded-xl border-dashed" :
                  vibe === "Trophy" ? "border-2 border-double" : "border-white/10"
                }`}
                style={{ borderColor: vibe === "Brutalist" ? colorScheme : vibe === "Minimal" ? "rgba(255,255,255,0.1)" : colorScheme + "50", borderRadius: "16px 16px 4px 4px" }}
              >
                {/* String Hole Rivet */}
                <div className="mx-auto w-3 h-3 rounded-full bg-[#111] border border-white/20 flex items-center justify-center mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                </div>

                <div className="flex flex-col items-center justify-center my-auto py-2 text-center">
                  <div style={{ color: colorScheme }} className="mb-2">
                    {renderIcon("w-7 h-7")}
                  </div>
                  <h4 
                    className={`text-white uppercase leading-none ${
                      vibe === "Brutalist" ? "text-xl font-black tracking-tight" :
                      vibe === "Minimal" ? "text-sm font-bold tracking-[0.2em]" :
                      vibe === "Herbal" ? "text-lg font-extrabold" : "text-base font-black"
                    }`}
                    style={vibe === "Brutalist" ? { color: colorScheme } : {}}
                  >
                    {brandName || "HANGTAG"}
                  </h4>
                  <span className="text-[6.5px] font-mono text-gray-500 uppercase mt-1">
                    CERTIFIED ITEM // 2026
                  </span>
                </div>

                {/* Simulated barcode */}
                <div className="flex flex-col items-center space-y-1 mt-2">
                  <div className="flex justify-center items-center gap-[1.5px] h-5 w-full max-w-[80px] bg-white p-0.5 rounded-xs select-none">
                    <div className="w-[1.5px] h-full bg-black" />
                    <div className="w-[0.8px] h-full bg-black" />
                    <div className="w-[2px] h-full bg-black" />
                    <div className="w-[0.5px] h-full bg-black" />
                    <div className="w-[1.5px] h-full bg-black" />
                    <div className="w-[0.8px] h-full bg-black" />
                    <div className="w-[2px] h-full bg-black" />
                  </div>
                  <span className="text-[5px] font-mono text-gray-500">#RAW_PRNT_902</span>
                </div>
              </div>
            )}

            {/* ACRYLIC SHIELD PLATE */}
            {activeMockupType === "acrylic" && (
              <div 
                className={`w-[220px] sm:w-[240px] h-[220px] sm:h-[240px] bg-[#0c0c0e]/90 border-2 p-6 flex flex-col justify-between relative shadow-2xl transition-all duration-300 ${
                  vibe === "Brutalist" ? "border-2 rounded-none" :
                  vibe === "Herbal" ? "border rounded-3xl border-dashed" :
                  vibe === "Trophy" ? "border-2 border-double" : "border-white/10"
                }`}
                style={{ borderColor: vibe === "Brutalist" ? colorScheme : vibe === "Minimal" ? "rgba(255,255,255,0.1)" : colorScheme + "50", borderRadius: vibe === "Brutalist" ? "0px" : "28px" }}
              >
                <div className="absolute top-2 left-6 text-[5px] font-mono text-gray-600 uppercase">
                  LASER ENGRAVE PATH: VERIFIED
                </div>

                <div className="flex flex-col items-center justify-center my-auto py-2 text-center">
                  <div style={{ color: colorScheme }} className="mb-3 animate-pulse">
                    {renderIcon("w-8 h-8")}
                  </div>
                  <h4 
                    className={`text-white uppercase leading-none tracking-wide ${
                      vibe === "Brutalist" ? "text-xl font-black" :
                      vibe === "Minimal" ? "text-base font-bold tracking-[0.2em]" :
                      vibe === "Herbal" ? "text-lg font-extrabold" : "text-lg font-black"
                    }`}
                    style={vibe === "Brutalist" ? { color: colorScheme } : {}}
                  >
                    {brandName || "EXCELLENCE"}
                  </h4>
                  <p className="text-[6.5px] font-mono text-gray-500 mt-2 max-w-[150px] mx-auto select-none">
                    1st Position Vector Cutting Recognition Plate Profile
                  </p>
                </div>

                {/* Metallic Award Base representation */}
                <div className="h-2 w-full bg-gradient-to-r from-gray-500 via-gray-100 to-gray-600 border border-gray-600 rounded-sm shadow-sm flex items-center justify-center font-mono text-[4.5px] text-gray-800 font-bold uppercase select-none">
                  [ STEEL MOUNT BASE ]
                </div>
              </div>
            )}

          </div>

          {/* Canvas Tech details bottom footer */}
          <div className="border-t border-white/5 pt-4 flex flex-wrap justify-between font-mono text-[9px] text-[#737373] uppercase">
            <div>Style Vector Class: <span className="text-white">{vibe.toUpperCase()} SYSTEM</span></div>
            <div>Mockup Model: <span className="text-white">{activeMockupType.toUpperCase()} v1</span></div>
          </div>

        </div>
      </div>
    </div>
  );
}
