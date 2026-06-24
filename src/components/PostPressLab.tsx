import { useState, useRef, MouseEvent as ReactMouseEvent } from "react";
import { Sparkles, ChevronLeft, ChevronRight, Layers, Sliders } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import PackagingFoldSimulator from "./PackagingFoldSimulator";

export default function PostPressLab() {
  const [careerCardActiveTab, setCareerCardActiveTab] = useState<"packaging" | "embellishment">("packaging");
  
  // Embellishment Simulator States
  const [embFoil, setEmbFoil] = useState<"gold" | "silver" | "rose" | "holo" | "none">("gold");
  const [embDepth, setEmbDepth] = useState<number>(2.5); // 1.0 to 5.0
  const [embSpotUv, setEmbSpotUv] = useState<boolean>(true);
  const [embStock, setEmbStock] = useState<"coated" | "kraft" | "obsidian">("obsidian");
  const [embShine, setEmbShine] = useState({ x: 50, y: 50 });
  const [embIsHover, setEmbIsHover] = useState(false);

  const handleEmbMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setEmbShine({ x, y });
  };

  return (
    <div
      className="w-full relative"
    >
      {/* Decorative Grid Background (subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Context / Telemetry Info */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full">
          <div>
            <div className="font-mono text-[9px] text-brand-accent uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <span>[02 // PRE-PRESS & FINISHING DECK]</span>
              <span className="h-[1px] w-8 bg-brand-accent/40"></span>
            </div>
            
            <h3 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tighter text-brand-text leading-none select-none">
              3D DIE-CUT &<br />
              TACTILE FINISH LAB
            </h3>
            
            <p className="text-xs text-brand-muted mt-6 leading-relaxed max-w-md">
              A key phase of Momin's design process is pre-visualizing physical packaging structures. This custom deck runs live WebGL and CSS compositing shaders to mock up complex post-press calibrations.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex gap-4 items-start">
                <div className="p-2.5 glass-interactive border border-brand-border/40 text-brand-accent">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-brand-text font-bold">
                    Origami Blueprint Fold
                  </h4>
                  <p className="text-[11px] text-brand-muted mt-1 leading-relaxed">
                    Test 3D folding carton blueprints, parcel mailers, and custom triangular folds. This mimics physical paper score lines before they are laser cut in the shop.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2.5 glass-interactive border border-brand-border/40 text-brand-accent">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-brand-text font-bold">
                    Interactive Embellishment
                  </h4>
                  <p className="text-[11px] text-brand-muted mt-1 leading-relaxed">
                    Simulate premium print finishes such as blind debossing depths, matte/kraft stock colors, hot foil stamping, and selective gloss Spot-UV glare alignment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-brand-border/30 font-mono text-[8px] text-brand-muted uppercase tracking-widest hidden lg:block">
            CALIBRATION RATING: press-ready plate verified
          </div>
        </div>

        {/* Right Column: The interactive swiping carousel */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex bg-brand-bg/85 border border-brand-border/60 p-1 font-mono text-[9px] font-bold uppercase tracking-wider relative select-none">
            <button
              onClick={() => setCareerCardActiveTab("packaging")}
              className={`flex-1 py-2 text-center transition-colors relative z-10 cursor-pointer ${
                careerCardActiveTab === "packaging" ? "text-brand-bg font-extrabold" : "text-brand-muted hover:text-brand-text"
              }`}
            >
              <span>[01] Die-Cut</span>
            </button>
            <button
              onClick={() => setCareerCardActiveTab("embellishment")}
              className={`flex-1 py-2 text-center transition-colors relative z-10 cursor-pointer ${
                careerCardActiveTab === "embellishment" ? "text-brand-bg font-extrabold" : "text-brand-muted hover:text-brand-text"
              }`}
            >
              <span>[02] Tactile Spec</span>
            </button>
            
            {/* Slide color active anchor block */}
            <motion.div
              className="absolute top-1 bottom-1 left-1 bg-brand-accent rounded-none -z-0"
              style={{
                width: "calc(50% - 4px)"
              }}
              animate={{
                x: careerCardActiveTab === "packaging" ? "0%" : "100%"
              }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
            />
          </div>

          {/* Carousel Body Wrapper */}
          <div className="relative w-full">
            <AnimatePresence mode="wait">
              {careerCardActiveTab === "packaging" ? (
                <motion.div
                  key="packaging"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                >
                  <PackagingFoldSimulator />
                </motion.div>
              ) : (
                <motion.div
                  key="embellishment"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                >
                  {/* INTERACTIVE EMBELLISHMENT SPECS & SHIMMER */}
                  <div className="glass-card p-6 border border-brand-border relative overflow-hidden shadow-[0_24px_60px_-15px_rgba(0,0,0,0.6)] animate-fade-in group text-left">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-accent/10 to-transparent pointer-events-none select-none" />
                    
                    <div className="flex items-center justify-between border-b border-brand-border/50 pb-4 mb-4 select-none">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 text-brand-accent shrink-0 animate-pulse" />
                        <span className="font-mono text-[9px] text-brand-text font-bold tracking-wider">// INTERACTIVE EMBELLISHMENT LAB</span>
                      </div>
                      <div className="font-mono text-[8px] bg-brand-accent/5 border border-brand-accent/30 text-brand-accent px-1.5 py-0.5 uppercase">
                        FINISHING_DECK_ACTIVE
                      </div>
                    </div>

                    <p className="text-fluid-xs text-brand-muted leading-relaxed font-sans mb-4 font-semibold">
                      Configure high-end post-press features below. Move your cursor over the tactile card specimen to watch metallic foils and gloss Spot-UV gradients catch light dynamically.
                    </p>

                    <div className="flex flex-col gap-4">
                      {/* Configuration panels */}
                      <div className="grid grid-cols-2 gap-3 pb-3 border-b border-brand-border/30">
                        {/* Foil select */}
                        <div className="space-y-1">
                          <label className="block font-mono text-[7.5px] uppercase tracking-wider text-brand-muted font-bold">// FOIL SELECTION:</label>
                          <select
                            value={embFoil}
                            onChange={(e) => setEmbFoil(e.target.value as any)}
                            className="w-full bg-brand-bg border border-brand-border/40 p-1.5 text-[8.5px] font-mono text-brand-text focus:outline-none focus:border-brand-accent rounded-none cursor-pointer"
                          >
                            <option value="gold">24k Gold Alloy</option>
                            <option value="silver">Silver Foil Spec</option>
                            <option value="rose">Coppery Rose Gold</option>
                            <option value="holo">Diffraction Hologram</option>
                            <option value="none">No Foil (Ink Pigment)</option>
                          </select>
                        </div>
                        {/* Stock select */}
                        <div className="space-y-1">
                          <label className="block font-mono text-[7.5px] uppercase tracking-wider text-brand-muted font-bold">// CARD STOCK BASE:</label>
                          <select
                            value={embStock}
                            onChange={(e) => setEmbStock(e.target.value as any)}
                            className="w-full bg-brand-bg border border-brand-border/40 p-1.5 text-[8.5px] font-mono text-brand-text focus:outline-none focus:border-brand-accent rounded-none cursor-pointer"
                          >
                            <option value="obsidian">Obsidian Soft-Touch (Dark)</option>
                            <option value="kraft">Unbleached Kraft Fiber</option>
                            <option value="coated">SBS Matte Coated (White)</option>
                          </select>
                        </div>
                      </div>

                      {/* Depth control, Spot UV, and metrics info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[8.5px] font-mono">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-brand-muted uppercase">
                            <span>Blind Deboss/Emboss Depth</span>
                            <span className="text-brand-text font-bold">{embDepth.toFixed(1)} mm</span>
                          </div>
                          <input
                            type="range"
                            min="1.0"
                            max="5.0"
                            step="0.2"
                            value={embDepth}
                            onChange={(e) => setEmbDepth(parseFloat(e.target.value))}
                            className="w-full h-[2px] accent-brand-accent bg-brand-border cursor-pointer appearance-none outline-none"
                          />
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 px-1">
                          <span className="text-brand-muted font-bold uppercase select-none">// selective spot-uv:</span>
                          <button
                            onClick={() => setEmbSpotUv(!embSpotUv)}
                            className={`px-3 py-1.5 border text-[8px] font-bold cursor-pointer transition-colors ${
                              embSpotUv 
                                ? "bg-brand-accent/25 border-brand-accent text-brand-accent" 
                                : "bg-brand-bg/40 border-brand-border/40 text-brand-muted hover:text-brand-text"
                            }`}
                          >
                            {embSpotUv ? "UV_MASK: COMPOSITE" : "UV_MASK: INACTIVE"}
                          </button>
                        </div>
                      </div>

                      {/* PHYSICAL TACTILE CARD COMPONENT */}
                      <div
                        onMouseMove={handleEmbMouseMove}
                        onMouseEnter={() => setEmbIsHover(true)}
                        onMouseLeave={() => setEmbIsHover(false)}
                        className={`w-full h-44 relative border rounded-none transition-all duration-300 select-none overflow-hidden cursor-crosshair ${
                          embStock === 'obsidian' 
                            ? 'bg-slate-900 border-slate-700/60' 
                            : embStock === 'kraft' 
                            ? 'bg-[#e2d5be] border-[#c0b094]' 
                            : 'bg-white border-slate-300'
                        }`}
                        style={{
                          backgroundImage: embStock === 'kraft' ? 'radial-gradient(circle, rgba(230,220,195,0.4) 0%, rgba(184,166,139,0.3) 100%)' : undefined
                        }}
                      >
                        {/* Corner pre-press registration hairpoint crosses */}
                        <div className={`absolute top-2 left-2 font-mono text-[7px] font-bold ${embStock === 'coated' ? 'text-slate-400' : 'text-brand-muted/70'}`}>[+] 100</div>
                        <div className={`absolute top-2 right-2 font-mono text-[7px] font-bold ${embStock === 'coated' ? 'text-slate-400' : 'text-brand-muted/70'}`}>[+] 101</div>
                        <div className={`absolute bottom-2 left-2 font-mono text-[7px] font-bold ${embStock === 'coated' ? 'text-slate-400' : 'text-brand-muted/70'}`}>[+] 102</div>
                        <div className={`absolute bottom-2 right-2 font-mono text-[7px] font-bold ${embStock === 'coated' ? 'text-slate-400' : 'text-brand-muted/70'}`}>[+] 103</div>

                        {/* Paper Grain Overlay */}
                        <div className="absolute inset-0 bg-noise pointer-events-none opacity-[0.02]" />

                        {/* HIGH GLOSS SPOT-UV GLARE OVERLAY */}
                        {embSpotUv && (
                          <div
                            className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
                            style={{
                              background: `radial-gradient(circle 90px at ${embShine.x}% ${embShine.y}%, rgba(255, 255, 255, ${embIsHover ? 0.38 : 0.12}) 0%, rgba(255, 255, 255, 0) 70%)`
                            }}
                          />
                        )}

                        {/* Interactive foil metallic shine background layer for center emblem */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div
                            className="w-28 h-28 rounded-full border flex flex-col items-center justify-center p-3 relative overflow-hidden transition-all duration-300 animate-fade-in"
                            style={{
                              borderColor: embFoil === 'none' 
                                  ? (embStock === 'coated' ? '#64748b' : '#a1a1aa')
                                  : embFoil === 'gold'
                                  ? '#ffd700'
                                  : embFoil === 'silver'
                                  ? '#e2e8f0'
                                  : embFoil === 'rose'
                                  ? '#fda4af'
                                  : '#a855f7',
                              // Beautiful simulated letterpress embossing shadows
                              boxShadow: `
                                inset 1px 1.5px 3px rgba(255,255,255,${embStock === 'coated' ? 0.8 : 0.2}), 
                                inset -1px -1.5px 3px rgba(0,0,0,0.4),
                                ${embDepth * 0.45}px ${embDepth * 0.45}px ${embDepth * 0.6}px rgba(0,0,0,${embStock === 'coated' ? 0.15 : 0.4})
                              `,
                              transform: `translateY(${embIsHover ? -1 : 0}px)`,
                              background: embStock === 'obsidian' ? '#0f172a' : embStock === 'kraft' ? '#d9c9ae' : '#f8fafc'
                            }}
                          >
                            {/* Inner central graphic that catches the selected foil colors */}
                            {embFoil !== "none" && (
                              <div
                                className="absolute inset-0 z-0 select-none opacity-90 transition-all duration-300"
                                style={{
                                  background: embFoil === "gold" 
                                    ? `radial-gradient(circle 80px at ${embShine.x}% ${embShine.y}%, #fff8ba 0%, #d4af37 40%, #aa771c 85%)`
                                    : embFoil === "silver"
                                    ? `radial-gradient(circle 80px at ${embShine.x}% ${embShine.y}%, #ffffff 0%, #cccccc 40%, #888888 85%)`
                                    : embFoil === "rose"
                                    ? `radial-gradient(circle 80px at ${embShine.x}% ${embShine.y}%, #ffe4e6 0%, #e05c5c 40%, #a21caf 85%)`
                                    : `radial-gradient(circle 80px at ${embShine.x}% ${embShine.y}%, #ff007f 0%, #7f00ff 25%, #00ffff 50%, #00ff7f 75%, #ffff00 100%)`,
                                  mixBlendMode: "screen"
                                }}
                              />
                            )}

                            {/* Seal typography and graphic frames */}
                            <div className={`relative z-10 text-center flex flex-col items-center justify-center font-mono select-none ${
                              embFoil === "none" 
                                ? (embStock === "coated" ? "text-slate-800" : "text-amber-900/80")
                                : (embFoil === "gold" ? "text-amber-100" : embFoil === "silver" ? "text-white" : embFoil === "rose" ? "text-rose-100" : "text-fuchsia-100")
                            }`}
                            style={{
                              textShadow: embFoil === "none" ? "none" : "0px 1px 1px rgba(0,0,0,0.38)"
                            }}>
                              <span className="text-[6.5px] font-bold uppercase tracking-[0.25em] mb-1 opacity-75">AUTHENTIC SEAL</span>
                              <div className="w-5 h-5 border border-current rounded-full flex items-center justify-center text-[9px] font-bold mb-1">
                                M
                              </div>
                              <span className="text-[7.5px] font-black uppercase tracking-wider">MOMIN AFFAN</span>
                              <span className="text-[5px] block font-bold tracking-widest mt-0.5 opacity-80">// DIRECTORS QUALITY //</span>
                            </div>
                          </div>
                        </div>

                        {/* Dimension annotations overlapping the tactile stock */}
                        <div className={`absolute bottom-3 right-3 font-mono text-[6.5px] font-bold flex items-center gap-1 opacity-60 ${embStock === 'coated' ? 'text-slate-700' : 'text-brand-muted'}`}>
                          <span>PLATE CALIBRATION SHIMMER ZONE: 110 x 85 mm</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Paginated Navigation Control Strip */}
            <div className="flex items-center justify-between font-mono text-[9px] text-brand-muted select-none mt-2 px-1">
              <button
                onClick={() => {
                  setCareerCardActiveTab((prev) => (prev === "packaging" ? "embellishment" : "packaging"));
                }}
                className="flex items-center gap-1 hover:text-brand-accent transition-colors cursor-pointer py-1"
                title="Previous slide"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                <span>PREV_VIEW</span>
              </button>
              
              {/* Pagination Dots */}
              <div className="flex gap-1.5 pt-0.5">
                <button
                  onClick={() => setCareerCardActiveTab("packaging")}
                  className={`w-2 h-2 transition-all ${careerCardActiveTab === "packaging" ? "bg-brand-accent scale-110" : "bg-brand-border hover:bg-brand-muted"}`}
                  title="View Origami Blueprint"
                />
                <button
                  onClick={() => setCareerCardActiveTab("embellishment")}
                  className={`w-2 h-2 transition-all ${careerCardActiveTab === "embellishment" ? "bg-brand-accent scale-110" : "bg-brand-border hover:bg-brand-muted"}`}
                  title="View Embellishment Finish Lab"
                />
              </div>

              <button
                onClick={() => {
                  setCareerCardActiveTab((prev) => (prev === "packaging" ? "embellishment" : "packaging"));
                }}
                className="flex items-center gap-1 hover:text-brand-accent transition-colors cursor-pointer py-1"
                title="Next slide"
              >
                <span>NEXT_VIEW</span>
                <ChevronRight className="w-3.5 h-3.5 text-brand-accent shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
