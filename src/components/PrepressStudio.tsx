import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { Crop, Settings, Eye, HelpCircle, FileText, Palette, Layers, RefreshCw } from 'lucide-react';

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
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const [droplets, setDroplets] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [sweepKey, setSweepKey] = useState<number>(0);

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

  // Generate eyelet/grommet dots along the outer boundary
  const getGrommetsList = () => {
    const list: { top: string; left: string }[] = [];
    if (!showGrommets) return list;
    
    // Corners
    list.push({ top: '4%', left: '4%' });
    list.push({ top: '4%', left: '96%' });
    list.push({ top: '96%', left: '4%' });
    list.push({ top: '96%', left: '96%' });

    // Along top & bottom (at roughly 20%, 40%, 60%, 80%)
    if (activePreset.wFeet >= 6) {
      for (let offset = 20; offset <= 80; offset += 20) {
        list.push({ top: '4%', left: `${offset}%` });
        list.push({ top: '96%', left: `${offset}%` });
      }
    }
    // Along left & right (if tall)
    if (activePreset.hFeet >= 5) {
      for (let offset = 33; offset <= 66; offset += 33) {
        list.push({ top: `${offset}%`, left: '4%' });
        list.push({ top: `${offset}%`, left: '96%' });
      }
    }

    return list;
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
          <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase mt-1">
            CorelDRAW Prepress & Sizing Simulator
          </h2>
          <p className="text-sm text-[#737373] mt-2 max-w-2xl">
            As a print specialist, I calibrate perfect vector margins before large-format flex printing. Explore how bleed compensations, grommets layout, and spot color spectrums affect physical print outputs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#0F0F0F] border border-[#222] p-6 md:p-8 rounded-lg relative overflow-hidden">
        
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
                backgroundColor: isCMYK ? '#A32924' : '#FF3E00'
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

              {/* Metal Grommet Eyelets Punch Simulator */}
              <AnimatePresence>
                {showGrommets && getGrommetsList().map((g, i) => (
                  <motion.div
                    key={`grommet-${i}`}
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    whileHover={{ scale: 1.4 }}
                    transition={{ type: "spring", stiffness: 180, damping: 10, delay: i * 0.04 }}
                    className="absolute w-3 h-3 rounded-full bg-[#1A1A1A] border-2 border-amber-400/80 shadow-inner z-20 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-crosshair"
                    style={{ top: g.top, left: g.left }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Main Content inside the Graphic Banner */}
              <div className="text-center z-10 my-auto p-2">
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
            <div className="absolute top-2 left-4 text-[10px] text-[#A3A3A3] font-mono uppercase bg-black/60 px-2 py-0.5 border border-[#222]">
              Standard Bleed Safety: {activePreset.bleedInches}" Clearance
            </div>
            <div className="absolute bottom-2 right-4 text-[10px] text-[#A3A3A3] font-mono uppercase bg-black/60 px-2 py-0.5 border border-[#222]">
              Preset Print Size: {activePreset.wFeet}ft × {activePreset.hFeet}ft Width/Height
            </div>
          </div>

          {/* Interactive Calibration Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#141414] p-4 rounded border border-[#222]">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#D4D4D4] uppercase block">
                Select Color Profile Calibrator
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setColorProfile('CMYK_PRINT')}
                  className={`flex-1 text-center py-2 text-xs font-mono rounded transition-all uppercase border ${
                    colorProfile === 'CMYK_PRINT'
                      ? 'bg-white text-black font-extrabold border-white'
                      : 'bg-[#1C1C1C] text-[#A3A3A3] hover:text-white border-[#222]'
                  }`}
                >
                  CMYK (Aggressive Coated Print Profile)
                </button>
                <button
                  onClick={() => setColorProfile('RGB_SCREEN')}
                  className={`flex-1 text-center py-2 text-xs font-mono rounded transition-all uppercase border ${
                    colorProfile === 'RGB_SCREEN'
                      ? 'bg-white text-black font-extrabold border-white'
                      : 'bg-[#1C1C1C] text-[#A3A3A3] hover:text-white border-[#222]'
                  }`}
                >
                  RGB (Screen Emulated Profile)
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
                <span className="text-white font-bold">300 DPI Standard Output</span>
              </div>
              <div className="flex justify-between">
                <span>Sizing Clearance Guard:</span>
                <span className="text-white font-bold">{showBleed ? 'ACTIVE' : 'BYPASSED'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
