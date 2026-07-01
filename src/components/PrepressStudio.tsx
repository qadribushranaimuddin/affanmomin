import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { Crop, Settings, Eye, HelpCircle, FileText, Palette, Layers, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

interface PrepressPreset {
  name: string;
  wFeet: number;
  hFeet: number;
  bleedInches: number;
  defaultTitle: string;
  defaultSub: string;
}

const PRESETS: PrepressPreset[] = [
  { name: 'Shop Front Flex Banner', wFeet: 10, hFeet: 4, bleedInches: 1.5, defaultTitle: 'MEGA SALE TODAY', defaultSub: 'UP TO 50% OFF BOTH STORES' },
  { name: 'Event Stage Backdrop Banner', wFeet: 12, hFeet: 8, bleedInches: 2.0, defaultTitle: 'ANNUAL TECH SUMMIT', defaultSub: 'WELCOMING ALL DISTINGUISHED DELEGATES' },
  { name: 'Exhibition Rollup Banner', wFeet: 3, hFeet: 6, bleedInches: 0.5, defaultTitle: 'BURRAQ HERBAL CARE', defaultSub: 'HERBAL INGREDIENTS FOR NATURAL ENERGY' },
  { name: 'Custom Certificate / Award Board', wFeet: 4, hFeet: 3, bleedInches: 1.0, defaultTitle: 'BOMBAY TROPHIES CLUB', defaultSub: 'CHAMPIONSHIP OF HONOURS' }
];

export default function PrepressStudio() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring configuration for physical responsive damping
  const springConfig = { damping: 24, stiffness: 200, mass: 0.8 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const [activePreset, setActivePreset] = useState<PrepressPreset>(PRESETS[0]);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customSub, setCustomSub] = useState<string>('');
  const [showBleed, setShowBleed] = useState<boolean>(true);
  const [showGrommets, setShowGrommets] = useState<boolean>(true);
  const [colorProfile, setColorProfile] = useState<'CMYK_PRINT' | 'RGB_SCREEN'>('CMYK_PRINT');
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showWindSlits, setShowWindSlits] = useState<boolean>(false);
  const [finishingMargin, setFinishingMargin] = useState<'hem' | 'pole-tb' | 'pole-lr' | 'none'>('none');
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const [resolutionDpi, setResolutionDpi] = useState<number>(300); // 72, 150, 300, 600
  const [grommetInterval, setGrommetInterval] = useState<number>(2.0); // 1.0, 2.0, 3.0 feet
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportStep, setExportStep] = useState<number>(0);

  const [droplets, setDroplets] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [sweepKey, setSweepKey] = useState<number>(0);
  const [cmykChannels, setCmykChannels] = useState({
    cyan: true,
    magenta: true,
    yellow: true,
    black: true
  });

  const getCmykColor = (c: number, m: number, y: number, k: number) => {
    const activeC = cmykChannels.cyan ? c : 0;
    const activeM = cmykChannels.magenta ? m : 0;
    const activeY = cmykChannels.yellow ? y : 0;
    const activeK = cmykChannels.black ? k : 0;

    const r = Math.round(255 * (1 - activeC) * (1 - activeK));
    const g = Math.round(255 * (1 - activeM) * (1 - activeK));
    const b = Math.round(255 * (1 - activeY) * (1 - activeK));

    return `rgb(${r}, ${g}, ${b})`;
  };

  useEffect(() => {
    setSweepKey(prev => prev + 1);
  }, [colorProfile]);

  const spawnDroplet = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Choose colors corresponding to CMYK or RGB depending on current mode
    let colors = ['#00FFFF', '#FF00FF', '#FFFF00', '#1A1A1A']; // Cyan, Magenta, Yellow, Key (Black)
    if (colorProfile === 'RGB_SCREEN') {
      colors = ['#FF0000', '#00FF00', '#0000FF']; // Red, Green, Blue
    }
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newDroplet = {
      id: Date.now() + Math.random(),
      x: clickX,
      y: clickY,
      color: randomColor
    };
    
    setDroplets(prev => [...prev, newDroplet].slice(-12)); // Keep last 12 droplets
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStartExport = () => {
    setIsExporting(true);
    setShowExportModal(true);
    setExportStep(0);
  };

  useEffect(() => {
    if (isExporting && exportStep < 5) {
      const timer = setTimeout(() => {
        setExportStep(prev => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    } else if (exportStep === 5) {
      setIsExporting(false);
    }
  }, [isExporting, exportStep]);

  // Computed values
  const titleText = customTitle || activePreset.defaultTitle;
  const subText = customSub || activePreset.defaultSub;

  // Let's create an elegant visual representation of high-density print colors
  // when colorProfile is CMYK (which has flatter/matte appearance due to subtractive mixing)
  const isCMYK = colorProfile === 'CMYK_PRINT';

  // Calculate dynamic aspect ratio box (fully responsive on smaller screen sizes)
  const aspectFraction = activePreset.wFeet / activePreset.hFeet;
  const maxW = windowWidth < 640 ? windowWidth - 80 : 500; // max width of preview box in px
  const maxH = 250;
  
  let layoutW = maxW;
  let layoutH = maxW / aspectFraction;
  
  if (layoutH > maxH) {
    layoutH = maxH;
    layoutW = maxH * aspectFraction;
  }


  const [customGrommets, setCustomGrommets] = useState<{ id: string; x: number; y: number }[]>([]);

  useEffect(() => {
    const list: { id: string; x: number; y: number }[] = [];
    // corners
    list.push({ id: 'c1', x: 4, y: 4 });
    list.push({ id: 'c2', x: 96, y: 4 });
    list.push({ id: 'c3', x: 4, y: 96 });
    list.push({ id: 'c4', x: 96, y: 96 });

    const totalWidth = activePreset.wFeet;
    const totalHeight = activePreset.hFeet;

    // top & bottom
    const wSegments = Math.floor(totalWidth / grommetInterval);
    if (wSegments > 1) {
      for (let i = 1; i < wSegments; i++) {
        const pct = (i / wSegments) * 92 + 4;
        list.push({ id: `tb-${i}-t`, x: pct, y: 4 });
        list.push({ id: `tb-${i}-b`, x: pct, y: 96 });
      }
    }

    // left & right
    const hSegments = Math.floor(totalHeight / grommetInterval);
    if (hSegments > 1) {
      for (let i = 1; i < hSegments; i++) {
        const pct = (i / hSegments) * 92 + 4;
        list.push({ id: `lr-${i}-l`, x: 4, y: pct });
        list.push({ id: `lr-${i}-r`, x: 96, y: pct });
      }
    }
    setCustomGrommets(list);
  }, [activePreset, grommetInterval]);

  const handleBannerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showGrommets) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const isNearEdge = clickX < 12 || clickX > 88 || clickY < 12 || clickY > 88;
    if (isNearEdge) {
      const threshold = 6;
      const nearbyIdx = customGrommets.findIndex(g => 
        Math.abs(g.x - clickX) < threshold && Math.abs(g.y - clickY) < threshold
      );

      if (nearbyIdx !== -1) {
        setCustomGrommets(prev => prev.filter((_, idx) => idx !== nearbyIdx));
      } else {
        let snapX = clickX;
        let snapY = clickY;

        const distLeft = clickX;
        const distRight = 100 - clickX;
        const distTop = clickY;
        const distBottom = 100 - clickY;

        const minDist = Math.min(distLeft, distRight, distTop, distBottom);

        if (minDist === distLeft) {
          snapX = 4;
        } else if (minDist === distRight) {
          snapX = 96;
        } else if (minDist === distTop) {
          snapY = 4;
        } else {
          snapY = 96;
        }

        setCustomGrommets(prev => [...prev, {
          id: `custom-grommet-${Date.now()}`,
          x: snapX,
          y: snapY
        }]);
      }
    }
  };

  const handlePresetSelect = (preset: PrepressPreset) => {
    setActivePreset(preset);
    setCustomTitle('');
    setCustomSub('');
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <span className="text-xs font-mono uppercase text-[#FF3E00] tracking-widest font-bold">Interactive Tool</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tighter uppercase mt-1">
            CorelDRAW Prepress & Sizing Simulator
          </h2>
          <p className="text-sm text-[#737373] mt-2 max-w-2xl">
            As a print specialist, I calibrate perfect vector margins before large-format flex printing. Explore how bleed compensations, grommets layout, and spot color spectrums affect physical print outputs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#0F0F0F] border border-[#222] p-4 sm:p-6 md:p-8 rounded-lg relative overflow-hidden">
        
        {/* Left Column Controls - cols: 5 */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-[#FF3E00] uppercase tracking-wider block border-b border-[#222] pb-1">
              Select Print Specification Preset
            </span>
            
            <div className="space-y-2">
              {PRESETS.map((preset) => (
                <motion.button
                  key={preset.name}
                  onClick={() => handlePresetSelect(preset)}
                  whileHover={{ x: 6, borderColor: '#FF3E00' }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-3 rounded text-xs font-mono flex items-center justify-between border ${
                    activePreset.name === preset.name
                      ? 'bg-[#FF3E00] text-black font-extrabold border-[#FF3E00]'
                      : 'bg-[#151515] text-[#A3A3A3] border-[#222]'
                  }`}
                >
                  <div className="truncate">
                    <p className="uppercase font-bold truncate leading-none">{preset.name}</p>
                    <span className={`text-[10px] opacity-70 ${activePreset.name === preset.name ? 'text-black' : 'text-[#737373]'}`}>
                      {preset.wFeet} ft × {preset.hFeet} ft • Bleed: {preset.bleedInches}"
                    </span>
                  </div>
                  <Crop className="w-4 h-4 flex-shrink-0" />
                </motion.button>
              ))}
            </div>

            <span className="text-[10px] font-mono text-[#FF3E00] uppercase tracking-wider block border-b border-[#222] pt-1 pb-1">
              Customize Live Layout Text
            </span>
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-mono text-[#8c8c8c] block mb-1">
                  Primary Text (Headline):
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value.toUpperCase())}
                  placeholder={activePreset.defaultTitle}
                  maxLength={50}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded px-3 py-1.5 text-xs text-white uppercase focus:border-[#FF3E00] focus:outline-none placeholder-gray-600 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-[#8c8c8c] block mb-1">
                  Supporting Text (Sub-headline):
                </label>
                <input
                  type="text"
                  value={customSub}
                  onChange={(e) => setCustomSub(e.target.value.toUpperCase())}
                  placeholder={activePreset.defaultSub}
                  maxLength={70}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded px-3 py-1.5 text-xs text-white uppercase focus:border-[#FF3E00] focus:outline-none placeholder-gray-600 font-mono"
                />
              </div>
            </div>

            <span className="text-[10px] font-mono text-[#FF3E00] uppercase tracking-wider block border-b border-[#222] pt-1 pb-1">
              Fine-Tuning Parameters
            </span>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-mono text-[9px] text-[#8c8c8c] mb-1">
                  <span>RESOLUTION:</span>
                  <span className="text-white font-bold">{resolutionDpi} DPI</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={3}
                  step={1}
                  value={resolutionDpi === 72 ? 0 : resolutionDpi === 150 ? 1 : resolutionDpi === 300 ? 2 : 3}
                  onChange={(e) => {
                    const idx = parseInt(e.target.value);
                    const dpis = [72, 150, 300, 600];
                    setResolutionDpi(dpis[idx]);
                  }}
                  className="w-full h-1 bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-[#FF3E00]"
                />
                <div className="flex justify-between font-mono text-[7px] text-[#555] mt-0.5">
                  <span>72 (DRAFT)</span>
                  <span>150 (PROOF)</span>
                  <span>300 (PRESS)</span>
                  <span>600 (VECTOR)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono text-[9px] text-[#8c8c8c] mb-1">
                  <span>EYELET RIVET INTERVAL:</span>
                  <span className="text-white font-bold">{grommetInterval.toFixed(1)} ft</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.5}
                  value={grommetInterval}
                  onChange={(e) => setGrommetInterval(parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-[#FF3E00]"
                />
                <div className="flex justify-between font-mono text-[7px] text-[#555] mt-0.5">
                  <span>1.0 ft (DENSE)</span>
                  <span>2.0 ft (OPTIMAL)</span>
                  <span>3.0 ft (SPARSE)</span>
                </div>
              </div>

              {/* Mechanical Finishing Controls */}
              <div className="bg-[#151515] border border-[#222] p-3 rounded space-y-3 mt-2">
                <span className="text-[9px] font-mono text-[#FF3E00] uppercase tracking-wider block font-bold">
                  // Mechanical Finishing Specs
                </span>
                
                {/* Wind slits toggle */}
                <div className="flex items-center justify-between font-mono text-[9px] text-[#8c8c8c]">
                  <span>Stamp Wind Slits (Outdoor):</span>
                  <button
                    onClick={() => setShowWindSlits(!showWindSlits)}
                    className={`px-2 py-0.5 border text-[8px] rounded-sm cursor-pointer font-bold transition-colors ${
                      showWindSlits 
                        ? 'bg-[#FF3E00]/20 border-[#FF3E00]/60 text-white' 
                        : 'bg-black/40 border-white/5 text-gray-500 hover:text-white'
                    }`}
                  >
                    {showWindSlits ? "ACTIVE SLITS" : "NO SLITS"}
                  </button>
                </div>

                {/* Hem & pockets options */}
                <div className="space-y-1">
                  <span className="block font-mono text-[8.5px] text-[#8c8c8c]">FINISHING MARGINS & SLEEVES:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'none', label: 'None (Plain Cut)' },
                      { id: 'hem', label: '1.5" Double Hem' },
                      { id: 'pole-tb', label: 'Top/Bottom Sleeve' },
                      { id: 'pole-lr', label: 'Side Sleeves' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setFinishingMargin(opt.id as any)}
                        className={`py-1 text-[7.5px] font-mono uppercase tracking-wider cursor-pointer border rounded-sm transition-colors ${
                          finishingMargin === opt.id 
                            ? 'bg-[#FF3E00]/25 border-[#FF3E00] text-white font-extrabold' 
                            : 'bg-black/40 border-white/5 text-gray-500 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CMYK Separator channels */}
              {isCMYK && (
                <div className="bg-[#151515] border border-[#222] p-3 rounded space-y-2 mt-2">
                  <span className="text-[9px] font-mono text-[#FF3E00] uppercase tracking-wider block">
                    // CMYK Press Plate Channel Separations
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setCmykChannels(prev => ({ ...prev, cyan: !prev.cyan }))}
                      className={`py-1.5 rounded text-[8px] font-mono uppercase tracking-wider cursor-pointer border transition-colors ${
                        cmykChannels.cyan 
                          ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/40 font-bold" 
                          : "bg-black/40 text-gray-600 border-white/5"
                      }`}
                    >
                      Cyan Plate: {cmykChannels.cyan ? "ON" : "OFF"}
                    </button>
                    <button
                      onClick={() => setCmykChannels(prev => ({ ...prev, magenta: !prev.magenta }))}
                      className={`py-1.5 rounded text-[8px] font-mono uppercase tracking-wider cursor-pointer border transition-colors ${
                        cmykChannels.magenta 
                          ? "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/40 font-bold" 
                          : "bg-black/40 text-gray-600 border-white/5"
                      }`}
                    >
                      Magenta Plate: {cmykChannels.magenta ? "ON" : "OFF"}
                    </button>
                    <button
                      onClick={() => setCmykChannels(prev => ({ ...prev, yellow: !prev.yellow }))}
                      className={`py-1.5 rounded text-[8px] font-mono uppercase tracking-wider cursor-pointer border transition-colors ${
                        cmykChannels.yellow 
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/40 font-bold" 
                          : "bg-black/40 text-gray-600 border-white/5"
                      }`}
                    >
                      Yellow Plate: {cmykChannels.yellow ? "ON" : "OFF"}
                    </button>
                    <button
                      onClick={() => setCmykChannels(prev => ({ ...prev, black: !prev.black }))}
                      className={`py-1.5 rounded text-[8px] font-mono uppercase tracking-wider cursor-pointer border transition-colors ${
                        cmykChannels.black 
                          ? "bg-gray-500/20 text-gray-300 border-gray-500/40 font-bold" 
                          : "bg-black/40 text-gray-600 border-white/5"
                      }`}
                    >
                      Key (Black) Plate: {cmykChannels.black ? "ON" : "OFF"}
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Resolution & Physical Spec Calculator panel */}
              <div className="bg-[#151515] border border-[#222] p-3 rounded space-y-1.5 text-[9px] font-mono text-[#8c8c8c] mt-2">
                <span className="text-[#FF3E00] uppercase tracking-wider block font-bold">
                  // Physical Resolution specs calculator
                </span>
                <div className="flex justify-between">
                  <span>Target Dimensions:</span>
                  <span className="text-white">{(activePreset.wFeet * 12).toFixed(0)}" × {(activePreset.hFeet * 12).toFixed(0)}" Inches</span>
                </div>
                <div className="flex justify-between">
                  <span>Output Pixels:</span>
                  <span className="text-white">{(activePreset.wFeet * 12 * resolutionDpi).toLocaleString()} × {(activePreset.hFeet * 12 * resolutionDpi).toLocaleString()} px</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Print Quality Check:</span>
                  {resolutionDpi >= 300 ? (
                    <span className="text-[#00ff99] font-bold">✓ High Resolution Approved</span>
                  ) : resolutionDpi === 150 ? (
                    <span className="text-yellow-400 font-bold">⚠️ Proof Grade Only</span>
                  ) : (
                    <span className="text-[#FF3E00] font-bold">❌ Resolution Too Low for Press</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1C1C1C] pt-4 text-xs font-mono space-y-1 text-[#737373]">
            <p className="text-white text-[11px] font-bold uppercase mb-1">Affan's Professional Tip:</p>
            <p>• CMYK profile ensures what you see under the sun matches the computer system calibration.</p>
            <p>• Avoid placing critical text near the bleed safe guard border to secure it from cut paths.</p>
          </div>
        </div>

        {/* Center / Right - Main Visual Canvas Display - cols: 8 */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#222] pb-4">
            <span className="text-xs font-mono text-[#A3A3A3] flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#00FF66] animate-ping"></span>
              Live CorelDRAW Vector Engine (1:12 Scale Prototype)
            </span>

            {/* Quick Option Toggles */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowBleed(!showBleed)}
                className={`px-2.5 py-1 text-[10px] font-mono uppercase rounded transition-colors ${
                  showBleed ? 'bg-[#FF3E00]/20 text-[#FF3E00] border border-[#FF3E00]/40' : 'bg-[#151515] text-[#737373] border border-[#222]'
                }`}
              >
                Bleed Limit (1.5")
              </button>
              
              <button
                onClick={() => setShowGrommets(!showGrommets)}
                className={`px-2.5 py-1 text-[10px] font-mono uppercase rounded transition-colors ${
                  showGrommets ? 'bg-[#FF3E00]/20 text-[#FF3E00] border border-[#FF3E00]/40' : 'bg-[#151515] text-[#737373] border border-[#222]'
                }`}
              >
                Grommet Ring Markings
              </button>

              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`px-2.5 py-1 text-[10px] font-mono uppercase rounded transition-colors ${
                  showGrid ? 'bg-[#FF3E00]/20 text-[#FF3E00] border border-[#FF3E00]/40' : 'bg-[#151515] text-[#737373] border border-[#222]'
                }`}
              >
                Vector Grid
              </button>
            </div>
          </div>

          {/* Interactive Artwork Sandbox Plate */}
          <div 
            onMouseMove={(e) => {
              handleMouseMove(e);
              if (e.buttons === 1) {
                spawnDroplet(e);
              }
            }}
            onMouseDown={spawnDroplet}
            onClick={handleBannerClick}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: '1000px' }}
            className="flex-1 flex items-center justify-center py-10 bg-black/40 border border-[#222] rounded relative min-h-[300px] overflow-hidden cursor-crosshair"
          >
            {/* Dynamic Ink Droplets/Ripples Layer */}
            <div className="absolute inset-0 pointer-events-none z-30">
              <AnimatePresence>
                {droplets.map(drop => (
                  <motion.div
                    key={drop.id}
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: 6, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    onAnimationComplete={() => {
                      setDroplets(prev => prev.filter(d => d.id !== drop.id));
                    }}
                    className="absolute rounded-full border border-dashed"
                    style={{
                      left: drop.x,
                      top: drop.y,
                      width: 16,
                      height: 16,
                      x: "-50%",
                      y: "-50%",
                      borderColor: drop.color,
                      backgroundColor: `${drop.color}15`,
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Prepress Sweep Ink Roller Animation */}
            <motion.div
              key={`sweep-${sweepKey}`}
              initial={{ x: "-110%" }}
              animate={{ x: "110%" }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              className="absolute inset-y-0 w-36 bg-gradient-to-r from-transparent via-[#FF3E00]/30 to-transparent pointer-events-none z-25 flex items-center justify-end"
              style={{ skewX: -15 }}
            >
              {/* The roller squeegee bar */}
              <div className="w-[3px] h-[120%] bg-[#FF3E00] shadow-[0_0_12px_#FF3E00] opacity-80" />
            </motion.div>
            
            {/* Dynamic Sized Graphic Plate */}
            <motion.div
              style={{
                width: `${layoutW}px`,
                height: `${layoutH}px`,
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              animate={{ 
                width: layoutW, 
                height: layoutH,
                backgroundColor: isCMYK ? getCmykColor(0, 0.75, 1.0, 0) : '#FF3E00'
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 16 }}
              className="relative shadow-2xl rounded border border-white/10 overflow-hidden flex flex-col justify-between p-6 select-none"
            >
              {/* Optional Vector Grid Layer */}
              {showGrid && (
                <div className="absolute inset-0 opacity-[0.12] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
              )}

              {/* Dynamic Safe Guard Border (Bleed Limits) */}
              {showBleed && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ 
                    opacity: [0.5, 0.8, 0.5],
                    scale: 1,
                  }}
                  transition={{
                    opacity: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                    duration: 0.4
                  }}
                  className="absolute border-2 border-dashed border-[#FF3E00]/60 pointer-events-none transition-all duration-300 shadow-[0_0_8px_rgba(255,62,0,0.15)]"
                  style={{
                    top: `${activePreset.bleedInches * 4}px`,
                    bottom: `${activePreset.bleedInches * 4}px`,
                    left: `${activePreset.bleedInches * 4}px`,
                    right: `${activePreset.bleedInches * 4}px`,
                  }}
                />
              )}

              {/* Dynamic DPI Pixel/Halftone Mesh Overlay */}
              {resolutionDpi <= 150 && (
                <div 
                  className="absolute inset-0 pointer-events-none z-20 opacity-[0.25]"
                  style={{ 
                    backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.9) 35%, transparent 35%)', 
                    backgroundSize: resolutionDpi === 72 ? '4px 4px' : '2.5px 2.5px' 
                  }} 
                />
              )}

              {/* Finishing margin stitches / sleeves */}
              {finishingMargin === 'hem' && (
                <div className="absolute inset-2.5 border border-dashed border-white/40 pointer-events-none z-15 flex items-center justify-center">
                  <span className="font-mono text-[5px] text-white/25 select-none uppercase tracking-[0.2em]">[1.5" Double-Hem Stitch Line]</span>
                </div>
              )}
              {finishingMargin === 'pole-tb' && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-4 bg-slate-800/40 border-b border-dashed border-slate-400/50 flex items-center justify-center font-mono text-[5px] text-slate-300/60 pointer-events-none z-15 uppercase tracking-[0.1em]">■ POLE INSERT SLEEVE ■</div>
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-slate-800/40 border-t border-dashed border-slate-400/50 flex items-center justify-center font-mono text-[5px] text-slate-300/60 pointer-events-none z-15 uppercase tracking-[0.1em]">■ POLE INSERT SLEEVE ■</div>
                </>
              )}
              {finishingMargin === 'pole-lr' && (
                <>
                  <div className="absolute top-0 bottom-0 left-0 w-4 bg-slate-800/40 border-r border-dashed border-slate-400/50 flex items-center justify-center font-mono text-[5px] text-slate-300/60 pointer-events-none z-15 uppercase tracking-[0.1em] [writing-mode:vertical-lr] text-center">■ SLEEVE ■</div>
                  <div className="absolute top-0 bottom-0 right-0 w-4 bg-slate-800/40 border-l border-dashed border-slate-400/50 flex items-center justify-center font-mono text-[5px] text-slate-300/60 pointer-events-none z-15 uppercase tracking-[0.1em] [writing-mode:vertical-lr] text-center">■ SLEEVE ■</div>
                </>
              )}

              {/* Wind Slit Cutout paths */}
              {showWindSlits && (
                <div className="absolute inset-0 pointer-events-none z-15 flex items-center justify-around p-8">
                  {[1, 2, 3, 4].map(idx => (
                    <svg key={idx} width="16" height="8" viewBox="0 0 16 8" className="opacity-75">
                      <path d="M 1 1 A 7 7 0 0 0 15 1" fill="none" stroke="#222" strokeWidth="1.5" />
                    </svg>
                  ))}
                </div>
              )}

              {/* Metal Grommet Eyelets Punch Simulator */}
              <AnimatePresence>
                {showGrommets && customGrommets.map((g, i) => (
                  <motion.div
                    key={g.id}
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    whileHover={{ scale: 1.4 }}
                    transition={{ type: "spring", stiffness: 180, damping: 10, delay: i * 0.02 }}
                    className="absolute w-3.5 h-3.5 rounded-full bg-[#1A1A1A] border-2 border-amber-400/80 shadow-inner z-25 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:border-white transition-colors"
                    style={{ top: `${g.y}%`, left: `${g.x}%` }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Main Content inside the Graphic Banner */}
              <div 
                className="text-center z-10 my-auto p-2 transition-all duration-300"
                style={{ filter: resolutionDpi === 72 ? "blur(0.6px)" : resolutionDpi === 150 ? "blur(0.25px)" : "none" }}
              >
                <h3 className="text-white font-black tracking-tight uppercase leading-none drop-shadow-md break-words transition-all font-sans" style={{ fontSize: `${Math.max(14, Math.floor(layoutW / 12))}px` }}>
                  {titleText}
                </h3>
                <p className="text-white/80 font-mono mt-2 font-semibold uppercase tracking-wider drop-shadow-sm border-t border-white/20 pt-1.5 inline-block max-w-[90%] truncate" style={{ fontSize: `${Math.max(8, Math.floor(layoutW / 32))}px` }}>
                  {subText}
                </p>
              </div>

              {/* Print Data Bottom Clearance Stamp */}
              <div className="flex justify-between items-end border-t border-white/20 pt-1.5 z-10 text-[7px] text-white/50 uppercase font-mono">
                <span>Scale: 1:12 calibrated</span>
                <span>Dim: {activePreset.wFeet}' x {activePreset.hFeet}' Flex Size</span>
                <span>Job: AFFAN_PREPRESS_PASS_1</span>
              </div>
            </motion.div>

            {/* Layout Aspect rulers */}
            <div className="hidden md:block absolute top-2 left-4 text-[10px] text-[#A3A3A3] font-mono uppercase bg-black/60 px-2 py-0.5 border border-[#222]">
              Standard Bleed Safety: {activePreset.bleedInches}" Clearance
            </div>
            <div className="hidden md:block absolute bottom-2 right-4 text-[10px] text-[#A3A3A3] font-mono uppercase bg-black/60 px-2 py-0.5 border border-[#222]">
              Preset Print Size: {activePreset.wFeet}ft × {activePreset.hFeet}ft Width/Height
            </div>
          </div>

          {/* Interactive Calibration Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#141414] p-4 rounded border border-[#222]">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#D4D4D4] uppercase block">
                Select Color Profile Calibrator
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setColorProfile('CMYK_PRINT')}
                  className={`flex-1 text-center py-2 text-xs font-mono rounded transition-all uppercase border ${
                    colorProfile === 'CMYK_PRINT'
                      ? 'bg-white text-black font-extrabold border-white'
                      : 'bg-[#1C1C1C] text-[#A3A3A3] hover:text-white border-[#222]'
                  }`}
                >
                  CMYK (Coated Print)
                </button>
                <button
                  onClick={() => setColorProfile('RGB_SCREEN')}
                  className={`flex-1 text-center py-2 text-xs font-mono rounded transition-all uppercase border ${
                    colorProfile === 'RGB_SCREEN'
                      ? 'bg-white text-black font-extrabold border-white'
                      : 'bg-[#1C1C1C] text-[#A3A3A3] hover:text-white border-[#222]'
                  }`}
                >
                  RGB (Screen Emulated)
                </button>
              </div>
            </div>

            <div className="space-y-1 font-mono text-[10px] text-[#A3A3A3] flex flex-col justify-end">
              <div className="flex justify-between">
                <span>Live State Status:</span>
                <span className="text-white font-bold uppercase">{colorProfile} MODE</span>
              </div>
              <div className="flex justify-between">
                <span>Computed Density Limit:</span>
                <span className={`font-bold ${resolutionDpi < 300 ? 'text-[#FF3E00]' : 'text-white'}`}>
                  {resolutionDpi} DPI {resolutionDpi < 300 ? '(Low Res)' : '(Press Ok)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sizing Clearance Guard:</span>
                <span className="text-white font-bold">{showBleed ? 'ACTIVE' : 'BYPASSED'}</span>
              </div>
            </div>
          </div>

          {/* Pre-flight Warnings & Exporter Suite */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pre-flight Warnings widget */}
            <div className="bg-[#111]/40 border border-[#222] p-4 rounded-lg flex flex-col justify-between">
              <div>
                <span className="block font-mono text-[9px] text-[#FF3E00] uppercase font-bold mb-2">// Pre-flight Warnings Scanner:</span>
                {(() => {
                  const warnings: string[] = [];
                  if (activePreset.bleedInches < 1.0) {
                    warnings.push(`Bleed guard (${activePreset.bleedInches}") is narrow for flex cutting.`);
                  }
                  if (colorProfile === 'RGB_SCREEN') {
                    warnings.push(`RGB profile cannot print; convert to CMYK.`);
                  }
                  if (resolutionDpi < 300) {
                    warnings.push(`Resolution (${resolutionDpi} DPI) is below print standard (300 DPI).`);
                  }
                  if (titleText.length > 25) {
                    warnings.push(`Headline is long; check text sizes.`);
                  }
                  
                  if (warnings.length === 0) {
                    return (
                      <div className="text-[10px] font-mono text-[#00FF00] flex items-center gap-1.5 py-1">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>All pre-flight checks: compliant</span>
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-1.5 max-h-[85px] overflow-y-auto pr-1">
                      {warnings.map((w, idx) => (
                        <div key={idx} className="text-[8.5px] font-mono text-[#FF3E00] flex items-start gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
              <div className="text-[8px] font-mono text-[#737373] mt-2 border-t border-white/5 pt-2 uppercase">
                Scanner status: online
              </div>
            </div>

            {/* Export Package action */}
            <div className="bg-[#111]/40 border border-[#222] p-4 rounded-lg flex flex-col justify-between">
              <div>
                <span className="block font-mono text-[9px] text-[#A3A3A3] uppercase font-bold mb-1.5">// Production Export:</span>
                <p className="text-[9.5px] text-[#737373] leading-relaxed mb-3">
                  Compile typography, paths, embedded spot colors, and bleed layouts into a production-ready package.
                </p>
              </div>
              <button
                onClick={handleStartExport}
                className="w-full bg-[#FF3E00] hover:bg-white text-black font-mono font-bold uppercase text-[9.5px] py-2.5 rounded transition-colors cursor-pointer"
              >
                Compile Print Package
              </button>
            </div>
          </div>

          {/* Exporting Terminal Modal Overlay */}
          <AnimatePresence>
            {showExportModal && (
              <div 
                className="fixed inset-0 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xs"
                style={{ zIndex: 9999 }}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-[#0A0A0A] border border-[#FF3E00] max-w-md w-full rounded p-6 font-mono text-[10px] text-[#A3A3A3] space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-[#222] pb-3">
                    <span className="text-[#FF3E00] uppercase font-bold tracking-widest text-[11px] flex items-center gap-1.5">
                      <Settings className="w-4 h-4 animate-spin" /> Vector Packaging Compiler
                    </span>
                    <button 
                      onClick={() => setShowExportModal(false)}
                      disabled={isExporting}
                      className="text-white hover:text-[#FF3E00] uppercase disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      [ Close ]
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto bg-black p-3.5 border border-[#222] rounded text-left">
                    <div className="text-white font-bold">[SYSTEM] INITIATING PRE-FLIGHT COMPILING ROUTINE...</div>
                    
                    {exportStep >= 1 && <div className="text-[#00FFFF]">&gt; Separating C-M-Y-K plate layers... OK</div>}
                    {exportStep >= 2 && <div className="text-[#FF00FF]">&gt; Vectorizing font paths and bezier curves... OK</div>}
                    {exportStep >= 3 && <div className="text-[#FFFF00]">&gt; Embedding ICC Color profiles (Coated GRACoL)... OK</div>}
                    {exportStep >= 4 && <div className="text-white">&gt; Compiling EPS & PDF/X-4 target packages... OK</div>}
                    {exportStep >= 5 && (
                      <div className="text-[#00FF00] font-bold mt-2">
                        &gt;&gt; PRODUCTION PACKAGE GENERATED: OK (AFFAN_PREPRESS_OK.ZIP)
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[8px] text-[#555] uppercase">Target: CorelDRAW X8 / PDF-X4</span>
                    {exportStep === 5 ? (
                      <button 
                        onClick={() => {
                          alert("Simulated Download: Outputting 'affan_prepress_ok.zip' to downloads folder!");
                          setShowExportModal(false);
                        }}
                        className="bg-[#00FF00] text-black font-bold px-3 py-1.5 uppercase hover:bg-white transition-colors"
                      >
                        Download ZIP Package
                      </button>
                    ) : (
                      <div className="text-white animate-pulse">Compiling files...</div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
