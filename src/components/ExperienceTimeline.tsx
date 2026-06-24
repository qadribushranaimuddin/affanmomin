import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Briefcase, 
  Plus, 
  Minus, 
  ArrowRight, 
  Star, 
  ExternalLink, 
  ShieldCheck,
  Megaphone,
  Leaf,
  Trophy,
  Compass
} from 'lucide-react';
import { Experience } from '../types';

const getTimelineWatermarkIcon = (company: string) => {
  if (company.includes("Fareeha")) {
    return <Megaphone className="w-24 h-24" />;
  }
  if (company.includes("Burraq")) {
    return <Leaf className="w-24 h-24" />;
  }
  if (company.includes("Bombay")) {
    return <Trophy className="w-24 h-24" />;
  }
  return <Compass className="w-24 h-24" />;
};

const EXPERIENCES: Experience[] = [
  {
    role: "Senior Graphic Designer",
    company: "Fareeha Advertising Company",
    period: "Current Organization",
    type: 'current',
    responsibilities: [
      "Designing a wide, premium range of print and marketing assets including massive flex banners, commercial posters, brochures, pamphlets, business cards, and product packaging.",
      "Developing engaged social media creatives, digital banners, and regional promotional marketing campaigns.",
      "Crafting structural book layouts, newspaper publishing templates, and official document layout presets.",
      "Providing creative and custom-crafted logos and comprehensive corporate visual identity systems.",
      "Maintaining, analyzing, and structuring client project records and billing indices using Microsoft Excel.",
      "Coordinating multiple clients simultaneously, ensuring strict adherence to strict project deadlines and color prepress configurations."
    ],
    toolsUsed: ["CorelDRAW", "Adobe Photoshop", "Canva Pro", "Microsoft Excel", "Prepress Calibrations"]
  },
  {
    role: "Senior Graphic Designer",
    company: "Burraq Herbal Pvt. Ltd.",
    period: "Previous Organization",
    type: 'previous',
    responsibilities: [
      "Designed clean, aesthetic product packaging, health product labels, and custom bottle branding sets.",
      "Formulated promotional marketing materials, billboard flexes, and advertising banners for natural care campaigns.",
      "Produced comprehensive multi-page product catalogues and physical retail promotional materials.",
      "Designed and generated weekly social media designs, handling visual assets across digital media platforms.",
      "Kept rigid, pristine aesthetic consistency across multiple herbal brands under the parent corporate system."
    ],
    toolsUsed: ["CorelDRAW Style Guides", "Photoshop", "Print Offset Tuning", "Product Catalogues"]
  },
  {
    role: "Junior Graphic Designer",
    company: "Bombay Trophies Pvt. Ltd.",
    period: "Previous Organization",
    type: 'previous',
    responsibilities: [
      "Vector-designed acrylic trophy shields, customizable medal items, and official executive presentation boxes.",
      "Created structured product catalogues, custom corporate customized presentations, and print-ready pamphlets.",
      "Executed product photography in-house, isolated catalog items in Photoshop, and customized lighting profiles for digital lists.",
      "Logged and managed physical showroom-related records, pricing charts, and inventory databases in Excel.",
      "Supported visual merchandising, product placement displays, and initial material mockups."
    ],
    toolsUsed: ["CorelDRAW Technical Vector", "Product Photography", "Photoshop Silhouette Isolation", "Inventory Excel Sheets"]
  },
  {
    role: "Freelance Graphic Designer",
    company: "Independent Design Practice",
    period: "Continuous Practice",
    type: 'previous',
    responsibilities: [
      "Providing complete branding, corporate layout, and prepress solutions for advertising firms, school institutes, coaching facilities, and local enterprises.",
      "Delivered high-rated custom work for prominent clients: Bluewavepool, The Mini Melt, Chawla Remedies Pvt. Ltd., India Natural, Indian Walker, Blendloom, Homora, and local business councils.",
      "Specializing in Flex Banners, Apparel design, multi-page layout publication, and modern AI-augmented creative concepts."
    ],
    toolsUsed: ["ChatGPT AI Ideation", "CorelDRAW Layouts", "Photoshop Compositing", "Canva Team Boards"]
  }
];

