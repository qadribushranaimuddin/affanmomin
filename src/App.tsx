import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useScroll } from 'motion/react';
import { 
  FolderGit, 
  Layers, 
  Briefcase, 
  Sparkles, 
  Plus, 
  Mail, 
  ArrowUpRight, 
  Compass, 
  Maximize2,
  Instagram,
  Twitter,
  Github,
  Sun,
  Moon,
  Menu,
  X,
  GraduationCap,
  Cpu,
  MessageSquare
} from 'lucide-react';

import Navbar from './components/Navbar';
import { Analytics } from "@vercel/analytics/react";
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import PortfolioShowcase from './components/PortfolioShowcase';
import WorkGallery from './components/WorkGallery';
import ExperienceTimeline from './components/ExperienceTimeline';
import SkillsGrid from './components/SkillsGrid';
import ContactHub from './components/ContactHub';
import MarginCalibrationStamps from './components/MarginCalibrationStamps';
import ParallaxGraphic from './components/ParallaxGraphic';
import InteractiveLab from './components/InteractiveLab';
import ScrollCanvas from './components/ScrollCanvas';

interface TiltCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variants?: any;
  whileHover?: any;
}

function TiltCard({ children, onClick, className, variants, whileHover }: TiltCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for smooth physical rotation damping
  const springConfig = { damping: 22, stiffness: 260, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), springConfig);

  const shineBg = useTransform(
    [x, y],
    ([vx, vy]) => `radial-gradient(circle at ${(vx + 0.5) * 100}% ${(vy + 0.5) * 100}%, rgba(255, 62, 0, 0.15) 0%, transparent 60%)`
  );

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

  return (
    <div style={{ perspective: '800px' }} className="h-full">
      <motion.div
        variants={variants}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        whileHover={whileHover}
        whileTap={{ scale: 0.98 }}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={className}
      >
        <div style={{ transform: 'translateZ(18px)', transformStyle: 'preserve-3d' }} className="h-full w-full flex flex-col justify-between relative z-10">
          {children}
        </div>

        {/* Dynamic Glass Glare Shine Overlay on Top */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-20 rounded-lg" 
          style={{ 
            background: shineBg,
            transform: 'translateZ(25px)', 
            transformStyle: 'preserve-3d'
          }} 
        />
      </motion.div>
    </div>
  );
}

const bentoContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const bentoItemVariants = {
  hidden: { opacity: 0, y: 25 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
};

const sectionAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring",
      stiffness: 120,
      damping: 22,
      duration: 0.4
    } 
  }
};

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const d1 = useTransform(scrollYProgress, [0.0, 0.08], [0, 1]);
  const d2 = useTransform(scrollYProgress, [0.0, 0.12], [0, 1]);
  const d3 = useTransform(scrollYProgress, [0.05, 0.20], [0, 1]);
  const d4 = useTransform(scrollYProgress, [0.08, 0.25], [0, 1]);
  const d5 = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  const d6 = useTransform(scrollYProgress, [0.20, 0.40], [0, 1]);
  const d7 = useTransform(scrollYProgress, [0.30, 0.50], [0, 1]);
  const d8 = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);
  const d9 = useTransform(scrollYProgress, [0.45, 0.65], [0, 1]);
  const d10 = useTransform(scrollYProgress, [0.50, 0.70], [0, 1]);
  const d11 = useTransform(scrollYProgress, [0.60, 0.80], [0, 1]);
  const d12 = useTransform(scrollYProgress, [0.65, 0.85], [0, 1]);
  const d13 = useTransform(scrollYProgress, [0.75, 0.95], [0, 1]);
  const d14 = useTransform(scrollYProgress, [0.80, 1.0], [0, 1]);

  const names = [
    "افان",       // Urdu
    "عفان",       // Arabic
    "अफ्फान",     // Hindi
    "アッファン",   // Japanese
    "ಅಫ್ಫಾನ್",     // Kannada
    "阿凡",       // Chinese
    "Аффан",      // Russian/Cyrillic
    "아판",       // Korean
    "அஃப்பான்",    // Tamil
    "Αφάν",       // Greek
  ];

  const [nameIndex, setNameIndex] = useState(0);

  useEffect(() => {
    const nameInterval = setInterval(() => {
      setNameIndex((prev) => (prev + 1) % names.length);
    }, 5000);
    return () => clearInterval(nameInterval);
  }, []);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // Ignore security errors in sandboxed iframes
    }
  }, [theme]);
  const [threeDStyle, setThreeDStyle] = useState<string>(() => {
    try {
      return localStorage.getItem("3d-style") || "off";
    } catch (e) {
      return "off";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("3d-style", threeDStyle);
    } catch (e) {}
  }, [threeDStyle]);

  const toggleThreeDStyle = () => {
    const styles = ["off", "origami", "console", "highway", "blueprint", "typography", "hologram"];
    const currentIndex = styles.indexOf(threeDStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    setThreeDStyle(styles[nextIndex]);
  };
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);

  const footerParticles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => {
      const startX = Math.random() * 100;
      return {
        id: i,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 5,
        duration: Math.random() * 6 + 4,
        startX: startX,
        drift1: startX + (Math.random() * 10 - 5),
        drift2: startX + (Math.random() * 10 - 5)
      };
    });
  }, []);

  // Mouse trail tracker for the vector reticle scope
  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!cursorVisible) setCursorVisible(true);
    };

    const handleMouseLeaveWindow = () => {
      setCursorVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setCursorVisible(true);
    };

    // Use event delegation for detecting hover over interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') || 
        target.closest('.cursor-pointer') || 
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer');

      if (isInteractive) {
        setCursorHovered(true);
      } else {
        setCursorHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
    };
  }, [cursorVisible]);

  // Interactive quick links scrolling tracker
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const sections = [
        'hero-section',
        'about-section',
        'experience-section',
        'portfolio-section',
        'gallery-section',
        'skills-section',
        'lab-section',
        'contact-section'
      ];

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.replace('-section', ''));
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToEl = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text transition-colors duration-300 font-sans antialiased overflow-x-hidden selection:bg-[#FF3E00] selection:text-black relative">
      {/* Authentic Margin Calibration Stamps & Color Bars */}
      <MarginCalibrationStamps />

      {/* Dynamic Scroll Progress Indicator */}
      <motion.div className="scroll-progress-bar" style={{ scaleX }} />

      {/* Dynamic Subtle Mesh Background & Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.22] z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1f1f1f_1px,transparent_1.5px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute inset-0 halftone-bg opacity-30"></div>
        
        {/* Slow-morphing Ambient Light Orbs */}
        <div className="liquid-orb liquid-orb-1 absolute top-12 left-10 w-[450px] h-[450px] bg-[#FF3E00]/8 rounded-full blur-[100px]" />
        <div className="liquid-orb liquid-orb-2 absolute bottom-24 right-10 w-[550px] h-[550px] bg-[#FFA200]/4 rounded-full blur-[120px]" />
        
        {/* Absolute Glowing Ambient Light */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#FF3E00]/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Design Vector Blueprint Doodles Scattered Throughout the Website */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Doodle 1: Hero Left - Bézier Curve */}
        <div className="absolute top-[180px] left-[4%] opacity-[0.03] dark:opacity-[0.02]">
          <svg className="w-[320px] h-[150px] text-brand-accent stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none">
            <motion.path d="M 10,100 C 110,0 210,200 310,100" strokeWidth="1.5" strokeDasharray="4 4" style={{ pathLength: d1 }} />
            <motion.rect x="6" y="96" width="8" height="8" fill="currentColor" style={{ opacity: d1 }} />
            <motion.rect x="306" y="96" width="8" height="8" fill="currentColor" style={{ opacity: d1 }} />
            <motion.circle cx="110" cy="0" r="4" fill="currentColor" style={{ opacity: d1 }} />
            <motion.line x1="10" y1="100" x2="110" y2="0" strokeWidth="1" style={{ pathLength: d1 }} />
            <motion.circle cx="210" cy="200" r="4" fill="currentColor" style={{ opacity: d1 }} />
            <motion.line x1="310" y1="100" x2="210" y2="200" strokeWidth="1" style={{ pathLength: d1 }} />
            <motion.text x="120" y="125" className="font-mono text-[9px] fill-current stroke-none" style={{ opacity: d1 }}>pen_tool_path.eps</motion.text>
          </svg>
        </div>

        {/* Doodle 2: Hero Right - Die-Cut Box Template */}
        <div className="absolute top-[120px] right-[4%] opacity-[0.03] dark:opacity-[0.02] hidden md:block">
          <svg className="w-[260px] h-[180px] text-brand-accent stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none">
            <motion.rect x="10" y="20" width="220" height="130" strokeWidth="1.5" rx="8" style={{ pathLength: d2 }} />
            <motion.rect x="0" y="10" width="240" height="150" strokeWidth="1" strokeDasharray="5 3" style={{ pathLength: d2 }} />
            <motion.text x="15" y="40" className="font-mono text-[9px] fill-current stroke-none" style={{ opacity: d2 }}>DIE-CUT & BLEED (3mm)</motion.text>
            <motion.line x1="-10" y1="20" x2="250" y2="20" strokeWidth="0.8" strokeDasharray="1 4" style={{ pathLength: d2 }} />
            <motion.line x1="10" y1="-10" x2="10" y2="170" strokeWidth="0.8" strokeDasharray="1 4" style={{ pathLength: d2 }} />
          </svg>
        </div>

        {/* Doodle 3: About Left - Golden Ratio Spiral */}
        <div className="absolute top-[850px] left-[5%] opacity-[0.03] dark:opacity-[0.02]">
          <svg className="w-[180px] h-[180px] text-brand-accent stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none">
            <motion.rect x="0" y="0" width="180" height="180" strokeWidth="1" style={{ pathLength: d3 }} />
            <motion.line x1="111" y1="0" x2="111" y2="180" strokeWidth="0.8" style={{ pathLength: d3 }} />
            <motion.line x1="111" y1="111" x2="180" y2="111" strokeWidth="0.8" style={{ pathLength: d3 }} />
            <motion.line x1="153" y1="0" x2="153" y2="111" strokeWidth="0.8" style={{ pathLength: d3 }} />
            <motion.line x1="111" y1="42" x2="153" y2="42" strokeWidth="0.8" style={{ pathLength: d3 }} />
            <motion.path d="M 0,180 A 180,180 0 0,1 180,0" strokeWidth="1.2" style={{ pathLength: d3 }} />
            <motion.text x="10" y="25" className="font-mono text-[9px] fill-current stroke-none" style={{ opacity: d3 }}>GOLDEN_RATIO_1.618</motion.text>
          </svg>
        </div>

        {/* Doodle 4: About Right - Typography outlines */}
        <div className="absolute top-[1150px] right-[6%] opacity-[0.03] dark:opacity-[0.02] hidden lg:block">
          <svg className="w-[240px] h-[160px] text-brand-accent stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none">
            <motion.text x="10" y="110" className="font-sans text-[110px] font-black fill-none stroke-current opacity-30 select-none" style={{ opacity: d4 }}>Ag</motion.text>
            <motion.line x1="-10" y1="110" x2="220" y2="110" strokeWidth="1" strokeDasharray="4 4" style={{ pathLength: d4 }} />
            <motion.text x="150" y="125" className="font-mono text-[8px] fill-current stroke-none" style={{ opacity: d4 }}>Baseline (y=0)</motion.text>
            <motion.line x1="-10" y1="30" x2="220" y2="30" strokeWidth="1" strokeDasharray="4 4" style={{ pathLength: d4 }} />
            <motion.text x="150" y="25" className="font-mono text-[8px] fill-current stroke-none" style={{ opacity: d4 }}>Cap Height</motion.text>
          </svg>
        </div>

        {/* Doodle 5: Timeline Left - CMYK Registration Target */}
        <div className="absolute top-[1700px] left-[6%] opacity-[0.03] dark:opacity-[0.02] hidden md:block">
          <svg className="w-[180px] h-[100px] text-brand-accent stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none">
            <motion.circle cx="50" cy="50" r="20" strokeWidth="1.2" style={{ pathLength: d5 }} />
            <motion.circle cx="50" cy="50" r="10" strokeWidth="1" style={{ pathLength: d5 }} />
            <motion.line x1="50" y1="10" x2="50" y2="90" strokeWidth="1" style={{ pathLength: d5 }} />
            <motion.line x1="10" y1="50" x2="90" y2="50" strokeWidth="1" style={{ pathLength: d5 }} />
            <motion.text x="80" y="85" className="font-mono text-[9px] fill-current stroke-none" style={{ opacity: d5 }}>REGISTRATION_MARK_2K</motion.text>
          </svg>
        </div>

        {/* Doodle 6: Timeline Right - Compass Protractor */}
        <div className="absolute top-[2150px] right-[5%] opacity-[0.03] dark:opacity-[0.02]">
          <svg className="w-[220px] h-[220px] text-brand-accent stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none">
            <motion.circle cx="110" cy="110" r="90" strokeWidth="1" strokeDasharray="3 6" style={{ pathLength: d6 }} />
            <motion.circle cx="110" cy="110" r="45" strokeWidth="1" style={{ pathLength: d6 }} />
            <motion.line x1="110" y1="10" x2="110" y2="210" strokeWidth="1" style={{ pathLength: d6 }} />
            <motion.line x1="10" y1="110" x2="210" y2="110" strokeWidth="1" style={{ pathLength: d6 }} />
            <motion.line x1="110" y1="110" x2="173" y2="47" strokeWidth="1.5" style={{ pathLength: d6 }} />
            <motion.text x="120" y="100" className="font-mono text-[8px] fill-current stroke-none" style={{ opacity: d6 }}>angle: 45.00°</motion.text>
            <motion.text x="15" y="200" className="font-mono text-[8px] fill-current stroke-none" style={{ opacity: d6 }}>geometry_align_ref</motion.text>
          </svg>
        </div>

        {/* Doodle 7: Work Left - Vector grid layout */}
        <div className="absolute top-[2900px] left-[4%] opacity-[0.03] dark:opacity-[0.02] hidden lg:block">
          <svg className="w-[200px] h-[200px] text-brand-accent stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none">
            <motion.rect x="10" y="10" width="180" height="180" strokeWidth="1" style={{ pathLength: d7 }} />
            <motion.line x1="70" y1="10" x2="70" y2="190" strokeWidth="0.8" strokeDasharray="2 2" style={{ pathLength: d7 }} />
            <motion.line x1="130" y1="10" x2="130" y2="190" strokeWidth="0.8" strokeDasharray="2 2" style={{ pathLength: d7 }} />
            <motion.line x1="10" y1="70" x2="190" y2="70" strokeWidth="0.8" strokeDasharray="2 2" style={{ pathLength: d7 }} />
            <motion.line x1="10" y1="130" x2="190" y2="130" strokeWidth="0.8" strokeDasharray="2 2" style={{ pathLength: d7 }} />
            <motion.circle cx="70" cy="70" r="3" fill="currentColor" style={{ opacity: d7 }} />
            <motion.circle cx="130" cy="130" r="3" fill="currentColor" style={{ opacity: d7 }} />
            <motion.text x="15" y="185" className="font-mono text-[8px] fill-current stroke-none" style={{ opacity: d7 }}>LAYOUT_GRID_MATRIX</motion.text>
          </svg>
        </div>

        {/* Doodle 8: Work Right - Calibration Target */}
        <div className="absolute top-[3400px] right-[6%] opacity-[0.03] dark:opacity-[0.02] hidden md:block">
          <svg className="w-[160px] h-[160px] text-brand-accent stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none">
            <motion.rect x="20" y="20" width="120" height="120" strokeWidth="1.2" style={{ pathLength: d8 }} />
            <motion.circle cx="80" cy="80" r="40" strokeWidth="1" style={{ pathLength: d8 }} />
            <motion.line x1="80" y1="5" x2="80" y2="155" strokeWidth="0.8" style={{ pathLength: d8 }} />
            <motion.line x1="5" y1="80" x2="155" y2="80" strokeWidth="0.8" style={{ pathLength: d8 }} />
            <motion.text x="25" y="135" className="font-mono text-[8px] fill-current stroke-none" style={{ opacity: d8 }}>PREPRESS_ALIGN_OK</motion.text>
          </svg>
        </div>

        {/* Doodle 9: Archives Left - Color bars */}
        <div className="absolute top-[4100px] left-[5%] opacity-[0.03] dark:opacity-[0.02]">
          <svg className="w-[220px] h-[100px] text-brand-accent stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none">
            <motion.rect x="10" y="20" width="30" height="15" fill="currentColor" opacity="0.3" style={{ opacity: d9 }} />
            <motion.rect x="45" y="20" width="30" height="15" fill="currentColor" opacity="0.5" style={{ opacity: d9 }} />
            <motion.rect x="80" y="20" width="30" height="15" fill="currentColor" opacity="0.7" style={{ opacity: d9 }} />
            <motion.rect x="115" y="20" width="30" height="15" fill="currentColor" style={{ opacity: d9 }} />
            <motion.text x="15" y="55" className="font-mono text-[8px] fill-current stroke-none" style={{ opacity: d9 }}>C M Y K _ C A L I B R A T I O N</motion.text>
          </svg>
        </div>

        {/* Doodle 10: Archives Right - Geometry lines */}
        <div className="absolute top-[4600px] right-[5%] opacity-[0.03] dark:opacity-[0.02] hidden md:block">
          <svg className="w-[240px] h-[180px] text-brand-accent stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none">
            <motion.path d="M 20,20 L 220,160 M 20,160 L 220,20" strokeWidth="1" strokeDasharray="3 3" style={{ pathLength: d10 }} />
            <motion.rect x="20" y="20" width="200" height="140" strokeWidth="1.2" style={{ pathLength: d10 }} />
            <motion.text x="25" y="150" className="font-mono text-[8px] fill-current stroke-none" style={{ opacity: d10 }}>vector_scale_isometric</motion.text>
          </svg>
        </div>

        {/* Doodle 11: Tools Left - Vector handles */}
        <div className="absolute top-[5400px] left-[6%] opacity-[0.03] dark:opacity-[0.02] hidden lg:block">
          <svg className="w-[250px] h-[150px] text-brand-accent stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none">
            <motion.path d="M 30,120 Q 125,20 220,120" strokeWidth="1.5" style={{ pathLength: d11 }} />
            <motion.circle cx="125" cy="70" r="4" fill="currentColor" style={{ opacity: d11 }} />
            <motion.line x1="30" y1="120" x2="125" y2="70" strokeWidth="1" style={{ pathLength: d11 }} />
            <motion.line x1="220" y1="120" x2="125" y2="70" strokeWidth="1" style={{ pathLength: d11 }} />
            <motion.rect x="26" y="116" width="8" height="8" fill="currentColor" style={{ opacity: d11 }} />
            <motion.rect x="216" y="116" width="8" height="8" fill="currentColor" style={{ opacity: d11 }} />
            <motion.text x="90" y="140" className="font-mono text-[8px] fill-current stroke-none" style={{ opacity: d11 }}>bezier_quad_curve.dwg</motion.text>
          </svg>
        </div>

        {/* Doodle 12: Lab Right - Fold guide */}
        <div className="absolute top-[6200px] right-[6%] opacity-[0.03] dark:opacity-[0.02]">
          <svg className="w-[220px] h-[220px] text-brand-accent stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none">
            <motion.rect x="20" y="20" width="180" height="180" strokeWidth="1" rx="4" style={{ pathLength: d12 }} />
            <motion.line x1="110" y1="20" x2="110" y2="200" strokeWidth="1.2" strokeDasharray="6 4" style={{ pathLength: d12 }} />
            <motion.path d="M 60,110 L 90,80 L 90,140 Z M 160,110 L 130,80 L 130,140 Z" fill="currentColor" opacity="0.2" style={{ opacity: d12 }} />
            <motion.text x="35" y="45" className="font-mono text-[8px] fill-current stroke-none" style={{ opacity: d12 }}>FOLD_PLANE // CENTER</motion.text>
          </svg>
        </div>

        {/* Doodle 13: Contact Left - Crop mark strip */}
        <div className="absolute top-[7100px] left-[4%] opacity-[0.03] dark:opacity-[0.02]">
          <svg className="w-[200px] h-[100px] text-brand-accent stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none">
            <motion.circle cx="50" cy="50" r="15" strokeWidth="1.2" style={{ pathLength: d13 }} />
            <motion.line x1="50" y1="25" x2="50" y2="75" strokeWidth="1" style={{ pathLength: d13 }} />
            <motion.line x1="25" y1="50" x2="75" y2="50" strokeWidth="1" style={{ pathLength: d13 }} />
            <motion.rect x="100" y="40" width="20" height="20" strokeWidth="1" style={{ pathLength: d13 }} />
            <motion.rect x="130" y="40" width="20" height="20" strokeWidth="1" fill="currentColor" opacity="0.3" style={{ opacity: d13 }} />
            <motion.text x="25" y="90" className="font-mono text-[8px] fill-current stroke-none" style={{ opacity: d13 }}>CALIBRATION_STRIP_v4</motion.text>
          </svg>
        </div>

        {/* Doodle 14: Footer Right - Press Target */}
        <div className="absolute top-[7600px] right-[8%] opacity-[0.03] dark:opacity-[0.02] hidden md:block">
          <svg className="w-[160px] h-[160px] text-brand-accent stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none">
            <motion.circle cx="80" cy="80" r="50" strokeWidth="1" style={{ pathLength: d14 }} />
            <motion.circle cx="80" cy="80" r="25" strokeWidth="1" style={{ pathLength: d14 }} />
            <motion.line x1="80" y1="15" x2="80" y2="145" strokeWidth="0.8" style={{ pathLength: d14 }} />
            <motion.line x1="15" y1="80" x2="145" y2="80" strokeWidth="0.8" style={{ pathLength: d14 }} />
            <motion.text x="35" y="145" className="font-mono text-[8px] fill-current stroke-none" style={{ opacity: d14 }}>PLATE_MARKER_END</motion.text>
          </svg>
        </div>
      </div>

      {/* Dynamic Animated Vector Outline Frame */}
      <div className="hidden lg:block fixed inset-6 pointer-events-none z-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ transformStyle: 'preserve-3d' }}>
          {/* Animated border drawing path around screen */}
          <motion.rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="none"
            stroke="#1F1F1F"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ duration: 2.8, ease: "easeInOut" }}
          />
          {/* Top-Left alignment cross target */}
          <motion.path
            d="M-6,0 L6,0 M0,-6 L0,6"
            stroke="#FF3E00"
            strokeWidth="1"
            className="origin-center"
            style={{ x: 0, y: 0 }}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.5, type: 'spring', stiffness: 180 }}
          />
          {/* Top-Right alignment cross target */}
          <motion.path
            d="M-6,0 L6,0 M0,-6 L0,6"
            stroke="#FF3E00"
            strokeWidth="1"
            className="origin-center"
            style={{ x: '100%', y: 0 }}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.7, type: 'spring', stiffness: 180 }}
          />
          {/* Bottom-Left alignment cross target */}
          <motion.path
            d="M-6,0 L6,0 M0,-6 L0,6"
            stroke="#FF3E00"
            strokeWidth="1"
            className="origin-center"
            style={{ x: 0, y: '100%' }}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.9, type: 'spring', stiffness: 180 }}
          />
          {/* Bottom-Right alignment cross target */}
          <motion.path
            d="M-6,0 L6,0 M0,-6 L0,6"
            stroke="#FF3E00"
            strokeWidth="1"
            className="origin-center"
            style={{ x: '100%', y: '100%' }}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 2.1, type: 'spring', stiffness: 180 }}
          />
        </svg>
      </div>

      {/* Floating Header Navigation Bar */}
      <Navbar 
        activeSection={activeSection} 
        onNavigate={scrollToEl} 
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        threeDStyle={threeDStyle}
        onToggleThreeD={toggleThreeDStyle}
      />

      {/* Main Structural Layout Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-28 lg:pt-36 relative z-10 space-y-6 pb-24">
        {/* Parallax Background Structural Annotations */}
        <ParallaxGraphic topPosition="36%" side="right" speed={-0.08} vibe="ruler" />
        <ParallaxGraphic topPosition="56%" side="left" speed={0.15} vibe="crosshair" />
        <ParallaxGraphic topPosition="76%" side="right" speed={-0.1} vibe="code" />
        
        {/* Core Profile Hero */}
        <Hero />

        {/* Bento Board Quick Summary (styled exactly like the Bento design spec, serving as direct anchors) */}
        <motion.div 
          variants={bentoContainerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 mb-12" 
          id="summary-bento"
        >
          {/* Bento card 1: Education */}
          <TiltCard 
            variants={bentoItemVariants}
            whileHover={{ y: -6, borderColor: 'rgba(255, 62, 0, 0.8)', boxShadow: '0 10px 30px -15px rgba(255, 62, 0, 0.15)' }}
            onClick={() => scrollToEl('education-section')}
            className="cursor-pointer bg-card-bg p-5 h-full border border-card-border transition-colors duration-300 rounded group flex flex-col justify-between relative overflow-hidden"
          >
            {/* Watermark Icon */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.015] text-white group-hover:opacity-[0.08] group-hover:text-[#FF3E00] group-hover:scale-110 pointer-events-none transition-all duration-500 transform translate-x-2 translate-y-2">
              <GraduationCap className="w-28 h-28" />
            </div>

            <div className="z-10">
              <span className="text-[10px] font-mono text-[#FF3E00] uppercase font-bold tracking-widest block mb-4">
                Academic Base
              </span>
              <p className="text-xs leading-relaxed text-[#A3A3A3]">
                <strong className="block mb-1 text-white uppercase font-mono text-[11px]">Universal Skills College</strong>
                Professional graphic credentials with 91% grade. Pursuing Master of Arts (M.A.).
              </p>
            </div>
            <span className="text-[9px] font-mono text-gray-500 block mt-4 uppercase group-hover:text-[#FF3E00] transition-colors z-10">
              🔍 Explore Certificates →
            </span>
          </TiltCard>

          {/* Bento card 2: Expertise */}
          <TiltCard 
            variants={bentoItemVariants}
            whileHover={{ y: -6, borderColor: 'rgba(255, 62, 0, 0.8)', boxShadow: '0 10px 30px -15px rgba(255, 62, 0, 0.15)' }}
            onClick={() => scrollToEl('skills-section')}
            className="cursor-pointer bg-card-bg p-5 h-full border border-card-border transition-colors duration-300 rounded group flex flex-col justify-between relative overflow-hidden"
          >
            {/* Watermark Icon */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.015] text-white group-hover:opacity-[0.08] group-hover:text-[#FF3E00] group-hover:scale-110 pointer-events-none transition-all duration-500 transform translate-x-2 translate-y-2">
              <Cpu className="w-28 h-28" />
            </div>

            <div className="z-10">
              <span className="text-[10px] font-mono text-[#FF3E00] uppercase font-bold tracking-widest block mb-4">
                Core Assets
              </span>
              <p className="text-xs leading-relaxed text-[#A3A3A3] mb-4">
                Customized flex alignments, packaging matrices and catalog indexing databases.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[9px] font-mono px-2 py-0.5 bg-card-border text-white rounded">CorelDRAW</span>
                <span className="text-[9px] font-mono px-2 py-0.5 bg-card-border text-white rounded">Canva Pro</span>
                <span className="text-[9px] font-mono px-2 py-0.5 bg-card-border text-white rounded">AI Assisted</span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-gray-500 block mt-4 uppercase group-hover:text-[#FF3E00] transition-colors z-10">
              ⚙️ View Technologies →
            </span>
          </TiltCard>

          {/* Bento card 3: Work History */}
          <TiltCard 
            variants={bentoItemVariants}
            whileHover={{ y: -6, borderColor: 'rgba(255, 62, 0, 0.8)', boxShadow: '0 10px 30px -15px rgba(255, 62, 0, 0.15)' }}
            onClick={() => scrollToEl('experience-section')}
            className="cursor-pointer bg-card-bg p-5 h-full border border-card-border transition-colors duration-300 rounded group flex flex-col justify-between relative overflow-hidden"
          >
            {/* Watermark Icon */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.015] text-white group-hover:opacity-[0.08] group-hover:text-[#FF3E00] group-hover:scale-110 pointer-events-none transition-all duration-500 transform translate-x-2 translate-y-2">
              <Briefcase className="w-28 h-28" />
            </div>

            <div className="z-10">
              <span className="text-[10px] font-mono text-[#FF3E00] uppercase font-bold tracking-widest block mb-4">
                Active History
              </span>
              <p className="text-xs leading-relaxed text-[#A3A3A3] font-bold uppercase space-y-1.5">
                • Fareeha Advertising <br />
                • Burraq Herbal Pvt. Ltd. <br />
                • Bombay Trophies Ltd.
              </p>
            </div>
            <span className="text-[9px] font-mono text-gray-500 block mt-4 uppercase group-hover:text-[#FF3E00] transition-colors z-10">
              💼 View Positions →
            </span>
          </TiltCard>

          {/* Bento card 4: Contact Core */}
          <TiltCard 
            variants={bentoItemVariants}
            whileHover={{ y: -6, backgroundColor: '#FFFFFF', color: '#000000', boxShadow: '0 10px 30px -15px rgba(255, 62, 0, 0.3)' }}
            onClick={() => scrollToEl('contact-section')}
            className="cursor-pointer bg-[#FF3E00] text-black p-5 h-full flex flex-col justify-between rounded group transition-all duration-300 relative overflow-hidden"
          >
            {/* Watermark Icon */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.035] text-black group-hover:opacity-[0.09] group-hover:text-[#FF3E00] group-hover:scale-110 pointer-events-none transition-all duration-500 transform translate-x-2 translate-y-2">
              <Mail className="w-28 h-28" />
            </div>

            <div className="z-10">
              <span className="text-[10px] font-mono text-black/60 uppercase font-black tracking-widest block transition-colors group-hover:text-black/50">
                Initiate Brief
              </span>
              <div className="mt-4">
                <p className="text-sm font-black break-words leading-none transition-colors group-hover:text-black">iftekharaffan0@gmail.com</p>
                <p className="text-xs font-bold mt-1 text-black/90 transition-colors group-hover:text-black">+91 93703 84781</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-black/80 font-black block mt-4 uppercase transition-colors group-hover:text-black z-10">
              💬 Launch Planner →
            </span>
          </TiltCard>
        </motion.div>

        {/* Core Profile About & Tabs Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px 300px 0px" }}
          variants={sectionAnimation}
        >
          <AboutSection />
        </motion.div>

        {/* Full Interactive Work Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px 300px 0px" }}
          variants={sectionAnimation}
        >
          <ExperienceTimeline />
        </motion.div>

        {/* Visual Showcase Projects */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px 300px 0px" }}
          variants={sectionAnimation}
        >
          <PortfolioShowcase />
        </motion.div>

        {/* Dynamic Graphic Design Gallery */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px 300px 0px" }}
          variants={sectionAnimation}
        >
          <WorkGallery />
        </motion.div>

        {/* Skills & Capability Matrices */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px 300px 0px" }}
          variants={sectionAnimation}
        >
          <SkillsGrid />
        </motion.div>

        {/* CorelDRAW Interactive Prepress Calibrator Block */}
        {/* Unified Design Production Lab */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px 300px 0px" }}
          variants={sectionAnimation}
        >
          <InteractiveLab />
        </motion.div>

        {/* Contact Hub & Direct WhatsApp/Email Briefing Engine */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px 300px 0px" }}
          variants={sectionAnimation}
        >
          <ContactHub />
        </motion.div>

      </main>

      {/* Short & Beautiful Glassmorphic Footer */}
      <footer className="py-12 relative z-10 px-6 md:px-12 overflow-hidden shadow-[0_-8px_32px_rgba(0,0,0,0.15)] mt-16 bg-nav-bg border-t border-card-border transition-colors duration-300">
        {/* Animated Particles in Footer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {footerParticles.map((p) => (
            <motion.div
              key={`footer-particle-${p.id}`}
              initial={{ 
                opacity: 0, 
                y: "110%", 
                x: `${p.startX}%` 
              }}
              animate={{ 
                opacity: [0, 0.4, 0.4, 0], 
                y: "-10%",
                x: [
                  `${p.startX}%`, 
                  `${p.drift1}%`, 
                  `${p.drift2}%`
                ]
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut"
              }}
              className="absolute bg-[#FF3E00] rounded-full"
              style={{
                width: p.size,
                height: p.size,
                filter: "blur(0.5px)"
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center justify-center space-y-6 text-center">
          
          {/* Background Multilingual Name Watermark */}
          <div className="absolute inset-0 select-none pointer-events-none z-0 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={nameIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: isMobile ? 0.08 : 0.02, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.0, ease: "easeInOut" }}
                className="text-[10vw] md:text-[6vw] font-black tracking-tighter text-brand-accent uppercase leading-none font-sans whitespace-nowrap"
              >
                {names[nameIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
            <div className="flex flex-col items-center">
              {/* Centered Heading: Name in clear text */}
              <h3 className="text-2xl font-black text-brand-text tracking-[0.25em] uppercase select-none font-sans mb-1.5">
                <span className="text-brand-accent">{names[nameIndex]}</span> MOMIN
              </h3>
              {/* Senior Graphic Designer & Prepress Specialist */}
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-muted">
                Senior Graphic Designer & Prepress Specialist
              </span>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3">
              <a 
                href="mailto:iftekharaffan0@gmail.com" 
                className="p-2.5 rounded-full border border-card-border bg-card-bg/25 text-brand-muted hover:bg-brand-text hover:text-brand-bg hover:scale-115 transition-all shadow-md"
                title="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/affanmominn" 
                target="_blank" 
                rel="referrer" 
                className="p-2.5 rounded-full border border-card-border bg-card-bg/25 text-brand-muted hover:bg-brand-text hover:text-brand-bg hover:scale-115 transition-all shadow-md"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="referrer" 
                className="p-2.5 rounded-full border border-card-border bg-card-bg/25 text-brand-muted hover:bg-brand-text hover:text-brand-bg hover:scale-115 transition-all shadow-md"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://wa.me/919637094095" 
                target="_blank" 
                rel="referrer" 
                className="p-2.5 rounded-full border border-card-border bg-card-bg/25 text-brand-muted hover:bg-[#25D366] hover:text-white hover:border-[#25D366]/30 hover:scale-115 transition-all shadow-md"
                title="WhatsApp Contact"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>

            {/* © ALL RIGHTS RESERVED • MOMIN AFFAN */}
            <div className="text-[9px] font-mono text-brand-muted uppercase tracking-widest pt-2">
              © ALL RIGHTS RESERVED • MOMIN AFFAN
            </div>
          </div>

        </div>
      </footer>

      {/* Custom Vector calibration reticle cursor (only on desktop/pointer: fine) */}
      {cursorVisible && (
        <>
          {/* Main outer rotating scope */}
          <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full border border-dashed border-[#FF3E00] pointer-events-none z-[9999] flex items-center justify-center"
            animate={{
              x: mousePos.x - 16,
              y: mousePos.y - 16,
              scale: cursorHovered ? 1.6 : 1,
              rotate: cursorHovered ? 135 : 0,
              borderColor: cursorHovered ? '#FFFFFF' : '#FF3E00',
              borderStyle: cursorHovered ? 'solid' : 'dashed',
            }}
            transition={{
              type: 'spring',
              stiffness: 420,
              damping: 24,
              mass: 0.15,
              rotate: { duration: 0.4, ease: "easeOut" }
            }}
          >
            {/* Direct scope coordinate ticks inside */}
            <div className={`absolute w-full h-[1px] transition-all ${cursorHovered ? 'bg-white/40 scale-x-110' : 'bg-[#FF3E00]/30'}`}></div>
            <div className={`absolute h-full w-[1px] transition-all ${cursorHovered ? 'bg-white/40 scale-y-110' : 'bg-[#FF3E00]/30'}`}></div>
          </motion.div>

          {/* Solid lock-on center laser dot */}
          <motion.div
            className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#FF3E00] pointer-events-none z-[9999] shadow-[0_0_8px_#FF3E00]"
            animate={{
              x: mousePos.x - 3,
              y: mousePos.y - 3,
              scale: cursorHovered ? 0.6 : 1,
              backgroundColor: cursorHovered ? '#FFFFFF' : '#FF3E00',
            }}
            transition={{
              type: 'spring',
              stiffness: 850,
              damping: 38,
              mass: 0.08
            }}
          />
        </>
      )}
      <Analytics />
      {threeDStyle !== "off" && <ScrollCanvas theme={theme} style={threeDStyle} />}
    </div>
  );
}
