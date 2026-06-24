import { useState } from "react";
import { Sparkles, RefreshCw, Compass, Copy, Check } from "lucide-react";

export default function InteractiveSandbox() {
  const [brandName, setBrandName] = useState("VIBE-LAB");
  const [vibe, setVibe] = useState<"Brutalist" | "Minimal" | "Herbal" | "Trophy">("Brutalist");
  const [colorScheme, setColorScheme] = useState<string>("#FF3E00");
  const [copied, setCopied] = useState(false);

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
            <h3 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none select-none">
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
          <div className="my-10 flex flex-col items-center justify-center">
            
            {/* BRUTALIST STYLE PRESET */}
            {vibe === "Brutalist" && (
              <div 
                className="w-full max-w-sm border-2 p-6 bg-black transition-all font-sans text-left relative rounded-xl shadow-lg"
                style={{ borderColor: colorScheme }}
              >
                <div className="absolute top-2 right-2 font-mono text-[7px]" style={{ color: colorScheme }}>#012_BRUTAL</div>
                <div className="text-4xl font-black leading-none uppercase tracking-tighter" style={{ color: colorScheme }}>
                  {brandName || "MUTED"}
                </div>
                <div className="w-full h-[1px] bg-white/5 my-3"></div>
                <p className="text-[10px] text-[#737373] leading-relaxed font-mono">
                  TYPE: INDUSTRIAL LAB / PRINT PROOF V4<br />
                  ACCENT COLOR COORDINATES: {colorScheme.toUpperCase()}
                </p>
                <div className="mt-4 flex gap-1 justify-end">
                  <span className="w-2 h-2 bg-white"></span>
                  <span className="w-2 h-2" style={{ backgroundColor: colorScheme }}></span>
                  <span className="w-2 h-2 bg-white/10"></span>
                </div>
              </div>
            )}

            {/* MINIMAL STYLE PRESET */}
            {vibe === "Minimal" && (
              <div className="w-full max-w-sm border border-white/5 p-8 bg-black/40 font-sans text-center relative flex flex-col items-center rounded-xl shadow-lg">
                <div className="w-12 h-12 rounded-full border flex items-center justify-center mb-4 transition-all" style={{ borderColor: colorScheme }}>
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colorScheme }}></div>
                </div>
                <h4 className="text-2xl font-bold tracking-[0.2em] text-white uppercase">
                  {brandName || "COSMOS"}
                </h4>
                <p className="text-[8px] uppercase tracking-[0.4em] mt-2 text-[#737373] font-mono">
                  ESTD 2026 / LIMITED CAPSULE
                </p>
                <div className="absolute bottom-2 right-3 font-mono text-[6px] text-[#737373]">V:3.2</div>
              </div>
            )}

            {/* HERBAL STYLE PRESET */}
            {vibe === "Herbal" && (
              <div className="w-full max-w-sm border border-white/5 p-5 bg-black font-sans text-left relative border-t-4 rounded-xl shadow-lg" style={{ borderTopColor: colorScheme }}>
                <div className="flex justify-between items-start font-mono text-[7px] text-[#737373]">
                  <span>BOTANICAL COMPLIANT // RAW</span>
                  <span style={{ color: colorScheme }}>100g CERTIFIED</span>
                </div>
                <h4 className="text-xl font-extrabold text-white uppercase tracking-tight mt-3">
                  {brandName || "HERB"} <span style={{ color: colorScheme }}>Naturals</span>
                </h4>
                <p className="text-[9px] text-[#737373] leading-relaxed mt-2 bg-white/[0.02] p-2.5 border border-white/5 border-dashed font-mono">
                  Active Formula ingredients formulated in CorelDRAW print die-cut system.
                </p>
                <div className="mt-4 flex justify-between items-center font-mono text-[7px] text-[#737373] border-t border-white/5 pt-2">
                  <span>REG NO: HRB-4091</span>
                  <span className="font-bold underline">PRE-PRESS OK</span>
                </div>
              </div>
            )}

            {/* TROPHY STYLE PRESET */}
            {vibe === "Trophy" && (
              <div className="w-full max-w-sm border-2 border-double border-white/5 p-6 bg-black font-sans text-center relative rounded-xl shadow-lg">
                <div className="absolute top-2 left-2 text-[6px] font-mono text-[#737373]">LASER ENGRAVE PATH DEVIATION V1</div>
                <div className="w-16 h-16 rounded-full border border-dashed mx-auto my-3 flex items-center justify-center" style={{ borderColor: colorScheme }}>
                  <Compass className="w-6 h-6 text-[#737373] animate-spin" style={{ color: colorScheme, animationDuration: '12s' }} />
                </div>
                <h4 className="text-xl font-black text-white uppercase tracking-wide">
                  {brandName || "CHAMPION"} AWARD
                </h4>
                <p className="text-[9px] text-[#737373] font-mono mt-1">
                  1st Position Recognition Layout // Acrylic Cutting
                </p>
                <div className="mt-4 h-1.5 w-1/3 mx-auto rounded" style={{ backgroundColor: colorScheme }}></div>
              </div>
            )}

          </div>

          {/* Canvas Tech details bottom footer */}
          <div className="border-t border-white/5 pt-4 flex flex-wrap justify-between font-mono text-[9px] text-[#737373] uppercase">
            <div>Style Vector Class: <span className="text-white">{vibe.toUpperCase()} SYSTEM</span></div>
            <div>Calibration Frame: <span className="text-white">{colorScheme.toUpperCase()} HELIX</span></div>
          </div>

        </div>
      </div>
    </div>
  );
}
