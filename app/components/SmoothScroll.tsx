"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Optimal configuration for heavy WebGL / Spline scenes
    const lenis = new Lenis({
      lerp: 0.05,
      wheelMultiplier: 0.8,
      smoothWheel: true,
      orientation: "vertical",
      gestureOrientation: "vertical",
    } as any);

    let animationFrameId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };

    animationFrameId = requestAnimationFrame(raf);

    // Clean up on component unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
