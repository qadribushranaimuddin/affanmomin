import { Crosshair, Star } from "lucide-react";

export default function MarginCalibrationStamps() {
  return (
    <div className="fixed inset-0 pointer-events-none z-45 hidden lg:block select-none overflow-hidden">
      {/* --------------------- TOP MARGIN --------------------- */}
      <div className="absolute top-[84px] left-1/2 -translate-x-1/2 flex items-center gap-12 font-mono text-[7px] text-gray-500/40 uppercase tracking-[0.2em]">
        <span>[ TRIM_LIMIT: 320mm / 480mm ]</span>
        
        <span>[ SYS_PRESSURE: ACCURATE ]</span>
      </div>

      {/* --------------------- BOTTOM MARGIN --------------------- */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-10 font-mono text-[7px] text-gray-500/30 uppercase tracking-widest bg-[#0A0A0A]/60 backdrop-blur-xs px-4 py-1 border border-white/5">
        <span>BHIWANDI OFFSET PRESS // PLATE_NO: MA-2026-X7</span>
        <span className="text-[#FF3E00] font-bold">•</span>
        <span>CMYK COMPOUND PROOF</span>
        <span className="text-[#FF3E00] font-bold">•</span>
        <span>ZERO_OFFSET_TARGET</span>
      </div>





      {/* --------------------- CORNER CROP MARKS --------------------- */}
      {/* Top Left Corner */}
      <div className="absolute top-[96px] left-12 w-6 h-6 border-t-[0.5px] border-l-[0.5px] border-gray-500/40">
        <div className="absolute top-[-4px] left-0 font-mono text-[5px] text-gray-500/30">CROP_TL</div>
      </div>
      {/* Top Right Corner */}
      <div className="absolute top-[96px] right-12 w-6 h-6 border-t-[0.5px] border-r-[0.5px] border-gray-500/40">
        <div className="absolute top-[-4px] right-0 font-mono text-[5px] text-gray-500/30 text-right">CROP_TR</div>
      </div>
      {/* Bottom Left Corner */}
      <div className="absolute bottom-12 left-12 w-6 h-6 border-b-[0.5px] border-l-[0.5px] border-gray-500/40">
        <div className="absolute bottom-[-4px] left-0 font-mono text-[5px] text-gray-500/30">CROP_BL</div>
      </div>
      {/* Bottom Right Corner */}
      <div className="absolute bottom-12 right-12 w-6 h-6 border-b-[0.5px] border-r-[0.5px] border-gray-500/40">
        <div className="absolute bottom-[-4px] right-0 font-mono text-[5px] text-gray-500/30 text-right">CROP_BR</div>
      </div>
    </div>
  );
}
