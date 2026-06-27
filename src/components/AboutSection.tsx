import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap, 
  Languages, 
  Award, 
  Heart, 
  CheckCircle2, 
  Library, 
  User,
  Palette,
  PenTool,
  Music,
  Gamepad2,
  Plane,
  Guitar
} from "lucide-react";
import ParallaxWrapper from "./ParallaxWrapper";

const getHobbyIcon = (hobby: string) => {
  switch (hobby) {
    case "Painting":
      return <Palette className="w-12 h-12" />;
    case "Designing Vector Projects":
      return <PenTool className="w-12 h-12" />;
    case "Playing Piano":
      return <Music className="w-12 h-12" />;
    case "Instrumental Music":
      return <Guitar className="w-12 h-12" />;
    case "Casual Gaming":
      return <Gamepad2 className="w-12 h-12" />;
    case "Traveling":
      return <Plane className="w-12 h-12" />;
    default:
      return <Heart className="w-12 h-12" />;
  }
};

interface Education {
  degree: string;
  institution: string;
  year: string;
  percentage?: string;
  details: string;
}

const EDUCATION_ITEMS: Education[] = [
  {
    degree: "Master of Arts (M.A.)",
    institution: "Pursuing Postgraduate Studies",
    year: "Ongoing",
    details: "Continuing academic research and advanced humanity studies to enrich visual layouts, typography, and visual communication theories."
  },
  {
    degree: "Bachelor of Arts (B.A.)",
    institution: "GM Women's College, Bhiwandi",
    year: "Completed 2026",
    details: "Successfully completed undergraduate general arts education, establishing deep context on historic designs, cultural semantics, and writing layouts."
  },
  {
    degree: "Graphic Designing Certification",
    institution: "Universal Skills Development Center, Bhiwandi",
    year: "Completed 2023",
    percentage: "91%",
    details: "Completed Professional Creative Graphic Designing curriculum. Focused deeply on vector tools (CorelDRAW calibration), commercial posters, brand identity design, and technical prepress layouts."
  },
  {
    degree: "Higher Secondary Certificate (HSC)",
    institution: "Shad Adam Shaikh Technical High School & Jr. College, Bhiwandi",
    year: "Completed 2021",
    percentage: "82%",
    details: "Studied Mechanical Vocational curriculum. Gained deep industrial precision skills, drafting blueprints, spatial calculations, and physical calibration which directly boosts flex print accuracy."
  },
  {
    degree: "Secondary School Certificate (SSC)",
    institution: "M.S.P. High School & Jr. College, Mahapoli",
    year: "Completed 2019",
    percentage: "72%",
    details: "Completed general secondary high school scientific matrix and mathematics."
  }
];

