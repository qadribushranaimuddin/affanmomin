import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sliders, Award, Layers, SlidersHorizontal } from "lucide-react";
import PrepressStudio from "./PrepressStudio";
import PostPressLab from "./PostPressLab";
import InteractiveSandbox from "./InteractiveSandbox";

type LabTab = "prepress" | "postpress" | "sandbox";

export default function InteractiveLab() {
  const [activeTab, setActiveTab] = useState<LabTab>("prepress");
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");

  const tabs: { id: LabTab; label: string; subtitle: string; icon: any }[] = [
    { 
      id: "prepress", 
      label: "Prepress Studio", 
      subtitle: "Sizing & Calibration", 
      icon: SlidersHorizontal 
    },
    { 
      id: "postpress", 
      label: "Tactile Postpress Lab", 
      subtitle: "3D Origami Folds & Emboss Foil", 
      icon: Layers 
    },
    { 
      id: "sandbox", 
      label: "Brand Identity Sandbox", 
      subtitle: "CorelDRAW Preset Sandbox", 
      icon: Award 
    }
  ];

  const handleTabSwitch = (tabId: LabTab) => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    const targetIndex = tabs.findIndex(t => t.id === tabId);
    setSlideDirection(targetIndex > currentIndex ? "left" : "right");
    setActiveTab(tabId);
  };

  const handlePrevTab = () => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    handleTabSwitch(tabs[prevIndex].id);
  };

  const handleNextTab = () => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    handleTabSwitch(tabs[nextIndex].id);
  };

  const handleDragEnd = (_e: any, info: any) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      handleNextTab();
    } else if (info.offset.x > threshold) {
      handlePrevTab();
    }
  };

  return (
    <div className="py-8 border-b border-[#222]" id="lab-section">
      {/* Header Section */}
      <div className="mb-10">
        <span className="text-xs font-mono uppercase text-[#FF3E00] tracking-widest font-bold block mb-1">
          // Interactive Studio Suite
        </span>
        <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none select-none">
          Design Production Lab
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
              SEC_LAB_06
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
          Calibrate size files, review 3D tuck carton origami folding prototypes, and test brand style variations within our integrated press-ready simulators.
        </p>
      </div>

      {/* Main Glassmorphic Dashboard */}
      <div className="w-full bg-[#111]/10 border border-white/5 rounded-2xl p-6 lg:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#FF3E00]/5 to-transparent pointer-events-none select-none" />

        {/* Tab Buttons bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabSwitch(tab.id)}
                className={`flex items-center gap-3.5 p-4 rounded-xl border text-left cursor-pointer transition-all relative overflow-hidden group ${
                  isSelected
                    ? "bg-[#FF3E00] text-black font-extrabold border-[#FF3E00] shadow-[0_4px_20px_rgba(255,62,0,0.15)]"
                    : "bg-[#111]/40 border-white/5 hover:border-[#FF3E00]/40 text-gray-400 hover:text-white"
                }`}
              >
                <div className={`p-2.5 rounded-lg border transition-colors ${
                  isSelected ? "bg-black/10 border-black/10 text-black" : "bg-[#161616] border-white/5 text-[#FF3E00]"
                }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
                <div>
                  <span className={`block font-mono text-[9px] uppercase tracking-wider ${
                    isSelected ? "text-black/60" : "text-[#737373]"
                  }`}>
                    {tab.subtitle}
                  </span>
                  <span className="block text-xs font-bold uppercase tracking-tight leading-none mt-1">
                    {tab.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Component Slide Viewport */}
        <div className="w-full min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: slideDirection === "left" ? 25 : -25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: slideDirection === "left" ? -25 : 25 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="w-full"
            >
              {activeTab === "prepress" && <PrepressStudio />}
              {activeTab === "postpress" && <PostPressLab />}
              {activeTab === "sandbox" && <InteractiveSandbox />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Swipe Handles Bar */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="w-full py-3 bg-[#111]/50 border border-white/5 hover:border-[#FF3E00]/30 transition-colors rounded-xl text-center cursor-grab active:cursor-grabbing font-mono text-[8px] tracking-[0.25em] text-[#737373] hover:text-white uppercase flex items-center justify-center gap-2 select-none"
          >
            <span>← DRAG OR SWIPE LEFT / RIGHT HERE TO CYCLE LAB SIMULATORS →</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
