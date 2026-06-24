import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowDownRight, MapPin, Briefcase, Award, Sparkles, Sliders } from 'lucide-react';

interface MagneticLetterProps {
  char: string;
  index: number;
  isLastName?: boolean;
  activeIndex: number;
  isTouchDevice: boolean;
}

function MagneticLetter({ 
  char, 
  index, 
  isLastName = false, 
  activeIndex, 
  isTouchDevice 
}: MagneticLetterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  
  const mX = useMotionValue(0);
  const mY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 14, mass: 0.12 };
  const springX = useSpring(mX, springConfig);
  const springY = useSpring(mY, springConfig);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy);

      const triggerRadius = 120;
      if (dist < triggerRadius) {
        const power = (triggerRadius - dist) / triggerRadius;
        mX.set(dx * power * 0.45);
        mY.set(dy * power * 0.45);
      } else {
        mX.set(0);
        mY.set(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isTouchDevice]);

  const targetColor = isLastName ? "#FFFFFF" : "#FF3E00";
  const defaultColor = isLastName ? "#FF3E00" : "#FFFFFF";
  const absoluteIndex = isLastName ? index + 5 : index;

  return (
    <motion.span
      ref={ref}
      style={{ 
        x: springX, 
        y: springY, 
        display: 'inline-block', 
        originX: 0.5,
        originY: 1
      }}
      initial={{ y: "100%", rotateX: -60 }}
      animate={
        isTouchDevice
          ? (activeIndex === absoluteIndex
              ? { scale: 1.18, y: -18, color: targetColor }
              : { scale: 1, y: 0, rotateX: 0, color: defaultColor })
          : { y: 0, rotateX: 0 }
      }
      transition={
        isTouchDevice && activeIndex === absoluteIndex
          ? { type: "spring", stiffness: 350, damping: 8 }
          : {
              duration: 0.8,
              delay: (isLastName ? 0.3 : 0) + index * 0.05,
              ease: [0.16, 1, 0.3, 1]
            }
      }
      whileHover={{ 
        scale: 1.18, 
        y: -18, 
        color: targetColor,
        transition: { type: "spring", stiffness: 350, damping: 8 }
      }}
      className="inline-block cursor-pointer transition-colors duration-100 select-none"
    >
      {char}
    </motion.span>
  );
}