export default function ExperienceTimeline() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="py-12 border-b border-[#222]" id="experience-section">
      <div className="mb-8">
        <span className="text-xs font-mono uppercase text-[#FF3E00] tracking-widest font-bold block mb-1">Timeline</span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">
          Professional History
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
              SEC_EXP_02
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

        <p className="text-sm text-[#737373] mt-2.5 max-w-2xl">
          More than three years of dedicated work in advertising agencies, production houses, and fast-paced healthcare and trophy packaging environments.
        </p>
      </div>

      <div className="space-y-4">
        {EXPERIENCES.map((exp, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={idx}
              className={`border transition-all duration-300 rounded relative overflow-hidden group ${
                isExpanded
                  ? 'border-[#FF3E00] bg-[#121212]'
                  : 'border-[#222] bg-[#0A0A0A] hover:border-[#444]'
              }`}
            >
              {/* Background Watermark Icon */}
              <div className="absolute -right-4 -bottom-4 opacity-[0.015] text-white group-hover:opacity-[0.07] group-hover:text-brand-accent group-hover:scale-110 pointer-events-none transition-all duration-500 transform translate-x-2 translate-y-2 z-0">
                {getTimelineWatermarkIcon(exp.company)}
              </div>

              {/* Header Accordion Bar */}
              <button
                onClick={() => toggleExpand(idx)}
                className="w-full text-left p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 focus:outline-none relative z-10"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded hidden sm:block ${isExpanded ? 'bg-[#FF3E00] text-black' : 'bg-[#151515] text-[#FF3E00]'}`}>
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">
                        {exp.role}
                      </h3>
                      {exp.type === 'current' && (
                        <span className="text-[9px] font-mono font-bold bg-[#FF3E00]/10 text-[#FF3E00] border border-[#FF3E00]/20 px-2 py-0.5 rounded uppercase uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E00] animate-ping"></span>
                          CURRENT ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#A3A3A3] font-semibold mt-1">
                      {exp.company}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto font-mono text-xs text-[#A3A3A3]">
                  <span className="flex items-center gap-1.5 bg-[#1C1C1C] px-3 py-1 rounded">
                    <Calendar className="w-3.5 h-3.5 text-[#FF3E00]" />
                    {exp.period}
                  </span>
                  <div>
                    {isExpanded ? (
                      <Minus className="w-5 h-5 text-[#FF3E00]" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-500 hover:text-white" />
                    )}
                  </div>
                </div>
              </button>

              {/* Collapsible Content */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden relative z-10"
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-[#1C1C1C] space-y-6">
                      <div className="space-y-3">
                        <h4 className="text-xs font-mono uppercase text-[#FF3E00] tracking-wider font-extrabold">
                          Key Deliverables & Duties:
                        </h4>
                        <motion.ul 
                          initial="hidden"
                          animate="visible"
                          variants={{
                            hidden: { opacity: 0 },
                            visible: {
                              opacity: 1,
                              transition: { staggerChildren: 0.05 }
                            }
                          }}
                          className="space-y-3 pl-1"
                        >
                          {exp.responsibilities.map((resp, rIdx) => (
                            <motion.li 
                              key={rIdx} 
                              variants={{
                                hidden: { opacity: 0, x: -8 },
                                visible: { opacity: 1, x: 0 }
                              }}
                              className="text-xs leading-relaxed text-[#D4D4D4] flex items-start gap-2"
                            >
                              <span className="text-[#FF3E00] mt-1.5">▪</span>
                              <span>{resp}</span>
                            </motion.li>
                          ))}
                        </motion.ul>
                      </div>
 
                      {/* Tools Tag list */}
                      <div className="space-y-2 border-t border-[#1C1C1C] pt-4">
                        <h4 className="text-xs font-mono uppercase text-white/50 tracking-wider">
                          Key Software & Methodologies Used:
                        </h4>
                        <motion.div 
                          initial="hidden"
                          animate="visible"
                          variants={{
                            hidden: { opacity: 0 },
                            visible: {
                              opacity: 1,
                              transition: { staggerChildren: 0.03 }
                            }
                          }}
                          className="flex flex-wrap gap-2"
                        >
                          {exp.toolsUsed.map((tool, tIdx) => (
                            <motion.span
                              key={tIdx}
                              variants={{
                                hidden: { opacity: 0, scale: 0.8 },
                                visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 140, damping: 10 } }
                              }}
                              whileHover={{ scale: 1.08, borderColor: '#FF3E00' }}
                              className="text-[10px] font-mono px-2.5 py-1 bg-[#1A1A1A] border border-[#262626] rounded text-[#E5E5E5] transition-colors duration-200 cursor-default"
                            >
                              ⚙️ {tool}
                            </motion.span>
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Trust Quote Accent */}
      <div className="mt-8 bg-[#151515]/50 border border-[#222] p-4 rounded flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-10 h-10 text-[#FF3E00] flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-white uppercase">Client trust & High Fidelity Sizing Control</p>
            <p className="text-[11px] text-[#A3A3A3]">Every layout is generated directly in real millimeters or target aspect ratios to match actual industrial printing boards perfectly.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-mono px-2.5 py-1 bg-black text-[#A3A3A3] rounded border border-[#333]">
            #VectorPristine
          </span>
          <span className="text-[10px] font-mono px-2.5 py-1 bg-black text-[#A3A3A3] rounded border border-[#333]">
            #ZeroBleedIssues
          </span>
        </div>
      </div>
    </div>
  );
}