const LANGUAGES = ["English", "Hindi", "Marathi", "Urdu", "Arabic"];
const HOBBIES = ["Painting", "Designing Vector Projects", "Playing Piano", "Instrumental Music", "Casual Gaming", "Traveling"];
const LOCATION = "Bhiwandi, Dist. Thane - 421302, Maharashtra, India";

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState<"bio" | "education" | "hobbies">("bio");
  const [isMobile, setIsMobile] = useState(false);
  const [showIdentityImage, setShowIdentityImage] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  return (
    <section
      id="about-section"
      className="py-8 border-b border-[#222]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left column: Title and Tab Selectors */}
        <ParallaxWrapper speed={0.05} className="lg:col-span-3 h-full">
          <div className="flex flex-col justify-between h-full space-y-8">
            <div>
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                const threshold = 30;
                if (Math.abs(info.offset.x) > threshold) {
                  setShowIdentityImage((prev) => !prev);
                }
              }}
              className="cursor-grab active:cursor-grabbing select-none relative overflow-hidden rounded-lg p-2 border border-transparent hover:border-[#FF3E00]/10 transition-colors group"
            >
              <AnimatePresence mode="wait">
                {!showIdentityImage ? (
                  <motion.div
                    key="text-identity"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <span className="text-xs font-mono uppercase text-[#FF3E00] tracking-widest font-bold block mb-1">
                      // Core Identity
                    </span>
                    <h3 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none select-none">
                      About<br />
                      Momin Affan
                    </h3>
                    
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
                          SEC_BIO_01
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

                    <p className="mt-3 text-sm text-[#737373] leading-relaxed">
                      Based out of Bhiwandi, Thane, Momin is an artistic technician translating commercial requirements into rigorous graphic vectors.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="image-identity"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center justify-center py-4 bg-[#0A0A0A]/40 border border-[#222] rounded-lg relative overflow-hidden"
                  >
                    {/* Technical Calibration Grid Underlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(#1f1f1f_1px,transparent_1px)] [background-size:12px_12px] opacity-35 z-0 pointer-events-none" />

                    <div className="relative w-[180px] aspect-[4/5] flex items-end justify-center select-none z-10">
                      <img 
                        src="/Assets/affan.png" 
                        alt="Affan Momin Portrait" 
                        className="w-[90%] h-auto object-contain transition-all duration-300 filter contrast-[1.05]"
                      />
                    </div>
                    
                    <div className="mt-2 font-mono text-[8px] text-[#FF3E00] uppercase tracking-widest animate-pulse z-10">
                      [ SEC_BIO_01_IMAGE ]
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Swipe prompt hint on hover */}
              <div className="absolute bottom-1 right-2 font-mono text-[6px] text-[#444] uppercase pointer-events-none group-hover:text-[#FF3E00]/40 transition-colors">
                ← Swipe to toggle →
              </div>
            </motion.div>
            </div>

            {/* Tab Selector Buttons - Bento Styling */}
            <div className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-wider">
              {(["bio", "education", "hobbies"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-4 text-left cursor-pointer transition-all border rounded-lg ${
                    activeTab === tab
                      ? "bg-[#FF3E00] text-black font-extrabold font-black border-[#FF3E00] shadow-[0_0_15px_rgba(255,62,0,0.2)]"
                      : "bg-[#111]/30 backdrop-blur-md text-[#A3A3A3] border-white/5 hover:border-[#FF3E00]/40 hover:text-white"
                  }`}
                >
                  {tab === "bio" && "Professional Bio"}
                  {tab === "education" && "Education Train"}
                  {tab === "hobbies" && "Creative Outlets"}
                </button>
              ))}
              
              {/* Download Resume Button */}
              <a
                href="/My Resume.pdf"
                download="Momin_Affan_Resume.pdf"
                className="py-3 px-4 text-left cursor-pointer transition-all border rounded-lg bg-[#111]/30 backdrop-blur-md text-[#A3A3A3] border-white/5 hover:border-[#FF3E00] hover:text-[#FF3E00] flex items-center justify-between"
              >
                <span>Download Resume</span>
                <span className="text-[8px] font-bold opacity-80 uppercase tracking-widest">[PDF]</span>
              </a>
            </div>
          </div>
        </ParallaxWrapper>

        {/* Right column: Tab Content Area */}
        <div className="lg:col-span-9 p-6 md:p-8 bg-[#111111]/30 backdrop-blur-md border border-white/5 rounded-2xl shadow-xl min-h-[440px] flex flex-col justify-between relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF3E00]/5 to-transparent pointer-events-none select-none" />

          <AnimatePresence mode="wait">
            {/* TAB 1: BIO */}
            {activeTab === "bio" && (
              <motion.div
                key="bio-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.22 }}
                className="space-y-6 relative h-full w-full"
              >
                {/* Background Multilingual Name Watermark */}
                <div className="absolute right-4 bottom-12 select-none pointer-events-none z-0 flex items-center justify-end w-[250px] md:w-[350px] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={nameIndex}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: isMobile ? 0.08 : 0.02, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 1.0, ease: "easeInOut" }}
                      className="text-[12vw] md:text-[6vw] font-black tracking-tighter text-brand-accent uppercase leading-none font-sans whitespace-nowrap text-right"
                    >
                      {names[nameIndex]}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-2 text-[#FF3E00]">
                    <User className="w-5 h-5" />
                    <h4 className="text-xl font-bold uppercase tracking-tight text-white">
                      Merging Precision Vector Layouts with Generative AI Speed
                    </h4>
                  </div>
                  <p className="text-sm text-[#A3A3A3] leading-relaxed max-w-3xl">
                    I am a passionate and dedicated Graphic Designer with robust expertise drafting complex graphic templates, logo systems, and packaging templates using CorelDRAW. I have delivered creative blueprints for advertising catalogs, large scale banners, flex setups, brochures, customized medal illustrations, and retail products labels.
                  </p>
                  <p className="text-sm text-[#737373] leading-relaxed max-w-3xl">
                    By leveraging state-of-the-art artificial intelligence models (such as ChatGPT prompts drafting) into my traditional CorelDRAW processes, I cut pre-production mock times in half, enabling clients to test structures rapidly before triggering large-scale press runs.
                  </p>
                </div>

                {/* Grid of basic attributes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                  <div>
                    <h5 className="font-mono text-[9px] text-[#FF3E00] uppercase tracking-widest mb-3 flex items-center gap-1.5 font-bold">
                      <Languages className="w-3.5 h-3.5" /> Communication & Languages
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {LANGUAGES.map((lang) => (
                        <span
                          key={lang}
                          className="font-mono text-[9px] text-white bg-white/[0.03] px-3 py-1 border border-white/5 rounded"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-mono text-[9px] text-[#FF3E00] uppercase tracking-widest mb-3 flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Professional Stance
                    </h5>
                    <ul className="text-xs text-[#737373] space-y-1">
                      <li>• Committed to extreme graphic precision & color fidelity</li>
                      <li>• Expert layout drafting in CorelDRAW</li>
                      <li>• High proficiency in offset print pre-flight preps</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: EDUCATION */}
            {activeTab === "education" && (
              <motion.div
                key="education-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.22 }}
                className="space-y-6 w-full"
              >
                <div className="flex items-center gap-2 text-[#FF3E00] mb-4">
                  <GraduationCap className="w-5 h-5" />
                  <h4 className="text-xl font-bold uppercase tracking-tight text-white">
                    Academic Base & Technical Qualifications
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
                  {EDUCATION_ITEMS.map((edu, idx) => {
                    const isCorelCert = edu.degree.includes("Graphic Designing");
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl flex flex-col justify-between group transition-all duration-300 border relative overflow-hidden ${
                          isCorelCert
                            ? 'bg-[#151211] border-[#FF3E00]/60 shadow-[0_4px_24px_rgba(255,62,0,0.04)]'
                            : 'bg-[#111]/60 border-white/5 hover:border-[#FF3E00]/40'
                        }`}
                      >
                        {/* Background Watermark Icon */}
                        <div className="absolute -right-3 -bottom-3 opacity-[0.015] text-white group-hover:opacity-[0.06] group-hover:text-[#FF3E00] group-hover:scale-105 pointer-events-none transition-all duration-500 transform translate-x-2 translate-y-2">
                          <GraduationCap className="w-24 h-24" />
                        </div>

                        <div className="space-y-3 z-10">
                          <div className="flex justify-between items-start gap-3">
                            <span className="text-[9px] font-mono text-[#FF3E00] uppercase font-bold bg-[#FF3E00]/10 px-2 py-0.5 rounded border border-[#FF3E00]/20">
                              {edu.year}
                            </span>
                            {edu.percentage && (
                              <span className="text-[9px] font-mono text-[#00FF66] font-extrabold uppercase flex items-center gap-1">
                                <Award className="w-3 h-3" /> Score: {edu.percentage}
                              </span>
                            )}
                          </div>

                          <div>
                            <h5 className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-[#FF3E00] transition-colors leading-tight">
                              {edu.degree}
                            </h5>
                            <p className="text-[9px] font-mono text-[#A3A3A3] mt-0.5 uppercase">
                              {edu.institution}
                            </p>
                          </div>

                          <p className="text-[11px] text-[#737373] leading-relaxed">
                            {edu.details}
                          </p>
                        </div>

                        <div className="border-t border-white/5 pt-2.5 mt-3 flex items-center gap-1.5 text-[8px] font-mono text-[#525252] uppercase">
                          <Library className={`w-3.5 h-3.5 ${isCorelCert ? 'text-[#FF3E00]/85' : 'text-[#525252]'}`} />
                          <span className={isCorelCert ? 'text-white/60 font-semibold' : ''}>Calibrated credential</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 3: HOBBIES */}
            {activeTab === "hobbies" && (
              <motion.div
                key="hobbies-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.22 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 text-[#FF3E00]">
                  <Heart className="w-5 h-5" />
                  <h4 className="text-xl font-bold uppercase tracking-tight text-white">
                    Creative Outlets & Hobbies
                  </h4>
                </div>
                <p className="text-sm text-[#737373] leading-relaxed max-w-2xl">
                  Design is not just work; it is how I interact with reality. My personal hobbies provide fresh viewpoints that fuel commercial graphic conceptualizing:
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  {HOBBIES.map((hobby, index) => (
                    <div
                      key={index}
                      className="group p-4 bg-[#111]/40 border border-white/5 rounded-xl transition-all hover:border-[#FF3E00]/40 flex flex-col justify-between min-h-[90px] relative overflow-hidden"
                    >
                      {/* Watermark Icon */}
                      <div className="absolute right-1 bottom-1 opacity-[0.025] text-white group-hover:opacity-[0.09] group-hover:text-[#FF3E00] group-hover:scale-110 pointer-events-none transition-all duration-500 transform translate-x-2 translate-y-2">
                        {getHobbyIcon(hobby)}
                      </div>

                      <div className="font-mono text-[#FF3E00] text-right text-[9px] font-bold z-10">
                        // 0{index + 1}
                      </div>
                      <div className="font-mono text-xs text-white font-bold uppercase tracking-wider z-10">
                        {hobby}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom segment: address details */}
          <div className="mt-8 pt-4 border-t border-white/5 flex flex-wrap justify-between items-center text-[9px] font-mono text-[#737373] uppercase tracking-widest gap-2">
            <div>HQ Operational Location:</div>
            <div className="text-white">{LOCATION}</div>
          </div>

        </div>
      </div>
    </section>
  );
}
