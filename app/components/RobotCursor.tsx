"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect } from "react";

export default function RobotCursor() {
  const [isHovering, setIsHovering] = useState(false);

  // Use MotionValues to bypass React state entirely for 60fps buttery smooth performance
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Apply smooth spring physics directly to the motion values
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const move = (e: MouseEvent) => {
        mouseX.set(e.clientX - 20);
        mouseY.set(e.clientY - 20);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('a') || target.closest('button') || target.closest('.cursor-pointer')) {
            setIsHovering(true);
        } else {
            setIsHovering(false);
        }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", handleMouseOver);
    
    return () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{ x: smoothX, y: smoothY }}
      animate={{ scale: isHovering ? 1.5 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="w-10 h-10 rounded-full border border-[#00E6FF] flex items-center justify-center bg-black/50 backdrop-blur-[25px] shadow-[0_0_20px_#00E6FF]">
        🤖
      </div>
    </motion.div>
  );
}