export default function Hero() {
  const firstNameLetters = "MOMIN".split("");
  const lastNameLetters = "AFFAN".split("");

  const fullTitle = "Senior Graphic Designer";
  const [typedTitle, setTypedTitle] = useState("");

  const [activeIndex, setActiveIndex] = useState(-1);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

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

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia('(hover: none)').matches || window.innerWidth < 1024);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  useEffect(() => {
    if (isTouchDevice) {
      let intervalId: any;
      const startTimeout = setTimeout(() => {
        let current = 0;
        intervalId = setInterval(() => {
          // Cycle through 0 to 9 (10 letters), then add a delay pause (up to 30)
          setActiveIndex(current);
          current = (current + 1) % 30; // 10 active steps, 20 steps pause
        }, 180);
      }, 1500);

      return () => {
        clearTimeout(startTimeout);
        if (intervalId) clearInterval(intervalId);
      };
    } else {
      setActiveIndex(-1);
    }
  }, [isTouchDevice]);

  useEffect(() => {
    let isMounted = true;
    let isDeleting = false;
    let currentIdx = 0;
    let timer: any;

    const tick = () => {
      if (!isMounted) return;

      if (!isDeleting) {
        if (currentIdx <= fullTitle.length) {
          setTypedTitle(fullTitle.slice(0, currentIdx));
          currentIdx++;
          timer = setTimeout(tick, 90);
        } else {
          isDeleting = true;
          timer = setTimeout(tick, 2000); // hold word for 2 seconds
        }
      } else {
        if (currentIdx >= 0) {
          setTypedTitle(fullTitle.slice(0, currentIdx));
          currentIdx--;
          timer = setTimeout(tick, 45);
        } else {
          isDeleting = false;
          timer = setTimeout(tick, 600); // delay before starting to retype
        }
      }
    };

    tick();

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slides = [
    {
      id: 0,
      watermark: "3+",
      leftVal: "3+",
      leftLabel: (
        <>
          Years Professional <br /> Experience
        </>
      ),
      rightContent: (
        <div className="space-y-1.5 text-left w-[160px]">
          <span className="flex items-center gap-1.5 text-[9px] font-mono text-[#FF3E00] bg-[#FF3E00]/10 px-2 py-0.5 rounded border border-[#FF3E00]/20 cursor-default">
            <Briefcase className="w-3 h-3 shrink-0" /> ADVERTISING
          </span>
          <span className="flex items-center gap-1.5 text-[9px] font-mono text-white bg-white/5 px-2 py-0.5 rounded border border-white/10 cursor-default">
            <Award className="w-3 h-3 shrink-0" /> PRINT MEDIA
          </span>
          <span className="flex items-center gap-1.5 text-[9px] font-mono text-[#FF3E00] bg-[#FF3E00]/10 px-2 py-0.5 rounded border border-[#FF3E00]/20 cursor-default">
            <Sparkles className="w-3 h-3 shrink-0" /> AI WORKFLOWS
          </span>
        </div>
      )
    },
    {
      id: 1,
      watermark: "91%",
      leftVal: "91%",
      leftLabel: (
        <>
          UNIVERSAL <br /> SKILL
        </>
      ),
      rightContent: (
        <div className="space-y-1 text-left w-[160px]">
          <div className="flex items-center gap-1 text-[9px] font-mono text-[#FF3E00] font-bold uppercase">
            <Award className="w-3 h-3 shrink-0" /> Honors
          </div>
          <h4 className="text-[11px] font-black text-white uppercase tracking-tight leading-tight">
            Technical Certification
          </h4>
          <p className="text-[8.5px] text-[#A3A3A3] leading-tight font-mono">
            Scored exceptional records in vector typography and offset printing calibrations.
          </p>
        </div>
      )
    },
    {
      id: 2,
      watermark: "100%",
      leftVal: "100%",
      leftLabel: (
        <>
          PRE_PRESS <br /> OK
        </>
      ),
      rightContent: (
        <div className="space-y-1 text-left w-[160px]">
          <div className="flex items-center gap-1 text-[9px] font-mono text-[#FF3E00] font-bold uppercase">
            <Sliders className="w-3 h-3 shrink-0" /> Calibration
          </div>
          <h4 className="text-[11px] font-black text-white uppercase tracking-tight leading-tight">
            Press-House Calibration
          </h4>
          <p className="text-[8.5px] text-[#A3A3A3] leading-tight font-mono">
            Guaranteeing clean print runs without overlaps or plate offset distortions standard across commercial offset machines.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="relative border-b border-[#222] pb-12 overflow-hidden" id="hero-section">
      {/* Laser Scanning Line Animation simulating print prepress production */}
      <motion.div
        animate={{
          y: ['0%', '370px', '0%'],
          opacity: [0.1, 0.4, 0.1]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF3E00]/60 to-transparent pointer-events-none z-10"
      />



      <header className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col"
        >
          <span className="text-[#FF3E00] font-mono text-sm tracking-tighter uppercase font-bold mb-1 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FF3E00] animate-ping"></span>
            Portfolio \\ 2026
          </span>
          <div className="flex items-center space-x-4">
            <div className="h-[2px] w-12 bg-[#FF3E00]"></div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#A3A3A3] font-medium">
              Available for Freelance & Creative Direction
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left md:text-right font-mono text-xs text-[#A3A3A3]"
        >
          <p className="flex items-center md:justify-end gap-1 mb-1">
            <MapPin className="w-3.5 h-3.5 text-[#FF3E00]" />
            Bhiwandi, Dist. Thane - 421302
          </p>
          <p className="opacity-60 uppercase">Maharashtra, India</p>
        </motion.div>
      </header>

      {/* Hero Body */}
      <div className="relative z-10 flex flex-col pt-4">
        {/* Massive Typography with staggered letter entrance */}
        <div className="relative">
          <div className="flex flex-col md:flex-row items-baseline mb-6">
            <h1 className="relative inline-flex flex-col items-start text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[120px] xl:text-[140px] leading-[0.85] font-black tracking-tighter uppercase text-white select-none">
              {/* MOMIN */}
              <div className="flex flex-wrap overflow-hidden">
                {firstNameLetters.map((char, index) => (
                  <MagneticLetter
                    key={`first-${index}`}
                    char={char}
                    index={index}
                    activeIndex={activeIndex}
                    isTouchDevice={isTouchDevice}
                  />
                ))}
              </div>
 
              {/* AFFAN */}
              <div className="flex flex-wrap overflow-hidden text-[#FF3E00]">
                {lastNameLetters.map((char, index) => (
                  <MagneticLetter
                    key={`last-${index}`}
                    char={char}
                    index={index}
                    isLastName={true}
                    activeIndex={activeIndex}
                    isTouchDevice={isTouchDevice}
                  />
                ))}
              </div>

              {/* Responsive Multilingual Name Watermark */}
              <div className="absolute left-0 lg:left-[102%] top-[100%] lg:top-1/2 translate-y-2 lg:-translate-y-1/2 select-none pointer-events-none z-0 flex items-center justify-start w-full lg:w-[350px] xl:w-[400px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={nameIndex}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: isTouchDevice ? 0.08 : 0.025, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 1.0, ease: "easeInOut" }}
                    className="text-[8vw] sm:text-[7vw] md:text-[6vw] lg:text-[4.5vw] xl:text-[5vw] font-black tracking-tighter text-brand-accent uppercase leading-none font-sans whitespace-nowrap"
                  >
                    {names[nameIndex]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </h1>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-4 md:mt-0 md:ml-8 md:rotate-90 md:origin-left flex items-center md:border-l md:border-[#333] md:pl-4"
            >
              <span className="text-xs font-mono uppercase tracking-[0.4em] text-[#737373]">
                Iftekhar Ahmed
              </span>
            </motion.div>
          </div>
        </div>

        {/* Short dynamic description overlay / stats row */}
        <div className="flex flex-col md:flex-row items-stretch justify-between mt-8 border-t border-[#222] pt-8 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight text-[#F5F5F5]">
              <span className="inline-block min-h-[32px] md:min-h-[44px]">
                {typedTitle}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.75, ease: "linear" }}
                  className="inline-block w-[3px] h-6 md:h-8 bg-[#FF3E00] ml-2 align-middle shadow-[0_0_8px_#FF3E00]"
                />
              </span>
              <br />
              <span className="text-[#A3A3A3]">
                Crafting visual power houses across Advertising, print, packaging, and digital branding with precision.
              </span>
            </h2>
            <p className="text-sm mt-4 text-[#737373] leading-relaxed max-w-xl">
              I am a passionate and professional Graphic Designer with deep expertise in <strong className="text-white font-semibold">CorelDRAW</strong>, Photoshop, and print production. Leveraging modern AI-powered tools alongside advanced vector layouts to engineer high efficiency & stellar end-product deliverables.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="group flex items-center gap-5 bg-[#121212] p-5 border border-[#222] self-start md:self-auto rounded-lg relative overflow-hidden hover:border-[#FF3E00]/40 transition-all duration-300 w-full max-w-[345px] h-[168px] shrink-0 select-none cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(e, info) => {
              const threshold = 30;
              if (info.offset.x < -threshold) {
                setCurrentSlide((prev) => (prev + 1) % 3);
              } else if (info.offset.x > threshold) {
                setCurrentSlide((prev) => (prev - 1 + 3) % 3);
              }
            }}
            onTap={() => setCurrentSlide((prev) => (prev + 1) % 3)}
          >
            {/* Ambient red badge glow */}
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-[#FF3E00]/5 blur-xl rounded-full z-0"></div>

            {/* Slide content container */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full flex items-center gap-5 relative z-10"
              >
                {/* Giant Watermark behind text */}
                <div className="absolute -right-2 -bottom-5 text-[90px] font-black italic pointer-events-none select-none tracking-tighter leading-none transition-colors duration-500 z-0 text-brand-accent opacity-[0.035] group-hover:text-brand-accent/5">
                  {slides[currentSlide].watermark}
                </div>

                <div className="text-center shrink-0 w-[95px] z-10">
                  <div className="text-4xl md:text-5xl font-black italic border-b-4 border-[#FF3E00] inline-block mb-1 text-white leading-none">
                    {slides[currentSlide].leftVal}
                  </div>
                  <p className="text-[9px] uppercase tracking-widest text-[#A3A3A3] font-bold mt-1.5 leading-tight">
                    {slides[currentSlide].leftLabel}
                  </p>
                </div>
                
                <div className="h-24 w-[1px] bg-[#222] shrink-0 z-10"></div>
                
                <div className="flex-1 z-10">
                  {slides[currentSlide].rightContent}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slide Navigation Dots */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-20">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(idx);
                  }}
                  className={`w-1 h-1 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx ? "bg-[#FF3E00] w-2.5" : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
