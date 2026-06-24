import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ExternalLink, Layers, Tag, Grid, CheckCircle, Smartphone, Award, Sparkles, Filter,
  Package, Leaf, Waves, Trophy, Pill, Compass, Home 
} from 'lucide-react';
import { Project } from '../types';

const getCardWatermarkIcon = (id: string, className: string = "w-24 h-24") => {
  switch (id) {
    case 'minimelt':
      return <Package className={className} />;
    case 'burraq':
      return <Leaf className={className} />;
    case 'bluewave':
      return <Waves className={className} />;
    case 'bombaytrophy':
      return <Trophy className={className} />;
    case 'chawla':
      return <Pill className={className} />;
    case 'blendloom':
      return <Grid className={className} />;
    case 'indianwalker':
      return <Compass className={className} />;
    case 'homora':
      return <Home className={className} />;
    default:
      return <Layers className={className} />;
  }
};

const PROJECTS: Project[] = [
  {
    id: 'minimelt',
    title: 'The Mini Melt Gourmet Cup Packaging',
    client: 'The Mini Melt',
    category: 'Packaging',
    description: 'Developed premium, eye-catching tub and lid designs for premium melting gourmet ice-creams. Emphasized vibrant colors to represent flavors and high-fidelity layouts optimized for cold-storage flexible film print.',
    tools: ['CorelDRAW', 'Adobe Photoshop', 'Print Prepress Tuning'],
    mockTheme: { bg: '#FFF5F5', fg: '#E53E3E', accent: '#FEB2B2' },
    mockContent: {
      title: 'MINI MELT',
      tagline: 'Gourmet Cold Melts',
      badgeCount: 'Premium',
      pattern: 'circles'
    }
  },
  {
    id: 'burraq',
    title: 'Herbal Supplement Label & Bottle Graphic Range',
    client: 'Burraq Herbal Pvt. Ltd.',
    category: 'Packaging',
    description: 'Designed a consistent, premium and modern branding system for a comprehensive range of traditional herbal health formulations. Balanced regulatory pharmaceutical constraints (ingredients lists, warnings, barcode clearances) with high-end, clean boutique aesthetics.',
    tools: ['CorelDRAW', 'Adobe Photoshop', 'Color Profiling'],
    mockTheme: { bg: '#F0FDF4', fg: '#166534', accent: '#86EFAC' },
    mockContent: {
      title: 'AYUR-SHIELD',
      tagline: '100% Organic Extracts',
      badgeCount: 'Active Care',
      pattern: 'stripes'
    }
  },
  {
    id: 'bluewave',
    title: 'Bluewave Swimming Club Campaign Banners',
    client: 'Bluewavepool',
    category: 'Print & Advertising',
    description: 'Engineered massive high-resolution billboard and flex banners for a flagship summer campaign. Configured specific bleed ranges and spot colors optimized for large-scale outdoor printing machinery (solvent and UV setup).',
    tools: ['CorelDRAW (Vector Layout)', 'Sizing Calibration', 'AI Image upscaling'],
    mockTheme: { bg: '#F0F9FF', fg: '#0369A1', accent: '#7DD3FC' },
    mockContent: {
      title: 'BLUEWAVE',
      tagline: 'Summer Swim Carnival 2026',
      badgeCount: 'Admission Open',
      pattern: 'checkered'
    }
  },
  {
    id: 'bombaytrophy',
    title: 'Custom Laser-Engraved Premium Acrylic Trophies',
    client: 'Bombay Trophies Pvt. Ltd.',
    category: 'Branding & Logo',
    description: 'Crafted technical vector templates for high-precision laser engraving and multi-layered acrylic awards. Managed sizing calibrations for physical production offsets and customized award presentations.',
    tools: ['CorelDRAW Technical Vector', 'Laser Die-Cut Line Pathing', 'Product Photography'],
    mockTheme: { bg: '#FAFAF9', fg: '#1C1917', accent: '#E7E5E4' },
    mockContent: {
      title: 'EXCELLENCE',
      tagline: 'Corporate Leadership Shield',
      badgeCount: 'Vector-Cut',
      pattern: 'minimal'
    }
  },
  {
    id: 'chawla',
    title: 'Ethical Pharmaceutical Tablet Packings',
    client: 'Chawla Remedies Pvt. Ltd.',
    category: 'Packaging',
    description: 'Designed precise, clinical tablet boxes and syrup labels with high text clarity. Configured strict bleed edges and high contrast warning indicators to ensure optimal legibility under varying print and regulatory environments.',
    tools: ['CorelDRAW Layouts', 'Precision Prepress Calibration'],
    mockTheme: { bg: '#FFF7ED', fg: '#C2410C', accent: '#FDBA74' },
    mockContent: {
      title: 'CHAWLA RX',
      tagline: 'Ethical Therapeutics Spec.',
      badgeCount: 'Certified',
      pattern: 'minimal'
    }
  },
  {
    id: 'blendloom',
    title: 'Blendloom Textile Branding & Labeling Set',
    client: 'Blendloom',
    category: 'Branding & Logo',
    description: 'Constructed an elegant, geometric corporate logo and garment wash labels for a luxury textile and weaving loom manufacturer. Styled visual brand guidelines, business cards, and delivery templates.',
    tools: ['Vector Logo Design', 'Brand Book Design', 'Canva Layouts'],
    mockTheme: { bg: '#FAF5FF', fg: '#6B21A8', accent: '#D8B4FE' },
    mockContent: {
      title: 'BLENDLOOM',
      tagline: 'Interlaced Elegance Since 1998',
      badgeCount: 'Fine Weave',
      pattern: 'stripes'
    }
  },
  {
    id: 'indianwalker',
    title: 'Indian Walker Rugged Footwear Launch Flyer',
    client: 'Indian Walker',
    category: 'Print & Advertising',
    description: 'Visualised and rendered double-sided print brochures and display posters containing high-durability trekking boots. Managed complex product photography silhouette isolation and image upscaling workflows.',
    tools: ['Photoshop Pen-Tool Isolation', 'AI Background Generation'],
    mockTheme: { bg: '#FEFCE8', fg: '#854D0E', accent: '#FDE047' },
    mockContent: {
      title: 'IND-WALKER',
      tagline: 'All-Terrain Adventure Series',
      badgeCount: 'Waterproof',
      pattern: 'checkered'
    }
  },
  {
    id: 'homora',
    title: 'Homora Smart Spaces Corporate Visual Identity',
    client: 'Homora',
    category: 'Branding & Logo',
    description: 'Designed a minimal logo system representing automation and security for Homora Smart Spaces. Developed social media templates, business stationeries, and high-contrast signage symbols.',
    tools: ['CorelDRAW Logo Geometry', 'Styleguide Systems', 'Canva Presets'],
    mockTheme: { bg: '#F8FAFC', fg: '#0F172A', accent: '#94A3B8' },
    mockContent: {
      title: 'HOMORA',
      tagline: 'Systematized Living',
      badgeCount: 'Automated',
      pattern: 'minimal'
    }
  }
];

