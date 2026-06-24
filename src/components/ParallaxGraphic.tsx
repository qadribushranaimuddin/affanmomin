import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Crosshair } from "lucide-react";

interface ParallaxGraphicProps {
  topPosition?: string; // CSS top value (e.g., "15%")
  side?: "left" | "right";
  speed?: number; // Drift multiplier
  vibe?: "cmyk" | "ruler" | "crosshair" | "code";
}

/**
 * Renders high-end, floating technical design assets in full parallax.
 * Specifically designed to support the "pre-press machine setup" theme,
 * including a CMYK registration proof that aligns perfectly as the user scrolls.
 */
export default function ParallaxGraphic({
  topPosition = "20%",
  side = "left",
  speed = 0.15,
  vibe = "cmyk",
}: ParallaxGraphicProps) {
  // Track absolute viewport scroll progress without local element target ref
  const { scrollY } = useScroll();

  // Calculate generic coordinate slide based on window scroll
  const rawY = useTransform(scrollY, [0, 3000], [150 * speed, -150 * speed]);
  const smoothY = useSpring(rawY, { stiffness: 90, damping: 25 });

  // Special plate-offsets for CMYK alignment concept
  // They diverge up to 24px and converge to 0px at center scroll (~1000px coordinate)
  const offsetCyanX = useTransform(scrollY, [0, 1000, 2400], [-18, 0, 18]);
  const offsetCyanY = useTransform(scrollY, [0, 1000, 2400], [-9, 0, 9]);

  const offsetMagentaX = useTransform(scrollY, [0, 1000, 2400], [18, 0, -18]);
  const offsetMagentaY = useTransform(scrollY, [0, 1000, 2400], [-14, 0, 14]);

  const offsetYellowX = useTransform(scrollY, [0, 1000, 2400], [-11, 0, 11]);
  const offsetYellowY = useTransform(scrollY, [0, 1000, 2400], [14, 0, -14]);

  const smoothCyanX = useSpring(offsetCyanX, { stiffness: 80, damping: 20 });
  const smoothCyanY = useSpring(offsetCyanY, { stiffness: 80, damping: 20 });
  const smoothMagentaX = useSpring(offsetMagentaX, { stiffness: 80, damping: 20 });
  const smoothMagentaY = useSpring(offsetMagentaY, { stiffness: 80, damping: 20 });
  const smoothYellowX = useSpring(offsetYellowX, { stiffness: 80, damping: 20 });
  const smoothYellowY = useSpring(offsetYellowY, { stiffness: 80, damping: 20 });

  return (
    <div
      style={{ top: topPosition }}
      className={`absolute ${
        side === "left" ? "left-6 md:left-14" : "right-6 md:right-14"
      } pointer-events-none -z-10 select-none hidden xl:block`}
    >
      <motion.div style={{ y: smoothY }} className="flex flex-col items-center">
        {/* Render different styles of parallax graphics based on category */}
        {vibe === "cmyk" && (
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Outline black alignment circle */}
            <div className="absolute w-8 h-8 border border-white/20 rounded-full flex items-center justify-center">
              <div className="w-10 h-[0.5px] bg-white/20 absolute" />
              <div className="h-10 w-[0.5px] bg-white/20 absolute" />
            </div>

            {/* Cyan layer plate */}
            <motion.div
              style={{ x: smoothCyanX, y: smoothCyanY }}
              className="absolute w-8 h-8 border border-cyan-400 rounded-full mix-blend-screen opacity-80"
            />

            {/* Magenta layer plate */}
            <motion.div
              style={{ x: smoothMagentaX, y: smoothMagentaY }}
              className="absolute w-8 h-8 border border-fuchsia-500 rounded-full mix-blend-screen opacity-80"
            />

            {/* Yellow layer plate */}
            <motion.div
              style={{ x: smoothYellowX, y: smoothYellowY }}
              className="absolute w-8 h-8 border border-yellow-400 rounded-full mix-blend-screen opacity-80"
            />

            <div className="absolute top-[72px] font-mono text-[6px] tracking-widest text-[#00ffff] rotate-90 scale-90 whitespace-nowrap">
              CMYK_REGISTRATION_GAP
            </div>
          </div>
        )}

        {vibe === "ruler" && (
          <div className="flex items-center gap-1.5 py-2">
            <div className="h-28 w-2 border-l border-b border-t border-white/10 relative flex flex-col justify-between py-1">
              <div className="w-1.5 h-[0.5px] bg-white/10" />
              <div className="w-1 h-[0.5px] bg-white/10" />
              <div className="w-1.5 h-[0.5px] bg-white/10" />
              <div className="w-1 h-[0.5px] bg-white/10" />
              <div className="w-1.5 h-[0.5px] bg-white/10" />
            </div>
            <span className="font-mono text-[6px] text-gray-500/40 uppercase rotate-90 origin-left translate-x-2 translate-y-10 whitespace-nowrap">
              MICRON_CALIBRATOR_7.1x
            </span>
          </div>
        )}

        {vibe === "crosshair" && (
          <div className="relative w-12 h-12 flex items-center justify-center">
            <Crosshair className="w-6 h-6 text-[#FF3E00]/20 animate-spin" style={{ animationDuration: '10s' }} />
            <div className="absolute w-8 h-8 border border-dashed border-white/10 rounded-full" />
            <span className="absolute -bottom-4 font-mono text-[6px] text-gray-500/30">
              AXIS_RE_040
            </span>
          </div>
        )}

        {vibe === "code" && (
          <div className="font-mono text-[6px] text-gray-500/30 text-left border-l border-[#FF3E00]/20 pl-2 py-1 space-y-0.5">
            <div>import {"{"} motion {"}"} from "motion";</div>
            <div>const speed = {speed};</div>
            <div>{"//"} POSITION CALIBRATED</div>
            <div>Y_AXIS: PARALLAX</div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
