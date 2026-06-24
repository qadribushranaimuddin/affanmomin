import { ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

interface ParallaxWrapperProps {
  children: ReactNode;
  speed?: number; // Adjust speed multiplier (e.g. 0.1, 0.2, -0.1)
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  disabled?: boolean;
}

/**
 * A layout component that applies smooth, hardware-accelerated parallax scroll effects
 * using highly stable absolute window scroll tracking.
 */
export default function ParallaxWrapper({
  children,
  speed = 0.1,
  direction = "up",
  className = "",
  disabled = false,
}: ParallaxWrapperProps) {
  const { scrollY } = useScroll();

  // Calculate parallax offset based on absolute window scrolling
  const isHorizontal = direction === "left" || direction === "right";
  const multiplier = direction === "up" || direction === "left" ? 1 : -1;
  const translationValue = 180 * speed * multiplier;

  // Map scroll progress smoothly
  const rawYTranslation = useTransform(
    scrollY,
    [0, 3000],
    isHorizontal ? [0, 0] : [translationValue, -translationValue]
  );

  const rawXTranslation = useTransform(
    scrollY,
    [0, 3000],
    isHorizontal ? [translationValue, -translationValue] : [0, 0]
  );

  // Apply smooth spring physics to reduce screen jitter and simulate physical mass
  const smoothY = useSpring(rawYTranslation, {
    stiffness: 85,
    damping: 24,
    mass: 0.8,
  });

  const smoothX = useSpring(rawXTranslation, {
    stiffness: 85,
    damping: 24,
    mass: 0.8,
  });

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative overflow-visible ${className}`}>
      <motion.div
        style={{
          y: smoothY,
          x: smoothX,
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