export default function PortfolioShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [userTrophyText, setUserTrophyText] = useState<string>('BEST PERFORMER');

  const categories = ['All', 'Packaging', 'Print & Advertising', 'Branding & Logo', 'Social Media'];

  const filteredProjects = selectedCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === selectedCategory);

  // Helper render to generate beautiful interactive SVG design mockups
  const renderMockup = (project: Project) => {
    const theme = project.mockTheme;
    const content = project.mockContent;

    return (
      <div 
        className="w-full h-44 rounded-md flex flex-col justify-between p-4 relative overflow-hidden transition-all duration-500 select-none border border-white/5 group-hover:border-[#FF3E00]/40 group-hover:shadow-[0_8px_30px_rgb(255,62,0,0.04)]"
        style={{ backgroundColor: theme.bg, color: theme.fg }}
      >
        {/* Background Visual Watermark Icon */}
        <div className="absolute right-2 bottom-2 opacity-[0.035] pointer-events-none transform translate-x-3 translate-y-3">
          {getCardWatermarkIcon(project.id, "w-28 h-28 text-current")}
        </div>
        {/* Background Visual Patterns representing Graphic Design Output */}
        {content.pattern === 'checkered' && (
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: `repeating-conic-gradient(${theme.fg} 0% 25%, transparent 0% 50%)`, backgroundSize: '18px 18px' }}></div>
        )}
        {content.pattern === 'stripes' && (
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${theme.fg}, ${theme.fg} 10px, transparent 10px, transparent 20px)` }}></div>
        )}
        {content.pattern === 'circles' && (
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, ${theme.fg} 15%, transparent 15%)`, backgroundSize: '12px 12px' }}></div>
        )}

        {/* Vector Alignment Grid Lines (CorelDRAW Style) on group-hover */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-300">
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] border-l border-dashed" style={{ borderColor: theme.fg }}></div>
          <div className="absolute top-1/2 left-0 right-0 h-[1px] border-t border-dashed" style={{ borderColor: theme.fg }}></div>
          {/* Engineering target coordinate crosses in corners */}
          <span className="absolute top-1 left-1 text-[8px] font-mono font-black">+</span>
          <span className="absolute top-1 right-1 text-[8px] font-mono font-black">+</span>
          <span className="absolute bottom-1 left-1 text-[8px] font-mono font-black">+</span>
          <span className="absolute bottom-1 right-1 text-[8px] font-mono font-black">+</span>
        </div>

        {/* Floating background scaling blob */}
        <div 
          className="absolute -right-12 -top-12 w-28 h-28 rounded-full opacity-[0.08] blur-xl transition-transform duration-700 pointer-events-none group-hover:scale-150"
          style={{ backgroundColor: theme.fg }}
        ></div>

        <div className="flex justify-between items-start z-10 transition-transform duration-300 group-hover:-translate-y-0.5">
          <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded shadow-sm" style={{ backgroundColor: theme.accent + '80' }}>
            {project.category}
          </span>
          {content.badgeCount && (
            <span className="text-[9px] font-mono border px-1.5 py-0.5 rounded-full backdrop-blur-[1px]" style={{ borderColor: theme.fg + '40' }}>
              ✦ {project.id === 'bombaytrophy' && userTrophyText ? 'Engraved' : content.badgeCount}
            </span>
          )}
        </div>

        {/* Dynamic customized Award element just for Bombay Trophy */}
        {project.id === 'bombaytrophy' ? (
          <div className="z-10 flex flex-col items-center justify-center flex-1 my-2 transition-transform duration-300 group-hover:scale-105">
            <div className="w-20 h-20 border-2 rounded-t-xl flex flex-col items-center justify-center p-1 bg-white shadow-md relative" style={{ borderColor: theme.fg }}>
              <div className="text-[7px] font-bold text-center uppercase tracking-tighter overflow-hidden max-w-full truncate">{userTrophyText || 'BOMBAY TROPHY'}</div>
              <div className="w-12 h-1 bg-[#BF953F] mt-1"></div>
              <div className="text-[5px] text-gray-500 font-mono mt-0.5">EXCELLENCE AWARD</div>
              {/* Metallic Base */}
              <div className="absolute bottom-0 w-24 h-2 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-400 border border-gray-400 translate-y-1 z-20 shadow-sm"></div>
            </div>
          </div>
        ) : (
          <div className="z-10 my-auto text-left transition-transform duration-500 group-hover:translate-x-1">
            <h4 className="text-xl font-black tracking-tight leading-none uppercase">{content.title}</h4>
            <p className="text-[10px] mt-1 font-medium opacity-80 uppercase tracking-wider">{content.tagline}</p>
          </div>
        )}

        <div className="flex justify-between items-end z-10 border-t pt-2 transition-transform duration-300 group-hover:translate-y-0.5" style={{ borderColor: theme.fg + '20' }}>
          <div>
            <span className="text-[8px] uppercase tracking-wider opacity-60 font-mono">Client</span>
            <p className="text-[10px] font-bold tracking-tight uppercase leading-none">{project.client}</p>
          </div>
          <span className="text-[8px] font-mono opacity-50">#RAW_PRNT</span>
        </div>
      </div>
    );
  };

  // Grid container and item variants for premium staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 16
      }
    }
  };

  return (
    <div className="py-12 border-b border-[#222]" id="portfolio-section">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div className="relative w-full md:w-auto">
          <span className="text-xs font-mono uppercase text-[#FF3E00] tracking-widest font-bold block mb-1">Showcase</span>
          <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">
            Proven Creative Deliveries
          </h2>
          
          {/* Calibrated Lock-On Line */}
          <div className="relative w-full pt-4 pb-1 overflow-hidden pointer-events-none select-none">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-[1px] w-full bg-gradient-to-r from-[#FF3E00] via-card-border to-transparent origin-left border-t border-dashed border-[#FF3E00]/30"
            />
            <div className="absolute right-0 top-1.5 flex items-center space-x-1.5 font-mono text-[8px] text-[#A3A3A3] opacity-80">
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.7 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                SEC_PRJ_03
              </motion.span>
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-1.5 h-1.5 bg-[#FF3E00]"
              />
            </div>
          </div>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-mono uppercase rounded transition-all relative overflow-hidden whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'text-black font-black font-extrabold border border-transparent'
                  : 'bg-[#151515] text-[#A3A3A3] hover:text-white border border-[#222]'
              }`}
            >
              <span className="relative z-10">{cat}</span>
              {selectedCategory === cat && (
                <motion.span 
                  layoutId="activeCategoryFilterIndicator" 
                  className="absolute inset-0 bg-[#FF3E00] z-0"
                  transition={{ type: "spring", stiffness: 180, damping: 20 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Infinite Horizontal Scrolling Showcase of Projects */}
      <div className="overflow-hidden w-full relative py-4 mt-4 select-none">
        {/* Left and right fade gradients for a premium glass/card transition look */}
        <div className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--app-bg) 0%, transparent 100%)' }} />
        <div className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--app-bg) 0%, transparent 100%)' }} />
        
        <div className="flex gap-6 animate-marquee">
          {(() => {
            // Repeat the filtered projects to make sure we always fill the viewport width,
            // then duplicate the final array to enable seamless looping translation (translateX: -50%)
            let list = [...filteredProjects];
            if (list.length === 0) return null;
            while (list.length < 12) {
              list = [...list, ...filteredProjects];
            }
            const duplicatedProjects = [...list, ...list];
            
            return duplicatedProjects.map((project, idx) => (
              <div
                key={`${project.id}-${idx}`}
                className="w-[280px] shrink-0 group cursor-pointer flex flex-col justify-between bg-[#111111] border border-[#222] hover:border-[#FF3E00] p-3 rounded-lg transition-all duration-300 hover:-translate-y-2 hover:scale-[1.015] active:scale-[0.98] relative overflow-hidden shadow-lg"
                onClick={() => setActiveProject(project)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                }}
              >
                {/* Dynamic Glare Shine Overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
                  style={{
                    background: 'radial-gradient(circle 120px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 62, 0, 0.12), transparent 80%)'
                  }}
                />

                {/* Background watermark icon in card container */}
                <div className="absolute -right-4 -bottom-4 opacity-[0.015] text-white group-hover:opacity-[0.065] group-hover:text-[#FF3E00] group-hover:scale-110 pointer-events-none transition-all duration-500 transform translate-x-2 translate-y-2">
                  {getCardWatermarkIcon(project.id, "w-32 h-32")}
                </div>

                {renderMockup(project)}
                
                <div className="mt-4 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[9px] font-mono text-[#D4D4D4] uppercase bg-[#262626] px-2 py-0.5 rounded">
                      {project.category}
                    </span>
                    <h3 className="text-sm font-bold text-white uppercase mt-2 group-hover:text-[#FF3E00] transition-colors leading-tight">
                      {project.title}
                    </h3>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#1F1F1F] flex justify-between items-center">
                    <span className="text-[10px] text-[#737373] uppercase font-mono">
                      {project.tools[0]}
                    </span>
                    <span className="text-xs text-[#FF3E00] group-hover:translate-x-1 transition-transform font-mono flex items-center gap-1">
                      VIEW SPECS →
                    </span>
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
      {/* Project Spec Modal */}
      <AnimatePresence>
        {activeProject && typeof document !== 'undefined' && createPortal(
          <div 
            className="fixed inset-0 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            style={{ zIndex: 9000 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0D0D0D] border-2 border-[#FF3E00] text-white max-w-2xl w-full rounded-lg overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-[#222]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF3E00]"></span>
                  <span className="text-xs font-mono tracking-widest text-[#A3A3A3] uppercase">
                    Project Blueprint & Specifications
                  </span>
                </div>
                <button
                  onClick={() => setActiveProject(null)}
                  className="text-[#737373] hover:text-white font-mono text-xs uppercase border border-[#222] px-2.5 py-1 hover:border-[#FF3E00]"
                >
                  [ Close ]
                </button>
              </div>
 
              {/* Content Body */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left Column: Visual Mockup Showcase / Controller */}
                  <div className="w-full md:w-1/2 space-y-4">
                    {renderMockup(activeProject)}
                    
                    {/* Add specific interactive controller if Bombay Trophy is viewed */}
                    {activeProject.id === 'bombaytrophy' && (
                      <div className="border border-[#222] p-3 rounded bg-black/50 space-y-2">
                        <label className="text-[10px] font-mono text-[#FF3E00] uppercase block">
                          Customize Engraving Text:
                        </label>
                        <input
                          type="text"
                          value={userTrophyText}
                          onChange={(e) => setUserTrophyText(e.target.value.toUpperCase())}
                          placeholder="ENTER NAME"
                          maxLength={25}
                          className="w-full bg-[#111] border border-[#222] px-2 py-1 text-xs text-white uppercase focus:border-[#FF3E00] focus:outline-none rounded font-mono"
                        />
                        <span className="text-[9px] text-gray-500 block">
                          Change text to interact with the acrylic shield mock above!
                        </span>
                      </div>
                    )}
                  </div>
 
                  {/* Right Column: Spec Sheet */}
                  <div className="w-full md:w-1/2 space-y-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-mono text-[#737373]">
                        Partner / Client
                      </span>
                      <p className="text-lg font-black uppercase text-[#FF3E00] leading-none mb-1">
                        {activeProject.client}
                      </p>
                      <span className="text-xs text-white opacity-60">
                        {activeProject.category}
                      </span>
                    </div>
 
                    <div className="text-xs leading-relaxed text-[#D4D4D4] border-t border-[#222] pt-3">
                      <strong className="block mb-1 text-white uppercase font-mono text-[10px]">
                        Project Context:
                      </strong>
                      {activeProject.description}
                    </div>
 
                    <div className="border-t border-[#222] pt-3">
                      <strong className="block mb-2 text-white uppercase font-mono text-[10px]">
                        Design Tools & Technologies Used:
                      </strong>
                      <div className="flex flex-wrap gap-1.5">
                        {activeProject.tools.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 bg-[#1C1C1C] rounded border border-[#2C2C2C] text-[#F5F5F5]"
                          >
                            ⚙️ {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
 
              {/* Footer Stamp */}
              <div className="bg-[#111] p-3 border-t border-[#222] flex justify-between items-center font-mono text-[10px] uppercase text-[#737373]">
                <span>Status: Vector Production Ready</span>
                <span>ID: {activeProject.id.toUpperCase()}_REV2</span>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
    </div>
  );
}
