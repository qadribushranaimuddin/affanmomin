import { motion } from 'motion/react';
import { 
  Layers, 
  Palette, 
  Terminal, 
  FileCheck, 
  CheckCircle2, 
  Award, 
  Zap, 
  HelpCircle,
  DraftingCompass,
  Image as ImageIcon,
  Bot,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';

const getWatermarkIcon = (name: string) => {
  switch (name) {
    case "CorelDRAW":
      return <DraftingCompass className="w-28 h-28" />;
    case "Adobe Photoshop":
      return <ImageIcon className="w-28 h-28" />;
    case "ChatGPT (AI Design Workflows)":
      return <Bot className="w-28 h-28" />;
    case "Canva Pro":
      return <Sparkles className="w-28 h-28" />;
    case "Microsoft Excel & Word":
      return <FileSpreadsheet className="w-28 h-28" />;
    default:
      return <Zap className="w-28 h-28" />;
  }
};

interface Skill {
  name: string;
  level: string;
  description: string;
  useCase: string;
  icon: string;
  percentage: number;
  watermark: string;
}

const TOOLS_SKILLS: Skill[] = [
  {
    name: "CorelDRAW",
    level: "Elite Vector Specialist (95%)",
    description: "Primary vector software for designing industrial banners, flex designs, publication layouts, and high-precision laser trophy die-cut patterns.",
    useCase: "Flex print catalogs, logo geometric grids, billboard curves, trophy plate engineering profiles.",
    icon: "📐",
    percentage: 95,
    watermark: "CDR"
  },
  {
    name: "Microsoft Excel & Word",
    level: "Data & Publication Structure (85%)",
    description: "Coordinating detailed trophy catalogues, inventory databases, client project reports, billing files and written summaries.",
    useCase: "Logging customized orders, storing client names, calculating bulk order quotes and billing summaries.",
    icon: "📊",
    percentage: 85,
    watermark: "OFFICE"
  },
  {
    name: "ChatGPT (AI Design Workflows)",
    level: "Professional Strategist (85%)",
    description: "Harnessing AI language outputs to write high-impact marketing taglines, organize raw design brief folders, and speed up research on brand competitors.",
    useCase: "Drafting catchy advertising copy, synthesizing complex packaging ingredient profiles, generating promotional outline concepts.",
    icon: "🤖",
    percentage: 85,
    watermark: "AI"
  },
  {
    name: "Canva Pro",
    level: "Rapid Prototyper (90%)",
    description: "Sleek social templates, initial mood boarding, client inspiration templates and layout presentations.",
    useCase: "Dynamic social posts, fast-turnaround business cards, graphic pitch cards.",
    icon: "✨",
    percentage: 90,
    watermark: "CANVA"
  },
  {
    name: "Adobe Photoshop",
    level: "Creative Compositor (50%)",
    description: "Sizing high-res promotional imagery, pen-tool product silhouette isolation, professional lighting edits for trophy books.",
    useCase: "Image backgrounds, color grading for flyers, herbal packaging illustrations, banner photography preparation.",
    icon: "🎨",
    percentage: 50,
    watermark: "PSD"
  }
];

const GENERAL_EXPERTISE = [
  "Graphic Designing (Core Practice)",
  "Branding & Visual Identity Standards",
  "Print Media & Bleed Guard Design",
  "Product Packaging & Regulatory Labeling",
  "Social Media Ad Designs",
  "Catalogue, Brochure & Pamphlet Layouts",
  "Logo Creation & Vector Curves",
  "T-Shirt, Merchandise & Medal Graphics",
  "Product Photography & Lighting Calibration",
  "Microsoft Excel order logging & database tracking"
];

export default function SkillsGrid() {
  return (
    <div className="py-6 border-b border-[#222]" id="skills-section">
      <div className="mb-8">
        <span className="text-xs font-mono uppercase text-[#FF3E00] tracking-widest font-bold block mb-1">Toolbox</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">
          Technical Stack & Expertise
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
              SEC_TLX_05
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

        <p className="text-sm text-[#737373] mt-2.5 max-w-xl">
          I bridge master craftsmanship in print-design with state of the art tools to craft visuals that pop, print flawlessly, and drive actual customer action.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Hand: Software Tools Bento */}
        <div className="lg:col-span-8 space-y-4">
          <span className="text-[10px] font-mono text-[#737373] uppercase tracking-wider block border-b border-[#1C1C1C] pb-2">
            Professional Software Tool Utilization
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOOLS_SKILLS.map((skill, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ 
                  y: -6, 
                  borderColor: 'rgba(255, 62, 0, 0.7)', 
                  boxShadow: '0 12px 30px -10px rgba(255, 62, 0, 0.16)' 
                }}
                className="bg-[#111111] border border-[#222] p-5 rounded group flex flex-col justify-between cursor-default transition-colors duration-350 relative overflow-hidden"
              >
                {/* Background Watermark Icon */}
                <div className="absolute -right-4 -bottom-4 opacity-[0.015] text-white group-hover:opacity-[0.08] group-hover:text-brand-accent group-hover:scale-110 pointer-events-none transition-all duration-500 transform translate-x-2 translate-y-2 z-0">
                  {getWatermarkIcon(skill.name)}
                </div>

                <div className="relative z-10 flex flex-col justify-between h-full w-full">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{skill.icon}</span>
                      <span className="text-[10px] font-mono text-[#FF3E00] uppercase font-bold bg-[#FF3E00]/10 px-2 py-0.5 rounded border border-[#FF3E00]/20">
                        {skill.level}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white uppercase group-hover:text-[#FF3E00] transition-colors leading-none mb-1">
                      {skill.name}
                    </h3>
                    
                    {/* Dynamic Skill Level Progress Bar */}
                    <div className="my-3">
                      <div className="flex justify-between text-[9px] font-mono text-[#737373] mb-1">
                        <span>CALIBRATION PRECISION</span>
                        <span className="text-white font-bold">{skill.percentage}%</span>
                      </div>
                      <div className="w-full h-1 bg-[#1F1F1F] rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.1 }}
                          className="h-full bg-gradient-to-r from-[#FF3E00]/60 to-[#FF3E00]"
                        />
                      </div>
                    </div>

                    <p className="text-xs text-[#A3A3A3] leading-relaxed mt-2">
                      {skill.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1C1C1C] text-[11px] font-mono text-gray-500">
                    <span className="text-white font-bold uppercase block text-[9px] mb-1">Affan's Standard Hand-off:</span>
                    {skill.useCase}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Hand: Core Capabilities */}
        <div className="lg:col-span-4 bg-[#0F0F0F] border border-[#222] p-6 rounded-lg flex flex-col justify-between relative overflow-hidden group">
          {/* Background Watermark Icon */}
          <div className="absolute -right-4 -bottom-4 opacity-[0.015] text-white group-hover:opacity-[0.07] group-hover:text-brand-accent group-hover:scale-110 pointer-events-none transition-all duration-500 transform translate-x-2 translate-y-2 z-0">
            <Award className="w-32 h-32" />
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full w-full">
            <div>
              <span className="text-[10px] font-mono text-[#737373] uppercase tracking-wider block border-b border-[#1C1C1C] pb-2 mb-4">
                Core Creative Disciplines (A—Z)
              </span>

              <div className="space-y-3">
                {GENERAL_EXPERTISE.map((exp, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#FF3E00] flex-shrink-0" />
                    <span className="text-xs font-mono uppercase text-white/90">
                      {exp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#222] pt-6 mt-6">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🏆</div>
                <div>
                  <p className="text-xs font-bold text-white uppercase">Certified Expertise</p>
                  <p className="text-[10px] text-[#737373]">
                    91% Aggregate Professional Certification in Graphic Design (USDC Center, Bhiwandi)
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
