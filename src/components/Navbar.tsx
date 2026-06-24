import { useState, useEffect } from "react";
import { 
  Menu, 
  X, 
  ArrowUpRight, 
  Send, 
  Mail, 
  Instagram, 
  Twitter, 
  MessageCircle, 
  Sun, 
  Moon,
  Home,
  User,
  History,
  Image as ImageIcon,
  Archive,
  Sliders,
  Atom
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const getMobileNavIcon = (id: string) => {
  switch (id) {
    case "hero":
      return Home;
    case "about":
      return User;
    case "experience":
      return History;
    case "portfolio":
      return ImageIcon;
    case "gallery":
      return Archive;
    case "skills":
      return Sliders;
    case "lab":
      return Atom;
    case "contact":
      return Send;
    default:
      return Home;
  }
};

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export default function Navbar({ activeSection, onNavigate, theme, onToggleTheme }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Center active bottom navigation icon on mobile viewports on section changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const container = document.getElementById("mobile-bottom-nav-track");
    const activeIconEl = document.getElementById(`mobile-nav-icon-${activeSection}`);
    if (container && activeIconEl) {
      container.scrollTo({
        left: activeIconEl.offsetLeft - (container.offsetWidth / 2) + (activeIconEl.offsetWidth / 2),
        behavior: "smooth"
      });
    }
  }, [activeSection]);

  const navItems = [
    { id: "hero", label: "Intro" },
    { id: "about", label: "About" },
    { id: "experience", label: "Timeline" },
    { id: "portfolio", label: "Work" },
    { id: "gallery", label: "Archives" },
    { id: "skills", label: "Tools" },
    { id: "lab", label: "Interactive Lab" },
    { id: "contact", label: "Get In Touch" }
  ];

  const handleItemClick = (id: string) => {
    onNavigate(`${id}-section`);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        id="main-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-nav-bg backdrop-blur-md border-card-border py-4 shadow-xl"
          : "bg-transparent border-transparent py-5 md:py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Brand Logo */}
        <div 
          onClick={() => handleItemClick("hero")}
          className="cursor-pointer flex flex-col items-start"
        >
          <div className="text-sm font-black tracking-widest text-brand-text uppercase font-sans">
            MOMIN AFFAN <span className="text-[#FF3E00]">/</span>
          </div>
          <div className="text-[9px] uppercase tracking-widest text-brand-muted font-mono leading-none mt-1">
            Senior Graphic Designer
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-wider text-brand-muted">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`transition-all relative py-1 cursor-pointer hover:text-[#FF3E00] ${
                  activeSection === item.id
                    ? "text-[#FF3E00] font-bold"
                    : "text-brand-muted hover:text-brand-text"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.span 
                    layoutId="navbarUnderline" 
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#FF3E00]" 
                  />
                )}
              </button>
            ))}
          </div>

          {/* Glass Social Links */}
          <div className="flex items-center gap-2 border-l border-card-border pl-4">
            <a 
              href="mailto:iftekharaffan0@gmail.com" 
              className="p-1.5 rounded-full border border-card-border bg-card-bg/25 text-brand-muted hover:bg-brand-text hover:text-brand-bg hover:scale-105 transition-all"
              title="Send Email"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://www.instagram.com/affanmominn" 
              target="_blank" 
              rel="referrer" 
              className="p-1.5 rounded-full border border-card-border bg-card-bg/25 text-brand-muted hover:bg-brand-text hover:text-brand-bg hover:scale-105 transition-all"
              title="Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="referrer" 
              className="p-1.5 rounded-full border border-card-border bg-card-bg/25 text-brand-muted hover:bg-brand-text hover:text-brand-bg hover:scale-105 transition-all"
              title="Twitter"
            >
              <Twitter className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://wa.me/919637094095" 
              target="_blank" 
              rel="referrer" 
              className="p-1.5 rounded-full border border-card-border bg-card-bg/25 text-brand-muted hover:bg-[#25D366] hover:text-white hover:border-[#25D366]/30 hover:scale-105 transition-all"
              title="WhatsApp Contact"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            id="theme-toggle-btn"
            className="flex items-center gap-1.5 cursor-pointer text-brand-text hover:text-[#FF3E00] transition-colors font-mono font-bold text-[9px] uppercase tracking-wider px-2.5 py-1.5 border border-card-border hover:border-[#FF3E00]/30 bg-card-bg/25 rounded-md h-max select-none shadow-sm"
            title="Toggle between Day (Light) and Night (Dark) mode"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#FF3E00] shrink-0" />
                <span className="leading-none text-[8px]">Day</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#FF3E00] shrink-0" />
                <span className="leading-none text-[8px]">Night</span>
              </>
            )}
          </button>

          <a
            href="/My Resume.pdf"
            download="Momin_Affan_Resume.pdf"
            className="flex items-center gap-1 bg-transparent hover:bg-[#FF3E00]/10 text-brand-text hover:text-[#FF3E00] border border-card-border hover:border-[#FF3E00] font-black font-mono text-[11px] uppercase px-4 py-2 transition-all duration-250 rounded-sm cursor-pointer"
          >
            Resume
            <span className="text-[8px] opacity-70 font-bold">[PDF]</span>
          </a>

          <button
            onClick={() => handleItemClick("contact")}
            className="flex items-center gap-1 bg-[#FF3E00] hover:bg-white text-black font-black font-mono text-[11px] uppercase px-4 py-2 transition-colors duration-250 shadow-md shadow-[#FF3E00]/10 rounded-sm cursor-pointer"
          >
            Hire Affan
            <ArrowUpRight className="w-3 shrink-0" />
          </button>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={() => handleItemClick("contact")}
            className="p-2 bg-[#FF3E00] text-black hover:bg-white transition-colors"
            title="Send Email"
          >
            <Send className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 border border-card-border ${
              mobileMenuOpen ? "bg-card-bg/90" : "bg-card-bg/60"
            } text-brand-text hover:border-[#FF3E00] transition-colors rounded-sm cursor-pointer`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 25 }}
            className="lg:hidden absolute top-full left-0 w-full mobile-menu-bg border-b border-card-border py-6 px-6 shadow-2xl z-40 overflow-hidden"
          >
            <div className="flex flex-col gap-3 font-mono text-xs uppercase tracking-wider">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`text-left py-2 border-b border-card-border pb-2 transition-all cursor-pointer ${
                    activeSection === item.id
                      ? "text-[#FF3E00] pl-2 border-l-2 border-[#FF3E00]"
                      : "text-brand-muted hover:text-brand-text"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Mobile Drawer Social Links */}
              <div className="flex justify-center gap-4 border-t border-card-border pt-4 mt-2">
                <a href="mailto:iftekharaffan0@gmail.com" className="p-2.5 rounded-full border border-card-border bg-card-bg/25 text-brand-muted hover:text-brand-text flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/affanmominn" target="_blank" rel="referrer" className="p-2.5 rounded-full border border-card-border bg-card-bg/25 text-brand-muted hover:text-brand-text flex items-center justify-center">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="referrer" className="p-2.5 rounded-full border border-card-border bg-card-bg/25 text-brand-muted hover:text-brand-text flex items-center justify-center">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://wa.me/919637094095" target="_blank" rel="referrer" className="p-2.5 rounded-full border border-card-border bg-card-bg/25 text-brand-muted hover:text-[#25D366] flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>

              <a
                href="https://wa.me/919637094095"
                className="flex items-center justify-between bg-[#FF3E00] text-black font-mono font-black uppercase tracking-wider px-4 py-3 mt-2 text-center rounded-sm shadow-md"
                target="_blank"
                rel="referrer"
              >
                <span>Instant Whatsapp Quote</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              {/* Mobile Theme Toggle Button */}
              <button
                onClick={onToggleTheme}
                className="flex items-center justify-between bg-card-bg/25 backdrop-blur-md border border-card-border text-brand-text font-mono font-bold uppercase tracking-wider px-4 py-3 mt-2 text-center rounded-sm shadow-sm cursor-pointer"
              >
                <span>{theme === "dark" ? "Switch to Day Mode" : "Switch to Night Mode"}</span>
                {theme === "dark" ? <Sun className="w-4 h-4 text-[#FF3E00]" /> : <Moon className="w-4 h-4 text-[#FF3E00]" />}
              </button>

              {/* Mobile Download Resume Button */}
              <a
                href="/My Resume.pdf"
                download="Momin_Affan_Resume.pdf"
                className="flex items-center justify-between bg-card-bg/25 backdrop-blur-md border border-card-border text-brand-text font-mono font-bold uppercase tracking-wider px-4 py-3 mt-2 text-center rounded-sm shadow-sm cursor-pointer hover:border-[#FF3E00] hover:text-white"
              >
                <span>Download Resume</span>
                <span className="text-xs font-mono text-[#FF3E00]">[PDF]</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>

    {/* Mobile Bottom Navigation Pill (Centered, Glassmorphic Scrollable Track) */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[60%] max-w-[200px] h-[50px] rounded-full mobile-menu-bg border border-card-border shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex items-center justify-between px-2.5 overflow-hidden select-none">
        {/* Subtle Side Fade Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/25 to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/25 to-transparent pointer-events-none z-10" />

        {/* Scrollable Track */}
        <div 
          id="mobile-bottom-nav-track"
          className="flex items-center gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar w-full h-full px-4 py-1"
        >
          {navItems.map((item) => {
            const IconComponent = getMobileNavIcon(item.id);
            const isActive = activeSection === item.id;
            return (
              <button
                key={`mobile-nav-${item.id}`}
                id={`mobile-nav-icon-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`snap-center shrink-0 flex items-center justify-center w-8 h-8 rounded-full relative transition-all duration-300 cursor-pointer ${
                  isActive ? "text-[#FF3E00] scale-110" : "text-brand-muted hover:text-brand-text"
                }`}
                title={item.label}
              >
                {/* Active Indicator Glow behind */}
                {isActive && (
                  <motion.div
                    layoutId="mobileNavActiveBackground"
                    className="absolute inset-0 bg-[#FF3E00]/10 rounded-full border border-[#FF3E00]/30 shadow-[0_0_15px_rgba(255,62,0,0.15)] z-0"
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  />
                )}
                
                <span className="relative z-10">
                  <IconComponent className="w-4 h-4" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
