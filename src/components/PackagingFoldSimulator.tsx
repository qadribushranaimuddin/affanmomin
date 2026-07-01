import { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  RefreshCw, 
  Layers, 
  Compass, 
  Sliders, 
  ShieldCheck, 
  Scissors, 
  RotateCw, 
  Play, 
  Pause, 
  Scale, 
  Info,
  Check,
  Eye,
  Camera,
  Flame,
  Volume2,
  VolumeX,
  Gauge,
  Sparkles
} from "lucide-react";

type PresetID = "tuck" | "triangle" | "mailer";
type StockID = "coated" | "kraft" | "luxury" | "holo";
type ViewportPreset = "flat" | "iso" | "front" | "side" | "under";

interface PresetSpec {
  name: string;
  desc: string;
  baseDimensions: string;
  bleed: string;
  glueMargin: string;
  dieCutLines: number;
  creases: number;
}

interface StockSpec {
  name: string;
  caliper: string;
  caliperNum: number; // in mm
  finish: string;
  weight: string;
  weightNum: number; // in gsm
  stiffness: string;
  embossPossible: boolean;
}

const PRESETS: Record<PresetID, PresetSpec> = {
  tuck: {
    name: "Tuck-End Cosmetic Box",
    desc: "Industry standard folding carton with dual friction-lock side flaps.",
    baseDimensions: "92mm x 92mm x 92mm",
    bleed: "3.2mm",
    glueMargin: "14.0mm",
    dieCutLines: 14,
    creases: 8
  },
  triangle: {
    name: "Triangular Apex Prism",
    desc: "Rigid geometric gift carton styling with interlocking apex folds.",
    baseDimensions: "92mm x 110mm (Prism Link)",
    bleed: "3.5mm",
    glueMargin: "12.0mm",
    dieCutLines: 11,
    creases: 5
  },
  mailer: {
    name: "E-Commerce Mailer Box",
    desc: "Dual-wall protective mail shipper unit with side ear locks.",
    baseDimensions: "100mm x 78mm x 36mm",
    bleed: "4.0mm",
    glueMargin: "0.0mm (Self-Tucking)",
    dieCutLines: 22,
    creases: 12
  }
};

const STOCKS: Record<StockID, StockSpec> = {
  coated: {
    name: "SBS Coated White Artboard",
    caliper: "18pt (0.45mm)",
    caliperNum: 0.45,
    finish: "Double-Saturated Aqueous Matte",
    weight: "350 gsm",
    weightNum: 350,
    stiffness: "24.5 mN·m (Standard)",
    embossPossible: true
  },
  kraft: {
    name: "Unbleached Recycled Kraft",
    caliper: "20pt (0.50mm)",
    caliperNum: 0.50,
    finish: "Uncoated Organic Fiber Grain",
    weight: "380 gsm",
    weightNum: 380,
    stiffness: "28.0 mN·m (Reinforced)",
    embossPossible: false
  },
  luxury: {
    name: "Lux Matte Obsidian + Gold Foil",
    caliper: "24pt (0.60mm)",
    caliperNum: 0.60,
    finish: "Tactile Soft-Touch with Gold Foil Highlights",
    weight: "420 gsm",
    weightNum: 420,
    stiffness: "39.2 mN·m (Heavy Duty)",
    embossPossible: true
  },
  holo: {
    name: "Chroma Prism Holographic",
    caliper: "18pt (0.46mm)",
    caliperNum: 0.46,
    finish: "Iridescent Spectrum Diffraction Film",
    weight: "360 gsm",
    weightNum: 360,
    stiffness: "21.0 mN·m (Flexible)",
    embossPossible: true
  }
};

export default function PackagingFoldSimulator() {
  const [preset, setPreset] = useState<PresetID>("tuck");
  const [stock, setStock] = useState<StockID>("coated");
  const [foldProgress, setFoldProgress] = useState(0); // 0 (flat blueprint) to 1 (fully formed 3D carton)
  const [rotation, setRotation] = useState({ x: -25, y: 35 });
  const [isDragging, setIsDragging] = useState(false);
  const [autoSpin, setAutoSpin] = useState(true);
  const [autoFolding, setAutoFolding] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [foldMode, setFoldMode] = useState<"unified" | "sequential">("unified");
  
  // View options toggles
  const [showCutLines, setShowCutLines] = useState(true);
  const [showCreaseLines, setShowCreaseLines] = useState(true);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [glossOverlayActive, setGlossOverlayActive] = useState(true);
  const [dieCutWindow, setDieCutWindow] = useState<'none' | 'circle' | 'hexagon' | 'arch'>('none');

  // Dynamic Dimension States (Structural Mechanics)
  const [boxWidth, setBoxWidth] = useState(92);
  const [boxHeight, setBoxHeight] = useState(92);
  const [boxDepth, setBoxDepth] = useState(78);
  const [fluteProfile, setFluteProfile] = useState<"A" | "B" | "C" | "E" | "F">("E");

  // Training Mode (Step-by-Step Training Program)
  const [trainingMode, setTrainingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Embossing & Stamping (Interactive Embossing, Debossing & Foil)
  const [embossDepth, setEmbossDepth] = useState(0); // in mm, -3.0 to +3.0
  const [foilType, setFoilType] = useState<"none" | "gold" | "silver" | "rose" | "holo">("none");

  // CMYK Plate Bleed & Registration Distortion
  const [registrationShift, setRegistrationShift] = useState(0); // in mm, -2.0 to +2.0
  const [showBleedLines, setShowBleedLines] = useState(false);

  // Ink Density, Varnish Mask & Crease Fatigue predictor
  const [activeViewMode, setActiveViewMode] = useState<"design" | "spectrograph" | "spot-uv">("design");
  const [showStressHeatmap, setShowStressHeatmap] = useState(false);
  const [activeControlTab, setActiveControlTab] = useState<"struct" | "finish" | "press" | "train" | "stress">("struct");
  const [activePattern, setActivePattern] = useState<"lines" | "leaf" | "grid" | "diamond" | "none">("lines");

  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastTickValue = useRef<number>(0);

  // Auto spin logic
  useEffect(() => {
    if (autoSpin && !isDragging) {
      spinIntervalRef.current = setInterval(() => {
        setRotation((prev) => ({
          ...prev,
          y: (prev.y + 0.35) % 360
        }));
      }, 16);
    }
    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
    };
  }, [autoSpin, isDragging]);

  // Audio folding tick feedback
  const playFoldClick = (freq: number = 380, volume: number = 0.05) => {
    try {
      if (!soundEnabled) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.06);
      
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch (_) {
      // Audio support fallback
    }
  };

  // Creep Sound Trigger when sliding flat values
  useEffect(() => {
    const diff = Math.abs(foldProgress - lastTickValue.current);
    if (diff > 0.04) {
      // Shorter physical sounds
      playFoldClick(120 + foldProgress * 280, 0.035);
      lastTickValue.current = foldProgress;
    }
  }, [foldProgress, soundEnabled]);

  // Auto-fold demonstration script
  const triggerAutoFold = () => {
    if (autoFolding) return;
    setAutoFolding(true);
    let current = foldProgress;
    const target = current >= 0.5 ? 0 : 1;
    const step = target === 1 ? 0.025 : -0.025;

    const timer = setInterval(() => {
      current += step;
      if ((step > 0 && current >= 1) || (step < 0 && current <= 0)) {
        setFoldProgress(target);
        clearInterval(timer);
        setAutoFolding(false);
        // Play solid finish sound
        playFoldClick(600, 0.07);
      } else {
        setFoldProgress(Number(current.toFixed(4)));
      }
    }, 24);
  };

  // Set standard camera presets on interactive stage
  const setCameraView = (preset: ViewportPreset) => {
    setAutoSpin(false);
    switch (preset) {
      case "flat":
        setRotation({ x: 0, y: 0 });
        setFoldProgress(0);
        break;
      case "iso":
        setRotation({ x: -28, y: 35 });
        break;
      case "front":
        setRotation({ x: 0, y: 0 });
        break;
      case "side":
        setRotation({ x: 0, y: 90 });
        break;
      case "under":
        setRotation({ x: 80, y: 0 });
        break;
    }
    playFoldClick(480, 0.06);
  };

  // Drag interaction to orbit the compiled 3D package
  const handleMouseDown = (e: ReactMouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    setAutoSpin(false); 
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    
    setRotation((prev) => ({
      x: Math.max(-85, Math.min(85, prev.x - deltaY * 0.5)),
      y: (prev.y + deltaX * 0.5) % 360,
    }));
    
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Helper variables for layout rendering
  const pSize = 92; // Face size in px for visual scale
  
  // Calculate dynamic sequence folds
  const getSequentialAngles = () => {
    if (foldMode === "unified") {
      const angleVal = foldProgress * 90;
      return {
        sides: angleVal,
        rear: angleVal,
        lid: angleVal,
        ears: angleVal
      };
    } else {
      // Sequential Stage limits:
      // Stage 1 (0 to 0.33): Sides fold up 90 deg
      // Stage 2 (0.33 to 0.66): Rear wall & Base fold up 90 deg 
      // Stage 3 (0.66 to 1.0): Lid & Ears complete lock in place
      const sides = Math.min(1.0, foldProgress / 0.33) * 90;
      const rear = Math.max(0, Math.min(1.0, (foldProgress - 0.33) / 0.33)) * 90;
      const lid = Math.max(0, Math.min(1.0, (foldProgress - 0.66) / 0.34)) * 90;
      const ears = Math.max(0, Math.min(1.0, (foldProgress - 0.5) / 0.5)) * 90;
      return { sides, rear, lid, ears };
    }
  };

  const foldAngles = getSequentialAngles();

  // Pattern Generator for Cardboard print overlays
  const getPatternBg = () => {
    if (activePattern === "lines") {
      return "repeating-linear-gradient(45deg, rgba(255,255,255,0.03), rgba(255,255,255,0.03) 2px, transparent 2px, transparent 10px)";
    }
    if (activePattern === "grid") {
      return "repeating-linear-gradient(0deg, transparent, transparent 9px, rgba(255,255,255,0.02) 9px, rgba(255,255,255,0.02) 10px), repeating-linear-gradient(90deg, transparent, transparent 9px, rgba(255,255,255,0.02) 9px, rgba(255,255,255,0.02) 10px)";
    }
    if (activePattern === "diamond") {
      return "repeating-linear-gradient(60deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(-60deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02) 1px, transparent 1px, transparent 12px)";
    }
    if (activePattern === "leaf") {
      return "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.04)' stroke-width='1'%3E%3Cpath d='M12 2C12 2 6 7 6 12C6 17 12 22 12 22C12 22 18 17 18 12C18 7 12 2'/%3E%3C/svg%3E\")";
    }
    return "none";
  };

  // Stock Styling classes helper
  const getPanelStyles = (isMainFace: boolean = false) => {
    // Dynamic border thickness based on corrugation fluting profiles
    const borderWeight = 
      fluteProfile === "A" ? "4.5px" : 
      fluteProfile === "C" ? "3.8px" : 
      fluteProfile === "B" ? "3.0px" : 
      fluteProfile === "E" ? "1.6px" : "0.8px";

    if (activeViewMode === "spectrograph") {
      return {
        backgroundColor: "rgba(8, 12, 30, 0.98)",
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.18) 0%, rgba(0, 0, 0, 0) 80%)",
        borderColor: "rgba(6, 182, 212, 0.65)",
        borderStyle: "dashed" as const,
        borderWidth: borderWeight,
        color: "rgba(6, 182, 212, 0.95)",
        boxShadow: "inset 0 0 15px rgba(6, 182, 212, 0.28)",
        textShadow: "0 0 3px rgba(6, 182, 212, 0.6)"
      };
    }

    if (activeViewMode === "spot-uv") {
      return {
        backgroundColor: "rgba(18, 18, 20, 0.99)",
        backgroundImage: "none",
        borderColor: "rgba(255, 255, 255, 0.16)",
        borderStyle: "dashed" as const,
        borderWidth: borderWeight,
        color: "rgba(75, 85, 99, 0.8)",
        boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.75)",
        textShadow: "none"
      };
    }

    const baseStyleByStock = () => {
      switch (stock) {
        case "kraft":
          return {
            backgroundColor: "rgba(180, 140, 100, 0.94)",
            backgroundImage: isMainFace ? getPatternBg() : "none",
            backgroundSize: isMainFace ? "24px 24px" : "auto",
            borderColor: showCreaseLines ? "rgba(120, 80, 40, 0.75)" : "transparent",
            borderStyle: "dashed" as const,
            borderWidth: borderWeight,
            color: "rgba(80, 40, 10, 0.95)",
            boxShadow: "inset 0 0 15px rgba(100, 70, 40, 0.45)",
            textShadow: "0 1px 0 rgba(255, 255, 255, 0.12)"
          };
        case "luxury":
          return {
            backgroundColor: "rgba(18, 20, 22, 0.98)",
            backgroundImage: isMainFace ? getPatternBg() : "none",
            backgroundSize: isMainFace ? "24px 24px" : "auto",
            borderColor: showCreaseLines ? "rgba(212, 175, 55, 0.65)" : "transparent",
            borderStyle: "dashed" as const,
            borderWidth: borderWeight,
            color: "rgba(230, 200, 120, 0.95)",
            boxShadow: "inset 0 0 12px rgba(212, 175, 55, 0.28)",
          };
        case "holo":
          return {
            backgroundColor: "transparent",
            backgroundImage: isMainFace 
              ? `${getPatternBg()}, linear-gradient(135deg, rgba(8, 145, 178, 0.68), rgba(192, 38, 211, 0.68), rgba(202, 138, 4, 0.68))`
              : `linear-gradient(135deg, rgba(8, 145, 178, 0.68), rgba(192, 38, 211, 0.68), rgba(202, 138, 4, 0.68))`,
            backgroundSize: isMainFace ? "24px 24px, auto" : "auto",
            borderColor: showCreaseLines ? "rgba(255, 255, 255, 0.75)" : "transparent",
            borderStyle: "dashed text" as any,
            borderWidth: borderWeight,
            color: "rgba(255, 255, 255, 1)",
            boxShadow: "0 0 12px rgba(192, 132, 252, 0.45), inset 0 0 15px rgba(255, 255, 255, 0.3)"
          };
        case "coated":
        default:
          return {
            backgroundColor: "rgba(245, 245, 248, 0.96)",
            backgroundImage: isMainFace ? getPatternBg() : "none",
            backgroundSize: isMainFace ? "24px 24px" : "auto",
            borderColor: showCreaseLines ? "rgba(100, 116, 139, 0.55)" : "transparent",
            borderStyle: "dashed" as const,
            borderWidth: borderWeight,
            color: "rgba(15, 23, 42, 0.9)",
            boxShadow: "inset 0 0 12px rgba(100, 116, 139, 0.16)"
          };
      }
    };

    const style = baseStyleByStock();

    // Spot UV Coating / Gold foil light reflection simulation based on rotation angle (Gloss Overlay)
    if (glossOverlayActive) {
      const shineAngle = (rotation.y + rotation.x) % 360;
      const opacity = Math.max(0.02, Math.abs(Math.sin((shineAngle * Math.PI) / 180)) * (stock === "luxury" ? 0.35 : stock === "holo" ? 0.45 : 0.15));
      const gradientPosition = `${50 + Math.cos((shineAngle * Math.PI) / 180) * 40}%`;
      const glossGradient = `linear-gradient(120deg, transparent 40%, rgba(255, 255, 255, ${opacity * 1.5}) 48%, rgba(255,255,255,${opacity}) 52%, transparent 60%)`;

      if (stock === "holo") {
        return {
          ...style,
          backgroundImage: isMainFace 
            ? `${glossGradient}, ${getPatternBg()}, linear-gradient(135deg, rgba(8, 145, 178, 0.68), rgba(192, 38, 211, 0.68), rgba(202, 138, 4, 0.68))`
            : `${glossGradient}, linear-gradient(135deg, rgba(8, 145, 178, 0.68), rgba(192, 38, 211, 0.68), rgba(202, 138, 4, 0.68))`,
          backgroundSize: isMainFace ? "200% 100%, 24px 24px, auto" : "200% 100%, auto",
          backgroundPosition: `${gradientPosition} 0, 0 0, 0 0`,
          backgroundRepeat: isMainFace ? "no-repeat, repeat, no-repeat" : "no-repeat, no-repeat"
        };
      } else {
        return {
          ...style,
          backgroundImage: isMainFace 
            ? `${glossGradient}, ${getPatternBg()}`
            : glossGradient,
          backgroundSize: isMainFace ? "200% 100%, 24px 24px" : "200% 100%",
          backgroundPosition: `${gradientPosition} 0, 0 0`,
          backgroundRepeat: isMainFace ? "no-repeat, repeat" : "no-repeat"
        };
      }
    }

    return style;
  };

  // Crease fatigue predictor thermal heatmap lines overlay
  const getCreaseHeatmapOverlay = () => {
    if (!showStressHeatmap) return null;
    const intensity = Math.min(0.95, foldProgress * (0.35 + caliperVal * 0.65));
    return (
      <div 
        style={{
          boxShadow: `inset 0 0 8px rgba(249, 115, 22, ${intensity}), 0 0 14px rgba(239, 68, 68, ${intensity * 0.95})`,
          backgroundColor: `rgba(239, 68, 68, ${intensity * 0.3})`,
          borderColor: `rgba(249, 115, 22, ${intensity})`,
          borderWidth: "1.5px",
          transition: "all 0.15s ease",
        }}
        className="absolute inset-0 z-20 pointer-events-none animate-pulse"
      />
    );
  };

  // Bleed Margin boundaries indicator
  const getBleedMarginOverlay = () => {
    if (!showBleedLines) return null;
    return (
      <>
        {/* Red bleed edge boundary line */}
        <div 
          style={{
            inset: "-3.2px",
            borderColor: "rgba(239, 68, 68, 0.55)",
            borderWidth: "1px",
            borderStyle: "dashed"
          }}
          className="absolute z-10 pointer-events-none"
        />
        {/* Green design safe boundary line */}
        <div 
          style={{
            inset: "3px",
            borderColor: "rgba(16, 185, 129, 0.6)",
            borderWidth: "1px",
            borderStyle: "dotted"
          }}
          className="absolute z-10 pointer-events-none"
        />
      </>
    );
  };

  const getCutLineClass = () => {
    if (!showCutLines) return "border-transparent";
    switch (stock) {
      case "luxury":
        return "border-[#d4af37]";
      case "holo":
        return "border-rose-300";
      case "kraft":
        return "border-[#785028]";
      case "coated":
      default:
        return "border-slate-500";
    }
  };

  const getAestheticsLabel = () => {
    switch (stock) {
      case "kraft": return "NATURAL_ORGANIC";
      case "luxury": return "GOLD_EMBOSS_MATTE";
      case "holo": return "CHROMATIC_DIFFRACTION";
      default: return "MATTE_COATED_WHITE";
    }
  };

  // Pre-press physical telemetry metrics calculations
  const caliperVal = STOCKS[stock].caliperNum;
  const weightVal = STOCKS[stock].weightNum;
  
  // Real engineering-like equations for packaging physics:
  const scoringForce = Math.round((weightVal * caliperVal * 105) / 1000 * 10) / 10; // in Newtons
  const stiffnessN = Math.round((weightVal * weightVal * caliperVal * 0.0003) * 10) / 10; // in mN*m
  const structuralIntegrity = Math.round((stiffnessN * (1 + foldProgress * 4.5)) * 10) / 10; // 3D box has higher compression strength
  
  // Calculate material flat dimensions
  const flatWidth = Math.round(preset === "tuck" ? (boxWidth * 2 + boxDepth * 2 + 14) : preset === "triangle" ? (boxWidth * 3) : (boxWidth * 1.1 + boxDepth * 0.9 + 20));
  const flatHeight = Math.round(preset === "tuck" ? (boxHeight + boxDepth * 2) : preset === "triangle" ? (boxHeight * 0.85 + boxDepth * 0.5) : (boxHeight * 0.8 + boxDepth * 1.1));
  const areaM2 = (flatWidth * flatHeight) / 1000000;
  
  const estimatedWaste = Math.max(14, Math.min(48, Math.round(100 - ((boxWidth * boxHeight * 4.5) / (flatWidth * flatHeight)) * 100)));

  // Dynamic Volume and Sheet Weight calculations
  const boxVolumeCm3 = Math.round((boxWidth * boxHeight * boxDepth) / 1000);
  const boxVolumeLiters = (boxVolumeCm3 / 1000).toFixed(3);
  const estimatedSheetWeightGrams = (areaM2 * weightVal).toFixed(2);

  // Maximum compression capability (kN) based on corrugation fluting select:
  const getMaximumCompressionForce = () => {
    switch (fluteProfile) {
      case "A": return 3.4;
      case "C": return 3.1;
      case "B": return 2.8;
      case "E": return 1.9;
      case "F": return 1.2;
    }
  };
  const maxCompression = getMaximumCompressionForce();

  // Crease fatigue text risk
  const getTearRisk = () => {
    const stressRatio = foldProgress * (caliperVal / 0.45);
    if (stressRatio > 1.2) return "🚨 HIGH RISK (FIBER RUPTURE)";
    if (stressRatio > 0.85) return "⚠️ MODERATE CREASE FATIGUE";
    return "✅ STRETCH OPTIMAL";
  };
  const tearRiskText = getTearRisk();

  // Friction lock evaluation:
  const getFrictionLockStatus = () => {
    if (stock === "luxury" && foldProgress > 0.85) {
      return {
        status: "SPRING-BACK RISK!",
        color: "text-red-400 animate-pulse",
        desc: "High stiffness (39mN·m) may eject flaps. Recommend glue."
      };
    }
    if (stock === "kraft" && foldProgress > 0.85) {
      return {
        status: "STIFFNESS LOCK",
        color: "text-amber-400",
        desc: "Coarse fiber resistance holds tabs firmly in place. Secure."
      };
    }
    return {
      status: "SECURE INSERTION",
      color: "text-emerald-400",
      desc: "Perfect friction lock ratio obtained (95% retention)."
    };
  };
  const frictionLock = getFrictionLockStatus();

  // Ink saturation check for Kraft eco
  const inkSaturationWarning = activeViewMode === "spectrograph" && stock === "kraft";

  return (
    <div className="glass-card p-6 md:p-8 border border-brand-border relative overflow-hidden flex flex-col justify-between min-h-[640px] select-none">
      
      {/* Decorative Technical Top Frame */}
      <div className="absolute top-2 right-2 flex items-center gap-2 text-[6.5px] font-mono text-brand-accent tracking-[0.15em] select-none uppercase">
        <Sparkles className="w-2.5 h-2.5 text-brand-accent animate-pulse" />
        <span>PRE-PRESS ASSEMBLY ENGINE V6.2 // ADVANCED</span>
      </div>
      
      {/* Header Deck */}
      <div className="border-b border-brand-border/40 pb-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-accent shrink-0" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-brand-text font-bold">Concept 2 // Packaging 3D Fold Simulator</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Tone trigger */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playFoldClick(440, 0.08);
              }}
              className={`p-1 flex items-center gap-1 font-mono text-[8px] border transition-colors cursor-pointer ${soundEnabled ? 'bg-brand-accent/20 border-brand-accent text-brand-accent' : 'bg-brand-bg/60 border-brand-border/40 text-brand-muted hover:text-brand-text'}`}
              title="Toggle haptic audio folding clicks"
            >
              {soundEnabled ? <Volume2 className="w-2.5 h-2.5" /> : <VolumeX className="w-2.5 h-2.5" />}
              <span>{soundEnabled ? "CREASE_SFX" : "MUTE_SFX"}</span>
            </button>

            <button
              onClick={() => {
                const prevY = rotation.y;
                setRotation({ x: -25, y: prevY + 180 });
                playFoldClick(320, 0.05);
              }}
              className="px-2.5 py-1 flex items-center gap-1 font-mono text-[8px] bg-brand-bg/60 border border-brand-border/40 text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
              title="Flip view 180 degrees"
            >
              <RotateCw className="w-2.5 h-2.5" />
              <span>FLIP_VIEW</span>
            </button>

            <button
              onClick={triggerAutoFold}
              disabled={autoFolding}
              className="flex items-center gap-1.5 font-mono text-[8px] bg-brand-accent/10 hover:bg-brand-accent/25 border border-brand-accent/45 text-brand-accent px-2.5 py-1 uppercase transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-2.5 h-2.5 ${autoFolding ? 'animate-spin' : ''}`} />
              <span>{foldProgress > 0.5 ? "Flatten Flat" : "Fold 3D"}</span>
            </button>
          </div>
        </div>

        {/* Structure Selector Row */}
        <div className="grid grid-cols-3 gap-1.5 mt-3 select-none">
          {(Object.keys(PRESETS) as PresetID[]).map((pId) => (
            <button
              key={pId}
              onClick={() => {
                setPreset(pId);
                playFoldClick(350 + (pId === "tuck" ? 0 : pId === "triangle" ? 100 : 200), 0.05);
              }}
              className={`p-1.5 font-mono text-[8.5px] uppercase tracking-wide border cursor-pointer transition-colors ${
                preset === pId 
                  ? "bg-brand-accent text-brand-bg border-brand-accent font-extrabold" 
                  : "bg-brand-bg/40 text-brand-muted border-brand-border/30 hover:border-brand-muted hover:text-brand-text"
              }`}
            >
              {pId === "tuck" ? "Tuck Carton" : pId === "triangle" ? "Triangle Apex" : "Parcel Mailer"}
            </button>
          ))}
        </div>
      </div>

      {/* Camera viewpoint options rail */}
      <div className="flex items-center justify-between font-mono text-[8px] border border-brand-border/40 bg-brand-bg/40 p-2 mb-2 select-none">
        <span className="text-brand-muted uppercase flex items-center gap-1">
          <Camera className="w-3 text-brand-accent shrink-0" />
          Camera Preset coordinates:
        </span>
        <div className="flex gap-2">
          {(["flat", "iso", "front", "side", "under"] as ViewportPreset[]).map((cam) => (
            <button
              key={cam}
              onClick={() => setCameraView(cam)}
              className="hover:text-brand-accent text-brand-muted cursor-pointer transition-colors px-1 uppercase"
            >
              [{cam}]
            </button>
          ))}
        </div>
      </div>

      {/* Main Assembly Viewport Stage */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        style={{ perspective: "1150px" }}
        className={`relative h-[256px] bg-brand-bg/60 border border-brand-border/50 flex items-center justify-center overflow-hidden cursor-grab ${isDragging ? "cursor-grabbing" : ""}`}
      >
        {/* physical blueprints margin targets */}
        <div className="absolute top-2 left-2 font-mono text-[6px] text-brand-muted/50 select-none flex flex-col gap-0.5 leading-none">
          <div>SCALE: 1:1.50 METRIC</div>
          <div>DIE_CUTS: {PRESETS[preset].dieCutLines} LAYERS</div>
          <div>CREASES: {PRESETS[preset].creases} INDEXED</div>
          <div>GLOSS_VARNISH: {glossOverlayActive ? "Active" : "Bypassed"}</div>
        </div>
        
        <div className="absolute bottom-2 left-2 font-mono text-[6px] text-brand-muted/50 select-none leading-none">
          BLEED: {PRESETS[preset].bleed} // GLUE: {PRESETS[preset].glueMargin}
        </div>

        <div className="absolute top-2 right-2 font-mono text-[6px] text-brand-muted/50 select-none text-right leading-none uppercase">
          STK: {STOCKS[stock].weight}<br/>
          FIN: {getAestheticsLabel()}
        </div>

        {/* Dynamic drop reflection shadow underneath folded box */}
        <div 
          style={{
            transform: `rotateX(90deg) translateZ(-80px)`,
            width: "128px",
            height: "128px",
            // Shadows spreads and solidifies as the carton folds up
            opacity: 0.12 + (foldProgress * 0.45),
            scale: 0.8 + (foldProgress * 0.4),
            filter: "blur(18px)",
          }}
          className="absolute bg-black rounded-full mix-blend-multiply pointer-events-none"
        />

        {/* Compass Orbit Active Warning Indicator */}
        <AnimatePresence>
          {isDragging && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-3 bottom-3 flex items-center gap-1 font-mono text-[7px] text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-1.5 py-0.5"
            >
              <Compass className="w-3 h-3 text-brand-accent animate-spin-slow shrink-0" />
              <span>ORBITING_ACTIVE [Y:{Math.round(rotation.y)}° X:{Math.round(rotation.x)}°]</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outer 3D Node with customizable transformations */}
        <div 
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="relative w-[1px] h-[1px]"
        >
          {/* ==============================================
              PRESET 1: TUCK END CUSTOM COSMETIC BOX 
              ============================================== */}
          {preset === "tuck" && (
            <div style={{ left: `-${boxWidth / 2}px`, top: `-${boxHeight / 2}px`, transformStyle: "preserve-3d" }} className="absolute">
              
              {/* BASE / FRONT FACE */}
              <div 
                style={{
                  width: `${boxWidth}px`,
                  height: `${boxHeight}px`,
                  transformStyle: "preserve-3d",
                  transform: "translate3d(0, 0, 0)",
                  ...getPanelStyles(true)
                }}
                className={`absolute border p-2 flex flex-col justify-between font-mono text-[6px] ${getCutLineClass()}`}
              >
                {getBleedMarginOverlay()}
                {getCreaseHeatmapOverlay()}

                <div className="flex justify-between font-bold z-10">
                  <span>[FRONT_A]</span>
                  {showAnnotations && <span>{boxWidth}x{boxHeight}mm</span>}
                </div>
                
                {/* ADVANCED REVERSIBLE FOIL, EMBOSS, CMYK EMBLEM OR DIE-CUT WINDOW */}
                {dieCutWindow === 'none' ? (
                  <div className="relative my-auto flex flex-col items-center justify-center z-10 select-none">
                    <div 
                      style={{
                        width: `${Math.min(55, boxWidth * 0.7)}px`,
                        height: `${Math.min(55, boxHeight * 0.7)}px`,
                        borderRadius: "50%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        // Emboss/Deboss Z shift & dynamic shading
                        ...(embossDepth !== 0 ? {
                          boxShadow: embossDepth > 0 
                            ? `inset -1.5px -1.5px 3.5px rgba(255,255,255,0.75), inset 1.5px 1.5px 3.5px rgba(0,0,0,0.35), -2.5px -2.5px 6px rgba(255,255,255,0.48), 2.5px 2.5px 6px rgba(0,0,0,0.28)` 
                            : `inset 1.5px 1.5px 3.5px rgba(0,0,0,0.48), inset -1.5px -1.5px 3.5px rgba(255,255,255,0.25), 1.5px 1.5px 3.5px rgba(255,255,255,0.35)`,
                          border: embossDepth > 0 
                            ? "1px solid rgba(255,255,255,0.2)" 
                            : "1px solid rgba(0,0,0,0.18)",
                          transform: `translateZ(${embossDepth * 2.5}px)`
                        } : {}),
                        // Hot Metal Foil Stamp select
                        ...(foilType !== "none" ? {
                          background: foilType === "gold" 
                            ? "linear-gradient(135deg, #bf953f 0%, #fcf6ba 25%, #b38728 50%, #fbf5b7 75%, #aa771c 100%)"
                            : foilType === "silver"
                            ? "linear-gradient(135deg, #e3e3e3 0%, #fbfbfb 25%, #bebebe 50%, #f4f4f4 75%, #a2a2a2 100%)"
                            : foilType === "rose"
                            ? "linear-gradient(135deg, #e05c5c 0%, #ffabab 25%, #c43b3b 50%, #ffa5a5 75%, #9b1e1e 100%)"
                            : "linear-gradient(135deg, #ff007f 0%, #7f00ff 25%, #00ffff 50%, #00ff7f 75%, #ffff00 100%)",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.45)",
                          border: "none"
                        } : {
                          ...(activeViewMode === "spot-uv" ? {
                            background: "rgba(245, 158, 11, 0.16)",
                            border: "1px solid rgba(245, 158, 11, 0.85)",
                            boxShadow: "0 0 10px rgba(245, 158, 11, 0.35)",
                          } : activeViewMode === "spectrograph" ? {
                            background: "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(4, 120, 87, 0.4) 100%)",
                            border: "1.5px solid rgba(16, 185, 129, 0.8)",
                            boxShadow: "0 0 8px rgba(16, 185, 129, 0.45)",
                          } : {
                            background: stock === "luxury" ? "rgba(212, 175, 55, 0.1)" : "rgba(15, 23, 42, 0.03)",
                            border: `1.5px solid ${stock === "luxury" ? "rgba(212, 175, 55, 0.45)" : "rgba(15, 23, 42, 0.12)"}`
                          })
                        })
                      }}
                      className="flex flex-col items-center justify-center p-1 font-mono text-center shadow-inner"
                    >
                      {/* Live CMYK Misalignment plate displacement text shadow */}
                      <span 
                        style={{
                          fontSize: "6px",
                          fontWeight: "900",
                          letterSpacing: "0.06em",
                          textShadow: registrationShift !== 0 
                            ? `${registrationShift * 2}px 0 0 rgba(0, 255, 255, 0.95), ${-registrationShift * 2}px 0 0 rgba(255, 0, 255, 0.95), 0 ${registrationShift * 1.5}px 0 rgba(225, 225, 0, 0.8)` 
                            : "none",
                          color: foilType !== "none" ? "#0f172a" : "inherit"
                        }}
                        className="uppercase transition-all duration-150"
                      >
                        CALIBRATED
                      </span>
                      <span style={{ fontSize: "4px" }} className={foilType !== "none" ? "text-slate-800 font-bold" : "text-brand-accent font-bold"}>
                        // CND CERT //
                      </span>
                    </div>
                  </div>
                ) : (
                  /* RENDER THE DIE-CUT VIEWING WINDOW CAVITY WITH THE PRODUCT SPECIMEN */
                  <div 
                    className="relative my-auto w-16 h-16 bg-[#090b11] border border-brand-accent/30 flex flex-col items-center justify-center overflow-hidden z-10 select-none shadow-[inset_0_2px_6px_rgba(0,0,0,0.85)]"
                    style={{
                      borderRadius: dieCutWindow === 'circle' ? '50%' : dieCutWindow === 'hexagon' ? '4px' : '50% 50% 0 0',
                      clipPath: dieCutWindow === 'hexagon' ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' : 'none'
                    }}
                  >
                    {/* Glowing Product Specimen Cavity outline */}
                    <svg className="w-8 h-8 text-brand-accent opacity-75 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M7 10h10v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V10z M10 6h4v4h-4V6z M12 2v4" />
                      <circle cx="12" cy="14" r="2.5" fill="rgba(255, 62, 0, 0.25)" />
                    </svg>
                    <span className="font-mono text-[4.5px] text-brand-muted/70 tracking-widest mt-1">// FLASK_OUTLINE //</span>
                  </div>
                )}

                {/* Bleed Violation Alert */}
                {showBleedLines && (boxWidth > 115 || boxHeight > 115) && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600/95 text-white text-[5px] font-black tracking-widest px-1 py-0.5 z-30 animate-pulse text-center leading-none uppercase">
                    🚨 Bleed Violation!<br/>Overflow boundary
                  </div>
                )}

                <div className="flex justify-between items-end z-10">
                  <div className="flex gap-0.5">
                    <span className="w-1.5 h-1 bg-[#00ffff]"></span>
                    <span className="w-1.5 h-1 bg-[#ff00ff]"></span>
                    <span className="w-1.5 h-1 bg-[#ffff00]"></span>
                    <span className="w-1.5 h-1 bg-slate-900"></span>
                  </div>
                  {showAnnotations && <span className="opacity-75">FACE_01</span>}
                </div>
              </div>

              {/* BACK FACE */}
              <div 
                style={{
                  width: `${boxWidth}px`,
                  height: `${boxHeight}px`,
                  transformOrigin: "bottom",
                  transform: `translate3d(0, -${boxHeight}px, 0) rotateX(${-foldAngles.rear}deg)`,
                  transformStyle: "preserve-3d",
                  ...getPanelStyles(true)
                }}
                className={`absolute border p-2 flex flex-col justify-between font-mono text-[6px] ${getCutLineClass()}`}
              >
                {getBleedMarginOverlay()}
                {getCreaseHeatmapOverlay()}

                <div className="flex justify-between font-bold text-rose-500 z-10">
                  <span>[BACK_B]</span>
                  {showAnnotations && <span>FLOC_90°</span>}
                </div>
                
                {/* Secondary flap structure: LID */}
                <div 
                  style={{
                    width: `${boxWidth}px`,
                    height: `${boxDepth}px`,
                    transformOrigin: "bottom",
                    transform: `translate3d(0, -${boxDepth}px, 0) rotateX(${-foldAngles.lid}deg)`,
                    transformStyle: "preserve-3d",
                    ...getPanelStyles()
                  }}
                  className={`absolute left-0 border p-2 flex flex-col justify-between font-mono ${getCutLineClass()}`}
                >
                  {getBleedMarginOverlay()}
                  {getCreaseHeatmapOverlay()}
                  
                  <div className="flex justify-between font-semibold z-10 text-[5px]">
                    <span>[LID_C]</span>
                    <span>FLAP_H1</span>
                  </div>
                  <div className="border border-brand-accent/30 bg-brand-accent/5 p-1 text-center font-bold text-[5.5px] uppercase tracking-wide self-center w-5/6 z-10">
                    INSERT TO SECURE
                  </div>
                  <div className="text-right z-10 text-[5px]">PLATE_3D</div>
                </div>

                <div className="text-center font-bold text-[5.5px] z-10">CMYK ALIGN STAMPS</div>
              </div>

              {/* BOTTOM FLAP / ASSEMBLY BASE */}
              <div 
                style={{
                  width: `${boxWidth}px`,
                  height: `${boxDepth}px`,
                  transformOrigin: "top",
                  transform: `translate3d(0, ${boxHeight}px, 0) rotateX(${foldAngles.rear}deg)`,
                  transformStyle: "preserve-3d",
                  ...getPanelStyles()
                }}
                className={`absolute border p-2 flex flex-col justify-between font-mono text-[6px] ${getCutLineClass()}`}
              >
                {getBleedMarginOverlay()}
                {getCreaseHeatmapOverlay()}

                <div className="flex justify-between z-10">
                  <span>[BASE_D]</span>
                  {showAnnotations && <span>{boxWidth}x{boxDepth}mm</span>}
                </div>
                <div className="h-0.5 w-3/4 bg-brand-accent/40 mx-auto self-center z-10"></div>
                <div className="text-right uppercase z-10">BOTTOM_SEAL</div>
              </div>

              {/* LEFT WALL FLAP */}
              <div 
                style={{
                  width: `${boxDepth}px`,
                  height: `${boxHeight}px`,
                  transformOrigin: "right",
                  transform: `translate3d(-${boxDepth}px, 0, 0) rotateY(${foldAngles.sides}deg)`,
                  transformStyle: "preserve-3d",
                  ...getPanelStyles()
                }}
                className={`absolute border p-2 flex flex-col justify-between font-mono text-[6px] ${getCutLineClass()}`}
              >
                {getBleedMarginOverlay()}
                {getCreaseHeatmapOverlay()}

                <div className="flex justify-between font-bold z-10">
                  <span>[LEFT_E]</span>
                  {showAnnotations && <span>W_LOCK</span>}
                </div>
                <div className="w-1 h-3/6 bg-brand-accent/20 border-l border-brand-accent/55 self-center my-auto z-10"></div>
                <div className="text-left select-none text-[5px] z-10">FOLD_L_90</div>
              </div>

              {/* RIGHT WALL FLAP */}
              <div 
                style={{
                  width: `${boxDepth}px`,
                  height: `${boxHeight}px`,
                  transformOrigin: "left",
                  transform: `translate3d(${boxWidth}px, 0, 0) rotateY(${-foldAngles.sides}deg)`,
                  transformStyle: "preserve-3d",
                  ...getPanelStyles()
                }}
                className={`absolute border p-2 flex flex-col justify-between font-mono text-[6px] ${getCutLineClass()}`}
              >
                {getBleedMarginOverlay()}
                {getCreaseHeatmapOverlay()}

                <div className="flex justify-between font-bold text-right z-10">
                  {showAnnotations && <span>W_LOCK</span>}
                  <span>[RGHT_F]</span>
                </div>
                <div className="w-1 h-3/6 bg-brand-accent/20 border-r border-brand-accent/55 self-center my-auto z-10"></div>
                <div className="text-right text-[5px] select-none z-10">FOLD_R_90</div>
              </div>

            </div>
          )}

          {/* ==============================================
              PRESET 2: GEOMETRIC APEX TRIANGULAR PRISM
              ============================================== */}
          {preset === "triangle" && (
            <div style={{ left: `-${boxWidth / 2}px`, top: `-${boxHeight * 0.42}px`, transformStyle: "preserve-3d" }} className="absolute">
              
              {/* PRIMARY FRONT */}
              <div 
                style={{
                  width: `${boxWidth}px`,
                  height: `${boxHeight * 0.85}px`,
                  transformStyle: "preserve-3d",
                  transform: "translate3d(0, 0, 0)",
                  ...getPanelStyles(true)
                }}
                className={`absolute border p-2 flex flex-col justify-between font-mono text-[6px] ${getCutLineClass()}`}
              >
                {getBleedMarginOverlay()}
                {getCreaseHeatmapOverlay()}

                <div className="flex justify-between font-bold z-10">
                  <span>[TRI_MAIN]</span>
                  {showAnnotations && <span>{boxWidth}x{Math.round(boxHeight * 0.85)}mm</span>}
                </div>
                
                {/* ADVANCED REVERSIBLE FOIL, EMBOSS, CMYK EMBLEM */}
                <div className="relative my-auto flex flex-col items-center justify-center z-10 select-none">
                  <div 
                    style={{
                      width: `${Math.min(50, boxWidth * 0.7)}px`,
                      height: `${Math.min(50, boxHeight * 0.7)}px`,
                      borderRadius: "50%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      ...(embossDepth !== 0 ? {
                        boxShadow: embossDepth > 0 
                          ? `inset -1.5px -1.5px 3.5px rgba(255,255,255,0.75), inset 1.5px 1.5px 3.5px rgba(0,0,0,0.35), -2.5px -2.5px 6px rgba(255,255,255,0.48), 2.5px 2.5px 6px rgba(0,0,0,0.28)` 
                          : `inset 1.5px 1.5px 3.5px rgba(0,0,0,0.48), inset -1.5px -1.5px 3.5px rgba(255,255,255,0.25), 1.5px 1.5px 3.5px rgba(255,255,255,0.35)`,
                        border: embossDepth > 0 ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.18)",
                        transform: `translateZ(${embossDepth * 2.5}px)`
                      } : {}),
                      ...(foilType !== "none" ? {
                        background: foilType === "gold" 
                          ? "linear-gradient(135deg, #bf953f 0%, #fcf6ba 25%, #b38728 50%, #fbf5b7 75%, #aa771c 100%)"
                          : foilType === "silver"
                          ? "linear-gradient(135deg, #e3e3e3 0%, #fbfbfb 25%, #bebebe 50%, #f4f4f4 75%, #a2a2a2 100%)"
                          : foilType === "rose"
                          ? "linear-gradient(135deg, #e05c5c 0%, #ffabab 25%, #c43b3b 50%, #ffa5a5 75%, #9b1e1e 100%)"
                          : "linear-gradient(135deg, #ff007f 0%, #7f00ff 25%, #00ffff 50%, #00ff7f 75%, #ffff00 100%)",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.45)",
                        border: "none"
                      } : {
                        ...(activeViewMode === "spot-uv" ? {
                          background: "rgba(245, 158, 11, 0.16)",
                          border: "1px solid rgba(245, 158, 11, 0.85)",
                          boxShadow: "0 0 10px rgba(245, 158, 11, 0.35)",
                        } : activeViewMode === "spectrograph" ? {
                          background: "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(4, 120, 87, 0.4) 100%)",
                          border: "1.5px solid rgba(16, 185, 129, 0.8)",
                          boxShadow: "0 0 8px rgba(16, 185, 129, 0.45)",
                        } : {
                          background: stock === "luxury" ? "rgba(212, 175, 55, 0.08)" : "rgba(15, 23, 42, 0.02)",
                          border: `1.5px solid ${stock === "luxury" ? "rgba(212, 175, 55, 0.4)" : "rgba(15, 23, 42, 0.12)"}`
                        })
                      })
                    }}
                    className="flex flex-col items-center justify-center p-1 font-mono text-center shadow-inner"
                  >
                    <span 
                      style={{
                        fontSize: "6.2px",
                        fontWeight: "900",
                        textShadow: registrationShift !== 0 
                          ? `${registrationShift * 2}px 0 0 rgba(0, 255, 255, 0.95), ${-registrationShift * 2}px 0 0 rgba(255, 0, 255, 0.95), 0 ${registrationShift * 1.5}px 0 rgba(225, 225, 0, 0.8)` 
                          : "none",
                        color: foilType !== "none" ? "#0f172a" : "inherit"
                      }}
                      className="uppercase"
                    >
                      GEOM.CAPSULE
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-[4.5px] opacity-75 z-10 font-bold">
                  <span>KIDS_SAFE</span>
                  <span>PRE_PRESS</span>
                </div>
              </div>

              {/* LEFT TRI SLANT */}
              <div 
                style={{
                  width: `${boxWidth}px`,
                  height: `${boxHeight * 0.85}px`,
                  transformOrigin: "right",
                  transform: `translate3d(-${boxWidth}px, 0, 0) rotateY(${foldProgress * 120}deg)`,
                  transformStyle: "preserve-3d",
                  ...getPanelStyles()
                }}
                className={`absolute border p-1.5 flex flex-col justify-between font-mono text-[6.2px] ${getCutLineClass()}`}
              >
                {getBleedMarginOverlay()}
                {getCreaseHeatmapOverlay()}

                <div className="flex justify-between z-10">
                  <span>[SLANT_L]</span>
                  <span>120° FOLD</span>
                </div>
                <div className="h-0.5 bg-brand-accent/40 w-full flex self-center my-auto z-10" />
                <div className="text-left text-[5px] uppercase text-brand-accent z-10">[ALIGN_KEY_B]</div>
              </div>

              {/* RIGHT TRI SLANT */}
              <div 
                style={{
                  width: `${boxWidth}px`,
                  height: `${boxHeight * 0.85}px`,
                  transformOrigin: "left",
                  transform: `translate3d(${boxWidth}px, 0, 0) rotateY(${-foldProgress * 120}deg)`,
                  transformStyle: "preserve-3d",
                  ...getPanelStyles()
                }}
                className={`absolute border p-1.5 flex flex-col justify-between font-mono text-[6.2px] ${getCutLineClass()}`}
              >
                {getBleedMarginOverlay()}
                {getCreaseHeatmapOverlay()}

                <div className="flex justify-between text-right z-10">
                  <span>120°</span>
                  <span>[SLANT_R]</span>
                </div>
                <div className="h-0.5 bg-brand-accent/40 w-full flex self-center my-auto z-10" />
                <div className="text-right text-[5px] uppercase text-brand-accent z-10">[ALIGN_KEY_A]</div>
              </div>

              {/* APEX LOCKING FLAP (folds forward to lock the triangle) */}
              <div 
                style={{
                  width: `${boxWidth}px`,
                  height: `${boxDepth * 0.35}px`,
                  transformOrigin: "bottom",
                  transform: `translate3d(0, -${boxDepth * 0.35}px, 0) rotateX(${-foldAngles.lid * 1.3}deg)`,
                  transformStyle: "preserve-3d",
                  ...getPanelStyles()
                }}
                className={`absolute border p-1 flex flex-col justify-between font-mono text-[5.5px] ${getCutLineClass()}`}
              >
                {getBleedMarginOverlay()}
                {getCreaseHeatmapOverlay()}

                <div className="text-center font-bold uppercase text-brand-accent font-mono z-10">[LID LOCK]</div>
                <div className="text-center text-[4.5px] z-10 font-bold">INSERT Apex INTERLOCK</div>
              </div>

              {/* TRIANGULAR END PLATE BASE */}
              <div 
                style={{
                  width: `${boxWidth}px`,
                  height: `${boxHeight * 0.85}px`,
                  transformOrigin: "top",
                  transform: `translate3d(0, ${boxHeight * 0.85}px, 0) rotateX(${foldAngles.rear}deg)`,
                  transformStyle: "preserve-3d",
                  ...getPanelStyles(),
                  clipPath: "polygon(50% 100%, 0 0, 100% 0)"
                }}
                className={`absolute border p-1 flex flex-col justify-between font-mono text-[5px] ${getCutLineClass()}`}
              >
                {getBleedMarginOverlay()}
                {getCreaseHeatmapOverlay()}

                <div className="text-center font-bold text-brand-text/80 pt-1 z-10">BASE PILOT</div>
                <div className="text-center text-[4px] mt-2 mb-1 z-10">// PRISM PATTERN</div>
              </div>

            </div>
          )}

          {/* ==============================================
              PRESET 3: E-COMMERCE HEAVY DUTY MAILER BOX
              ============================================== */}
          {preset === "mailer" && (
            <div style={{ left: `-${boxWidth / 2}px`, top: `-${boxHeight / 2}px`, transformStyle: "preserve-3d" }} className="absolute">
              
              {/* PRIMARY FLOOR FRAME */}
              <div 
                style={{
                  width: `${boxWidth}px`,
                  height: `${boxHeight}px`,
                  transformStyle: "preserve-3d",
                  transform: "translate3d(0, 0, 0)",
                  ...getPanelStyles(true)
                }}
                className={`absolute border p-2 flex flex-col justify-between font-mono text-[6px] ${getCutLineClass()}`}
              >
                {getBleedMarginOverlay()}
                {getCreaseHeatmapOverlay()}

                <div className="flex justify-between font-bold z-10">
                  <span>[TRAY_FLOOR]</span>
                  {showAnnotations && <span>{boxWidth}x{boxHeight}mm</span>}
                </div>
                
                {/* ADVANCED REVERSIBLE FOIL, EMBOSS, CMYK EMBLEM */}
                <div className="relative my-auto flex flex-col items-center justify-center z-10 select-none">
                  <div 
                    style={{
                      width: `${Math.min(50, boxWidth * 0.7)}px`,
                      height: `${Math.min(50, boxHeight * 0.7)}px`,
                      borderRadius: "15%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      ...(embossDepth !== 0 ? {
                        boxShadow: embossDepth > 0 
                          ? `inset -1.5px -1.5px 3.5px rgba(255,255,255,0.75), inset 1.5px 1.5px 3.5px rgba(0,0,0,0.35), -2.5px -2.5px 6px rgba(255,255,255,0.48), 2.5px 2.5px 6px rgba(0,0,0,0.28)` 
                          : `inset 1.5px 1.5px 3.5px rgba(0,0,0,0.48), inset -1.5px -1.5px 3.5px rgba(255,255,255,0.25), 1.5px 1.5px 3.5px rgba(255,255,255,0.35)`,
                        border: embossDepth > 0 ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.18)",
                        transform: `translateZ(${embossDepth * 2.5}px)`
                      } : {}),
                      ...(foilType !== "none" ? {
                        background: foilType === "gold" 
                          ? "linear-gradient(135deg, #bf953f 0%, #fcf6ba 25%, #b38728 50%, #fbf5b7 75%, #aa771c 100%)"
                          : foilType === "silver"
                          ? "linear-gradient(135deg, #e3e3e3 0%, #fbfbfb 25%, #bebebe 50%, #f4f4f4 75%, #a2a2a2 100%)"
                          : foilType === "rose"
                          ? "linear-gradient(135deg, #e05c5c 0%, #ffabab 25%, #c43b3b 50%, #ffa5a5 75%, #9b1e1e 100%)"
                          : "linear-gradient(135deg, #ff007f 0%, #7f00ff 25%, #00ffff 50%, #00ff7f 75%, #ffff00 100%)",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.45)",
                        border: "none"
                      } : {
                        ...(activeViewMode === "spot-uv" ? {
                          background: "rgba(245, 158, 11, 0.16)",
                          border: "1px solid rgba(245, 158, 11, 0.85)",
                          boxShadow: "0 0 10px rgba(245, 158, 11, 0.35)",
                        } : activeViewMode === "spectrograph" ? {
                          background: "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(4, 120, 87, 0.4) 100%)",
                          border: "1.5px solid rgba(16, 185, 129, 0.8)",
                          boxShadow: "0 0 8px rgba(16, 185, 129, 0.45)",
                        } : {
                          background: stock === "luxury" ? "rgba(212, 175, 55, 0.08)" : "rgba(15, 23, 42, 0.02)",
                          border: `1.5px solid ${stock === "luxury" ? "rgba(212, 175, 55, 0.4)" : "rgba(15, 23, 42, 0.12)"}`
                        })
                      })
                    }}
                    className="flex flex-col items-center justify-center p-1.5 font-mono text-center shadow-inner"
                  >
                    <span 
                      style={{
                        fontSize: "5.5px",
                        fontWeight: "900",
                        textShadow: registrationShift !== 0 
                          ? `${registrationShift * 2}px 0 0 rgba(0, 255, 255, 0.95), ${-registrationShift * 2}px 0 0 rgba(255, 0, 255, 0.95), 0 ${registrationShift * 1.5}px 0 rgba(225, 225, 0, 0.8)` 
                          : "none",
                        color: foilType !== "none" ? "#0f172a" : "inherit"
                      }}
                      className="uppercase"
                    >
                      ECO_SHIPPER
                    </span>
                  </div>
                </div>

                <div className="text-right text-[4px] opacity-70 z-10 font-bold">BOX_R9</div>
              </div>

              {/* POSTERIOR CLAMSHELL WALL & COVER */}
              <div 
                style={{
                  width: `${boxWidth}px`,
                  height: `${boxDepth * 0.5}px`,
                  transformOrigin: "bottom",
                  transform: `translate3d(0, -${boxDepth * 0.5}px, 0) rotateX(${-foldAngles.rear}deg)`,
                  transformStyle: "preserve-3d",
                  ...getPanelStyles()
                }}
                className={`absolute border p-1.5 flex flex-col justify-between font-mono text-[5.5px] ${getCutLineClass()}`}
              >
                {getBleedMarginOverlay()}
                {getCreaseHeatmapOverlay()}

                <span className="font-bold text-amber-500 z-10">[REAR_WALL]</span>
                
                {/* INLINE ATTACHMENT: TOP LID HOOD (Clamshell Cover) */}
                <div 
                  style={{
                    width: `${boxWidth}px`,
                    height: `${boxHeight}px`,
                    transformOrigin: "bottom",
                    transform: `translate3d(0, -${boxHeight}px, 0) rotateX(${-foldAngles.lid}deg)`,
                    transformStyle: "preserve-3d",
                    ...getPanelStyles(true)
                  }}
                  className={`absolute left-0 border p-2 flex flex-col justify-between font-mono text-[5.5px] ${getCutLineClass()}`}
                >
                  {getBleedMarginOverlay()}
                  {getCreaseHeatmapOverlay()}
                  
                  <div className="flex justify-between items-baseline font-bold z-10">
                    <span>[CLAMSHELL_LID]</span>
                    <span className="text-[4.5px]">SHIP_LABEL_PANEL</span>
                  </div>
                  <div className="text-center text-[5px] border border-dashed border-brand-accent/40 py-1 font-bold bg-brand-bg/50 z-10">
                    FRAGILE // ECO MAIL_TACK
                  </div>
                  <div className="text-right text-[5px] z-10">WIND_EAR_LOCK</div>
                </div>

                <div className="text-right uppercase z-10 text-[5px]">POST_WING</div>
              </div>

              {/* ANTERIOR LIP BASE */}
              <div 
                style={{
                  width: `${boxWidth}px`,
                  height: `${boxDepth * 0.5}px`,
                  transformOrigin: "top",
                  transform: `translate3d(0, ${boxHeight}px, 0) rotateX(${foldAngles.rear}deg)`,
                  transformStyle: "preserve-3d",
                  ...getPanelStyles()
                }}
                className={`absolute border p-1 flex flex-col justify-between font-mono text-[5.5px] ${getCutLineClass()}`}
              >
                {getBleedMarginOverlay()}
                {getCreaseHeatmapOverlay()}

                <span className="font-bold z-10">[FRONT_LIP]</span>
                <div className="text-center font-bold text-[5.5px] tracking-wide my-auto text-brand-accent z-10">// CHASSIS LOCK //</div>
                <div className="text-right select-none text-[4.5px] z-10">SHIELD_GUARD</div>
              </div>

              {/* LEFT STABILIZER LOCK flap */}
              <div 
                style={{
                  width: `${boxDepth * 0.5}px`,
                  height: `${boxHeight}px`,
                  transformOrigin: "right",
                  transform: `translate3d(-${boxDepth * 0.5}px, 0, 0) rotateY(${foldAngles.ears}deg)`,
                  transformStyle: "preserve-3d",
                  ...getPanelStyles()
                }}
                className={`absolute border p-1 flex flex-col justify-between font-mono text-[5px] ${getCutLineClass()}`}
              >
                {getBleedMarginOverlay()}
                {getCreaseHeatmapOverlay()}

                <div className="font-bold text-center mt-1 z-10">[EAR_L]</div>
                <div className="h-2 bg-brand-accent/20 w-4/6 self-center my-auto rounded-sm z-10" />
                <div className="text-[4px] uppercase text-brand-accent text-center font-bold font-mono z-10">LOCK_TACK</div>
              </div>

              {/* RIGHT STABILIZER LOCK flap */}
              <div 
                style={{
                  width: `${boxDepth * 0.5}px`,
                  height: `${boxHeight}px`,
                  transformOrigin: "left",
                  transform: `translate3d(${boxWidth}px, 0, 0) rotateY(${-foldAngles.ears}deg)`,
                  transformStyle: "preserve-3d",
                  ...getPanelStyles()
                }}
                className={`absolute border p-1 flex flex-col justify-between font-mono text-[5px] ${getCutLineClass()}`}
              >
                {getBleedMarginOverlay()}
                {getCreaseHeatmapOverlay()}

                <div className="font-bold text-center mt-1 z-10">[EAR_R]</div>
                <div className="h-2 bg-brand-accent/20 w-4/6 self-center my-auto rounded-sm z-10" />
                <div className="text-[4px] uppercase text-brand-accent text-center font-bold font-mono z-10">LOCK_E_R</div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Assembly Control Deck & Material Configuration */}
      <div className="mt-4 space-y-4">
        
        {/* Dynamic Spec Sheet Readout */}
        <div className="bg-brand-bg/85 border border-brand-border/40 p-3 relative font-mono text-[8.5px] select-none shadow-inner grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="absolute top-1.5 right-1.5"><Info className="w-3.5 h-3.5 text-brand-accent/70 shrink-0" /></div>
          
          <div>
            <div className="text-brand-muted font-bold uppercase flex items-center gap-1">
              <Scale className="w-3 text-brand-accent shrink-0" />
              <span>Material weight</span>
            </div>
            <div className="text-brand-text font-black text-[10px] mt-0.5">{STOCKS[stock].weight}</div>
          </div>

          <div>
            <div className="text-brand-muted font-bold uppercase flex items-center gap-1">
              <Scissors className="w-3 text-brand-accent shrink-0" />
              <span>Caliper Thickness</span>
            </div>
            <div className="text-brand-text font-black text-[10px] mt-0.5">{STOCKS[stock].caliper}</div>
          </div>

          <div>
            <div className="text-brand-muted font-bold uppercase flex items-center gap-1">
              <span>Finish Grade</span>
            </div>
            <div className="text-brand-text font-black truncate max-w-[120px] text-[10px] mt-0.5">{STOCKS[stock].finish}</div>
          </div>

          <div>
            <div className="text-brand-muted font-bold uppercase flex items-center gap-1">
              <span>Dynamic Specs</span>
            </div>
            <div className="text-brand-text font-black text-[10px] mt-0.5 text-brand-accent">{boxWidth}x{boxHeight}x{boxDepth}mm</div>
          </div>
        </div>

        {/* Paperstock Material selector buttons */}
        <div className="space-y-1.5">
          <div className="font-mono text-[8px] uppercase tracking-widest text-brand-muted font-bold select-none">// SELECT PAPER STOCK SPECIFICATION:</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
            {(Object.keys(STOCKS) as StockID[]).map((stockId) => (
              <button
                key={stockId}
                onClick={() => {
                  setStock(stockId);
                  playFoldClick(200 + (stockId === "coated" ? 50 : stockId === "kraft" ? 120 : stockId === "luxury" ? 200 : 250), 0.05);
                }}
                className={`flex flex-col items-start p-2 border relative cursor-pointer text-left transition-all ${
                  stock === stockId
                    ? "bg-brand-accent/15 border-brand-accent text-brand-text"
                    : "glass-card text-brand-muted border-brand-border/30 hover:border-brand-muted hover:text-brand-text"
                }`}
              >
                <span className="font-mono text-[8.5px] font-black uppercase tracking-wider">{stockId === "coated" ? "Coated White" : stockId === "kraft" ? "Kraft Eco" : stockId === "luxury" ? "Obsidian Gold" : "Chroma Holo"}</span>
                <span className="text-[6.5px] font-mono text-brand-muted/70 truncate mt-0.5 select-none">{STOCKS[stockId].weight} Artboard</span>
                {stock === stockId && (
                  <span className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-brand-accent rounded-full animate-ping" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ===============================================================
            COCKPIT ADVANCED CAPABILITIES WORKSPACE INTERFACE (5-TABS)
            =============================================================== */}
        <div className="border border-brand-border/40 bg-brand-bg/95 p-1 select-none font-sans rounded-none relative">
          
          {/* Tab buttons Row */}
          <div className="flex border-b border-brand-border/40 overflow-x-auto text-[8.5px] font-mono uppercase bg-brand-bg/60 select-none">
            <button
              onClick={() => setActiveControlTab("struct")}
              className={`px-3 py-2 cursor-pointer border-r border-brand-border/40 whitespace-nowrap transition-colors flex items-center gap-1 font-bold ${activeControlTab === 'struct' ? 'bg-brand-accent/10 border-b-2 border-b-brand-accent text-brand-accent' : 'text-brand-muted hover:text-brand-text'}`}
            >
              <Sliders className="w-3" />
              <span>1. Structural Geometry</span>
            </button>
            <button
              onClick={() => setActiveControlTab("finish")}
              className={`px-3 py-2 cursor-pointer border-r border-brand-border/40 whitespace-nowrap transition-colors flex items-center gap-1 font-bold ${activeControlTab === 'finish' ? 'bg-brand-accent/10 border-b-2 border-b-brand-accent text-brand-accent' : 'text-brand-muted hover:text-brand-text'}`}
            >
              <Sparkles className="w-3" />
              <span>2. Embellishments</span>
            </button>
            <button
              onClick={() => setActiveControlTab("press")}
              className={`px-3 py-2 cursor-pointer border-r border-brand-border/40 whitespace-nowrap transition-colors flex items-center gap-1 font-bold ${activeControlTab === 'press' ? 'bg-brand-accent/10 border-b-2 border-b-brand-accent text-brand-accent' : 'text-brand-muted hover:text-brand-text'}`}
            >
              <Check className="w-3 text-[#00ffff]" />
              <span>3. Bleed & Registration</span>
            </button>
            <button
              onClick={() => setActiveControlTab("train")}
              className={`px-3 py-2 cursor-pointer border-r border-brand-border/40 whitespace-nowrap transition-colors flex items-center gap-1 font-bold ${activeControlTab === 'train' ? 'bg-brand-accent/10 border-b-2 border-b-brand-accent text-brand-accent' : 'text-brand-muted hover:text-brand-text'}`}
            >
              <ShieldCheck className="w-3 text-emerald-400" />
              <span>4. Assembly Steps</span>
            </button>
            <button
              onClick={() => setActiveControlTab("stress")}
              className={`px-3 py-2 cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1 font-bold ${activeControlTab === 'stress' ? 'bg-brand-accent/10 border-b-2 border-b-brand-accent text-brand-accent' : 'text-brand-muted hover:text-brand-text'}`}
            >
              <Flame className="w-3 text-rose-500" />
              <span>5. Stress & Fatigue</span>
            </button>
          </div>

          {/* Tab content screens */}
          <div className="p-3 bg-brand-bg/95 font-sans min-h-[145px]">
            
            {/* TAB 1: STRUCTURALgeometry */}
            {activeControlTab === "struct" && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Width slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[8.5px] uppercase tracking-wider text-brand-muted">
                      <span>Box Width (A)</span>
                      <span className="text-brand-text font-bold">{boxWidth} mm</span>
                    </div>
                    <input 
                      type="range"
                      min="60"
                      max="140"
                      value={boxWidth}
                      onChange={(e) => setBoxWidth(parseInt(e.target.value))}
                      className="w-full accent-brand-accent h-[2px] cursor-pointer bg-brand-border focus:outline-none"
                    />
                  </div>

                  {/* Height slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[8.5px] uppercase tracking-wider text-brand-muted">
                      <span>Box Height (B)</span>
                      <span className="text-brand-text font-bold">{boxHeight} mm</span>
                    </div>
                    <input 
                      type="range"
                      min="60"
                      max="140"
                      value={boxHeight}
                      onChange={(e) => setBoxHeight(parseInt(e.target.value))}
                      className="w-full accent-brand-accent h-[2px] cursor-pointer bg-brand-border focus:outline-none"
                    />
                  </div>

                  {/* Depth slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[8.5px] uppercase tracking-wider text-brand-muted">
                      <span>Box Depth (C)</span>
                      <span className="text-brand-text font-bold">{boxDepth} mm</span>
                    </div>
                    <input 
                      type="range"
                      min="30"
                      max="120"
                      value={boxDepth}
                      onChange={(e) => setBoxDepth(parseInt(e.target.value))}
                      className="w-full accent-brand-accent h-[2px] cursor-pointer bg-brand-border focus:outline-none"
                    />
                  </div>
                </div>

                <div className="border border-brand-border/30 bg-brand-bg/50 p-2.5 font-mono text-[8.5px] leading-tight flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <span className="text-brand-accent font-black">// CORRUGATING FLUTING CALIPER Profile:</span>
                    <div className="flex gap-1.5 mt-1">
                      {(["A", "B", "C", "E", "F"] as const).map((flute) => (
                        <button
                          key={flute}
                          onClick={() => setFluteProfile(flute)}
                          className={`px-2 py-0.5 border text-[8px] cursor-pointer font-bold ${fluteProfile === flute ? 'bg-brand-accent/25 text-brand-text border-brand-accent' : 'bg-brand-bg/40 border-brand-border/40 text-brand-muted hover:text-brand-text'}`}
                        >
                          {flute}-Flute
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-1.5 md:border-l md:border-brand-border/30 md:pl-4">
                    <div>
                      <span className="text-brand-muted uppercase font-bold text-[7.5px]">Required Blank Sheet:</span>
                      <div className="text-brand-text font-black text-[9.5px]">{flatWidth} x {flatHeight} mm</div>
                    </div>
                    <div>
                      <span className="text-brand-muted uppercase font-bold text-[7.5px]">Cylinder Area (Flat):</span>
                      <div className="text-brand-text font-black text-[9.5px]">{areaM2.toFixed(4)} m²</div>
                    </div>
                    <div>
                      <span className="text-brand-muted uppercase font-bold text-[7.5px]">Cardboard Yield Load:</span>
                      <div className="text-brand-accent font-black text-[10px]">{maxCompression} kN max</div>
                    </div>
                    <div>
                      <span className="text-brand-muted uppercase font-bold text-[7.5px]">Nesting Trim Waste:</span>
                      <div className="text-rose-400 font-black text-[9.5px]">{estimatedWaste}% trim</div>
                    </div>
                    <div>
                      <span className="text-brand-muted uppercase font-bold text-[7.5px]">Box Volume/Capacity:</span>
                      <div className="text-brand-text font-black text-[9.5px]">{boxVolumeLiters} L ({boxVolumeCm3} mL)</div>
                    </div>
                    <div>
                      <span className="text-brand-muted uppercase font-bold text-[7.5px]">Fibre Blank Weight:</span>
                      <div className="text-[#00FF00] font-black text-[9.5px]">{estimatedSheetWeightGrams} grams</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: INTERACTIVE EMBOSSING & STAMPING SCREEN */}
            {activeControlTab === "finish" && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[8.5px] uppercase tracking-wider text-brand-muted">
                      <span>Raised Embossing / Debossing Depth</span>
                      <span className="text-brand-accent font-bold">{embossDepth > 0 ? `+${embossDepth.toFixed(1)}` : embossDepth.toFixed(1)} mm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[7px] text-brand-muted">DEBOSS</span>
                      <input 
                        type="range"
                        min="-3.0"
                        max="3.0"
                        step="0.1"
                        value={embossDepth}
                        onChange={(e) => setEmbossDepth(parseFloat(e.target.value))}
                        className="flex-1 accent-brand-accent h-[2px] cursor-pointer bg-brand-border focus:outline-none"
                      />
                      <span className="font-mono text-[7px] text-brand-accent font-bold">EMBOSS</span>
                    </div>
                  </div>

                  <div className="space-y-1 font-mono text-[8px] leading-tight select-none">
                    <span className="text-brand-muted uppercase font-bold font-mono">// SELECT HOT METALLIC FOIL STAMP:</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {[
                        { id: "none", name: "No Foil" },
                        { id: "gold", name: "24k Gold" },
                        { id: "silver", name: "Silver Leaf" },
                        { id: "rose", name: "Rose Coated" },
                        { id: "holo", name: "Holo" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setFoilType(item.id as any)}
                          className={`px-2 py-0.5 border text-[7.5px] uppercase font-bold cursor-pointer ${foilType === item.id ? 'bg-brand-accent/25 border-brand-accent text-brand-text' : 'bg-brand-bg/60 border-brand-border/40 text-brand-muted hover:text-brand-text'}`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 font-mono text-[8px] leading-tight select-none">
                    <span className="text-brand-muted uppercase font-bold font-mono">// SELECT DIE-CUT WINDOW SHAPE:</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {[
                        { id: "none", name: "Solid Box" },
                        { id: "circle", name: "Circle Cut" },
                        { id: "hexagon", name: "Hexagon Cut" },
                        { id: "arch", name: "Arch Cut" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setDieCutWindow(item.id as any);
                            playFoldClick(320, 0.05);
                          }}
                          className={`px-2 py-0.5 border text-[7.5px] uppercase font-bold cursor-pointer ${dieCutWindow === item.id ? 'bg-brand-accent/25 border-brand-accent text-brand-text' : 'bg-brand-bg/60 border-brand-border/40 text-brand-muted hover:text-brand-text'}`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-brand-border/20 pt-3">
                  <div className="space-y-1 font-mono text-[8px] leading-tight select-none">
                    <span className="text-brand-muted uppercase font-bold font-mono">// SELECT PRINT PATTERN OVERLAY:</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {[
                        { id: "none", name: "Solid Color" },
                        { id: "lines", name: "Diagonal Lines" },
                        { id: "grid", name: "Engineering Grid" },
                        { id: "diamond", name: "Diamonds" },
                        { id: "leaf", name: "Organic Leaf" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActivePattern(item.id as any);
                            playFoldClick(300, 0.05);
                          }}
                          className={`px-2 py-0.5 border text-[7.5px] uppercase font-bold cursor-pointer ${activePattern === item.id ? 'bg-brand-accent/25 border-brand-accent text-brand-text' : 'bg-brand-bg/60 border-brand-border/40 text-brand-muted hover:text-brand-text'}`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 font-mono text-[8px] leading-tight select-none flex flex-col justify-end">
                    <div className="flex justify-between border-b border-brand-border/10 pb-1 mb-1">
                      <span className="text-brand-muted">Active Pattern Stock:</span>
                      <span className="text-white font-bold">{activePattern.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Gloss Finish Varnish:</span>
                      <span className="text-brand-accent font-bold">{glossOverlayActive ? "AQUEOUS GLOSS ACTIVE" : "MATTE ONLY"}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-brand-border/40 bg-brand-bg/60 p-2 text-left font-mono text-[8px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-brand-border/20 pt-3">
                  <div>
                    <span className="text-brand-accent font-bold uppercase select-none">// Active Layout Render Overlay Mode:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {[
                        { id: "design", label: "Standard 3D Art", short: "3D Art" },
                        { id: "spectrograph", label: "Aqueous Plate Spectrograph", short: "Spectrograph" },
                        { id: "spot-uv", label: "Selective Spot-UV Mask", short: "Spot-UV" }
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => {
                            setActiveViewMode(mode.id as any);
                            playFoldClick(340, 0.06);
                          }}
                          className={`px-2 py-0.5 border text-[7.5px] cursor-pointer font-bold select-none ${activeViewMode === mode.id ? 'bg-brand-accent/20 border-brand-accent text-brand-accent' : 'bg-brand-bg/40 border-brand-border/40 text-brand-muted hover:text-brand-text'}`}
                        >
                          <span className="hidden sm:inline">{mode.label}</span>
                          <span className="sm:hidden">{mode.short}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-left sm:text-right text-[7px] text-brand-muted max-w-xs">
                    Selective varnish maps reflect dynamic light as structural folding angles shift.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CMYK PLATE BLEED & REGISTRATION SHIFT */}
            {activeControlTab === "press" && (
              <div className="space-y-3 font-mono text-[8px] leading-tight">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[8.5px] uppercase tracking-wider text-brand-muted">
                      <span>CMYK Cylinder Plates Registration Fringing Offset</span>
                      <span className={`font-bold ${registrationShift !== 0 ? 'text-rose-400 animate-pulse' : 'text-brand-accent'}`}>
                        {registrationShift === 0 ? "Perfect Calibration (0.0mm)" : `${registrationShift > 0 ? `+${registrationShift.toFixed(1)}` : registrationShift.toFixed(1)} mm`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[7px] text-brand-muted">-2.0mm [C]</span>
                      <input 
                        type="range"
                        min="-2.0"
                        max="2.0"
                        step="0.1"
                        value={registrationShift}
                        onChange={(e) => setRegistrationShift(parseFloat(e.target.value))}
                        className="flex-1 accent-brand-accent h-[2px] cursor-pointer bg-brand-border focus:outline-none"
                      />
                      <span className="text-[7px] text-brand-accent font-bold">+2.0mm [Y]</span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center bg-brand-bg/40 p-2 border border-brand-border/30">
                    <span className="text-brand-accent font-bold uppercase">// Pre-Press Registration Slip:</span>
                    <p className="text-[7.5px] text-brand-muted mt-1">
                      Physical plates misalignments separate color channels, causing fringing shadows to warn press operators.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-brand-border/30 bg-brand-bg/60 p-2">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 font-mono text-[8.5px] text-brand-muted hover:text-brand-text cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={showBleedLines} 
                        onChange={(e) => setShowBleedLines(e.target.checked)}
                        className="rounded-none accent-brand-accent border-brand-border bg-brand-bg/60 w-3 h-3 cursor-pointer animate-none" 
                      />
                      <span className={showBleedLines ? "text-brand-accent font-bold" : "text-brand-muted"}>[OVERLAY BLEED & SAFE ZONE MARGINS]</span>
                    </label>
                  </div>
                  <div className="text-left sm:text-right text-[7.5px] text-brand-muted leading-none">
                    <span className="text-red-400 inline-block mr-1">■</span> Bleed Line (+3.2mm Trim Zone) | <span className="text-emerald-400 inline-block mr-1">■</span> Safe Text Margin (3mm Inward)
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ASSEMBLY WORKSPACE ACADEMY */}
            {activeControlTab === "train" && (
              <div className="space-y-3 font-mono text-[8px] leading-tight select-none">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-brand-border/30 pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        setTrainingMode(!trainingMode);
                        if (!trainingMode) {
                          setFoldProgress(0);
                          setCurrentStep(1);
                        }
                      }}
                      className={`px-2 py-1 border text-[8px] font-bold cursor-pointer transition-colors ${trainingMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' : 'bg-brand-bg/60 border-brand-border/40 text-brand-muted hover:text-brand-text'}`}
                    >
                      {trainingMode ? "DISABLE TRAINING SYSTEM" : "ACTIVATE SEQUENTIAL GUIDE"}
                    </button>
                    {trainingMode && (
                      <span className="text-brand-accent font-bold text-[8px] uppercase tracking-widest animate-pulse">
                        ● ACADEMY TUTORIAL ENGAGED
                      </span>
                    )}
                  </div>

                  {trainingMode && (
                    <div className="flex items-center gap-1.5 justify-between sm:justify-end w-full sm:w-auto">
                      <span className="text-brand-muted font-bold uppercase">Cadet Crease Match Score:</span>
                      <span className="text-[10px] font-black text-brand-text bg-brand-accent/20 border border-brand-accent px-1.5 py-0.5 rounded-[1px] shrink-0">
                        {currentStep === 1 && Math.abs(foldProgress - 0.33) < 0.06 ? "100% (CRITICAL MATCH)" : 
                         currentStep === 2 && Math.abs(foldProgress - 0.66) < 0.06 ? "100% (CRITICAL MATCH)" :
                         currentStep === 3 && Math.abs(foldProgress - 1.0) < 0.06 ? "100% (CRITICAL MATCH)" :
                         Math.round(100 - Math.abs(foldProgress - (currentStep === 1 ? 0.33 : currentStep === 2 ? 0.66 : 1.0)) * 100) + "% Accuracy"}
                      </span>
                    </div>
                  )}
                </div>

                {!trainingMode ? (
                  <div className="p-4 bg-brand-bg/40 border border-brand-border/30 text-center flex flex-col items-center justify-center">
                    <span className="text-brand-accent font-black uppercase text-[9px] mb-1">Step-by-Step Interactive Cadet Training Course</span>
                    <p className="text-brand-muted text-[7.5px] max-w-lg leading-relaxed font-sans">
                      Activates our sequential pre-press simulation. Teaches correct fold intervals step-by-step to achieve high-friction notch security and prevent paper ruptures.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
                    <div className="md:col-span-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-brand-accent text-brand-bg px-1.5 py-0.5 font-black text-[9px] rounded-sm">STEP {currentStep} OF 3</span>
                        <span className="text-brand-text font-bold text-[9px] uppercase tracking-wide">
                          {currentStep === 1 ? "Prep-Crease Wings and Side Wall Elements" :
                           currentStep === 2 ? "Hinged Base Chassis and Posteriors" :
                           "Engage Secure Cover Lid Friction Insert"}
                        </span>
                      </div>

                      <p className="text-brand-muted text-[8px] bg-brand-bg/60 p-2 border border-brand-border/30 leading-relaxed font-sans">
                        {currentStep === 1 
                          ? "Instruct Cadet: Drag the Theoretical Assembly folding progress slider to exactly 33%. This replicates pre-creasing lateral fold wings so box sides do not tear."
                          : currentStep === 2
                          ? "Instruct Cadet: Squeeze folding pressure to exactly 66%. This hinges the back panels backwards to establish 3D structural parameters."
                          : "Instruct Cadet: Advance the folding progress slider to 100% (Full Complete). Check cardboard safety spring-back stress indicator values."}
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (currentStep > 1) setCurrentStep(currentStep - 1);
                          }}
                          disabled={currentStep === 1}
                          className="px-2 py-0.5 border text-[7.5px] border-brand-border/40 hover:border-brand-muted disabled:opacity-50 text-brand-muted cursor-pointer"
                        >
                          ◀ BACK
                        </button>
                        <button
                          onClick={() => {
                            if (currentStep < 3) setCurrentStep(currentStep + 1);
                          }}
                          disabled={currentStep === 3}
                          className="px-2 py-0.5 border text-[7.5px] border-brand-border/40 hover:border-brand-muted disabled:opacity-50 text-brand-muted cursor-pointer"
                        >
                          CONTINUE ▶
                        </button>
                      </div>
                    </div>

                    <div className="bg-brand-bg/60 p-2 border border-brand-border/30 flex flex-col justify-between">
                      <div>
                        <span className="text-[7.5px] font-bold text-brand-muted uppercase">// Target Progress:</span>
                        <div className="text-brand-text font-black text-[10px] mt-0.5">
                          {currentStep === 1 ? "33% Complete" : currentStep === 2 ? "66% Complete" : "100% Complete"}
                        </div>
                      </div>
                      <div className="border-t border-brand-border/30 pt-1.5 mt-1.5">
                        <span className="text-[7.5px] font-bold text-brand-muted uppercase">// Fold Verification:</span>
                        <div className={`text-[9px] font-bold mt-0.5 uppercase ${
                          currentStep === 1 && Math.abs(foldProgress - 0.33) < 0.05 ? "text-emerald-400 font-extrabold" :
                          currentStep === 2 && Math.abs(foldProgress - 0.66) < 0.05 ? "text-emerald-400 font-extrabold" :
                          currentStep === 3 && Math.abs(foldProgress - 1.0) < 0.05 ? "text-emerald-400 font-extrabold" :
                          "text-amber-500 animate-pulse"
                        }`}>
                          {currentStep === 1 && Math.abs(foldProgress - 0.33) < 0.05 ? "✓ Target Hit!" :
                           currentStep === 2 && Math.abs(foldProgress - 0.66) < 0.05 ? "✓ Target Hit!" :
                           currentStep === 3 && Math.abs(foldProgress - 1.0) < 0.05 ? "✓ Target Hit!" :
                           "Adjust Fold Slider"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: CREASE FATIGUE & THERMAL SCAN GRAPH SCREEN */}
            {activeControlTab === "stress" && (
              <div className="space-y-3 font-mono text-[8px] leading-tight select-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-brand-bg/40 p-2.5 border border-brand-border/30 flex flex-col justify-between">
                    <div>
                      <h6 className="text-[8.5px] font-black text-brand-accent uppercase">// Crease Fatigue Predictor Pulsing Thermography:</h6>
                      <p className="text-[7.2px] text-brand-muted mt-1 leading-relaxed">
                        Assess physical fiber limits under pressure. Seams will glow pulsing red/orange thermal maps dynamically as rotation stresses increase.
                      </p>
                    </div>

                    <div className="mt-2.5">
                      <label className="flex items-center gap-1.5 font-mono text-[8px] text-brand-muted hover:text-brand-text cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={showStressHeatmap} 
                          onChange={(e) => setShowStressHeatmap(e.target.checked)}
                          className="rounded-none accent-red-500 border-brand-border bg-brand-bg/60 w-3 h-3 cursor-pointer" 
                        />
                        <span className={showStressHeatmap ? "text-red-400 font-bold" : "text-brand-muted"}>[RUN INTERACTIVE SEAM THERMICS]</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-brand-bg/60 p-2.5 border border-brand-border/30 flex flex-col justify-between leading-normal justify-self-stretch">
                    <div>
                      <span className="text-brand-accent font-bold uppercase select-none">// Fold-Tension Friction Lock Assessment:</span>
                      <div className="flex gap-2 items-center mt-1.5 bg-brand-bg p-1 border border-brand-border/30">
                        <span className={`text-[11px] font-black uppercase ${frictionLock.color}`}>{frictionLock.status}</span>
                      </div>
                      <p className="text-[7.5px] text-brand-muted font-sans mt-1 leading-normal">
                        {frictionLock.desc}
                      </p>
                    </div>

                    {inkSaturationWarning && (
                      <div className="border-t border-red-500/20 pt-1.5 mt-1.5 font-mono text-[7px] text-rose-400 animate-pulse uppercase leading-none font-bold">
                        ⚠️ Kraft Saturation: Organic unbleached kraft fibers absorb offset inks less efficiently. Smudge risk: +45%.
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-brand-bg/90 border border-brand-border/40 p-2 font-mono text-[7.5px] flex justify-between">
                  <span>STIFFNESS COEFFICIENT: {(stiffnessN * 1.5).toFixed(1)} N·mm²</span>
                  <span>TENSILE COMPRESSION: {STOCKS[stock].caliperNum > 0.5 ? "38.2 kN/m" : "21.6 kN/m"}</span>
                  <span className={tearRiskText.includes("🚨") ? "text-rose-400 font-bold" : "text-brand-accent"}>TEAR STATUS: {tearRiskText}</span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Die-Cut Layout Options & Simulation folding mode controls */}
        <div className="flex flex-wrap gap-4 items-center justify-between border-t border-b border-brand-border/30 py-3 select-none">
          {/* Visual checks filter columns */}
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-1.5 font-mono text-[8.5px] text-brand-muted hover:text-brand-text cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                checked={showCutLines} 
                onChange={(e) => setShowCutLines(e.target.checked)}
                className="rounded-none accent-brand-accent border-brand-border bg-brand-bg/60 w-3 h-3 cursor-pointer" 
              />
              <span className={showCutLines ? "text-brand-accent font-bold" : "text-brand-muted"}>[DIE CUTS]</span>
            </label>

            <label className="flex items-center gap-1.5 font-mono text-[8.5px] text-brand-muted hover:text-brand-text cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                checked={showCreaseLines} 
                onChange={(e) => setShowCreaseLines(e.target.checked)}
                className="rounded-none accent-brand-accent border-brand-border bg-brand-bg/60 w-3 h-3 cursor-pointer" 
              />
              <span className={showCreaseLines ? "text-brand-accent font-bold" : "text-brand-muted"}>[CREASE MARKS]</span>
            </label>

            <label className="flex items-center gap-1.5 font-mono text-[8.5px] text-brand-muted hover:text-brand-text cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                checked={showAnnotations} 
                onChange={(e) => setShowAnnotations(e.target.checked)}
                className="rounded-none accent-brand-accent border-brand-border bg-brand-bg/60 w-3 h-3 cursor-pointer" 
              />
              <span className={showAnnotations ? "text-brand-accent font-bold" : "text-brand-muted"}>[ANNOTATE]</span>
            </label>

            <label className="flex items-center gap-1.5 font-mono text-[8.5px] text-brand-muted hover:text-brand-text cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                checked={glossOverlayActive} 
                onChange={(e) => setGlossOverlayActive(e.target.checked)}
                className="rounded-none accent-brand-accent border-brand-border bg-brand-bg/60 w-3 h-3 cursor-pointer" 
              />
              <span className={glossOverlayActive ? "text-brand-accent font-bold" : "text-brand-muted"}>[GLOSS SPOT-UV]</span>
            </label>
          </div>

          {/* Spin and active motion automation toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setFoldMode(foldMode === "unified" ? "sequential" : "unified");
                playFoldClick(410, 0.05);
              }}
              className={`p-1 flex items-center font-mono text-[8.5px] border cursor-pointer select-none transition-colors ${
                foldMode === "sequential" 
                  ? "bg-brand-accent/25 text-brand-accent border-brand-accent" 
                  : "bg-brand-bg/60 border-brand-border/40 text-brand-muted"
              }`}
            >
              <span>{foldMode === "sequential" ? "[SEQ_FOLD: ACTIVE]" : "[UNIFIED_FOLD]"}</span>
            </button>

            <button
              onClick={() => {
                autoSpin ? setAutoSpin(false) : setAutoSpin(true);
                playFoldClick(380, 0.04);
              }}
              className={`px-2 py-1 flex items-center gap-1 font-mono text-[8.5px] uppercase font-bold border cursor-pointer select-none transition-colors ${
                autoSpin 
                  ? "bg-brand-accent/15 text-brand-accent border-brand-accent" 
                  : "bg-brand-bg/20 text-brand-muted border-brand-border/40 hover:text-brand-text"
              }`}
            >
              {autoSpin ? <Pause className="w-2.5 h-2.5 shrink-0" /> : <Play className="w-2.5 h-2.5 shrink-0" />}
              <span>AUTO_SPIN</span>
            </button>
          </div>
        </div>

        {/* Hinge alignment Assemble Slider */}
        <div className="space-y-2.5">
          <div className="flex justify-between font-mono text-[8.5px] uppercase text-brand-muted font-bold select-none">
            <span className="flex items-center gap-1">
              <Sliders className="w-3 text-brand-accent shrink-0" />
              Theoretical Assembly fold
            </span>
            <span className="text-brand-text font-black tracking-widest">{Math.round(foldProgress * 100)}% COMPLETE</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-mono text-[7px] text-brand-muted select-none">180° FLAT</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.005"
              value={foldProgress}
              onChange={(e) => {
                setFoldProgress(parseFloat(e.target.value));
              }}
              className="flex-1 accent-brand-accent h-[2.5px] bg-brand-border cursor-pointer appearance-none outline-none"
            />
            <span className="font-mono text-[7px] text-brand-accent font-black select-none">90° FOLDED</span>
          </div>
          
          {/* Assist tip hover instructions */}
          <div className="flex items-center gap-1.5 justify-center py-1 bg-brand-accent/5 border border-dashed border-brand-accent/20 text-brand-accent text-[7.5px] uppercase tracking-wider select-none">
            <Compass className="w-3 h-3 text-brand-accent animate-spin-slow shrink-0" />
            <span>Click & Drag viewport zone with cursor to Orbit model manually</span>
          </div>
        </div>

      </div>
    </div>
  );
}
