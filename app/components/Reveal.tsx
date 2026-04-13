"use client";
import { motion } from "framer-motion";
import React from "react";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export default function Reveal({ children, delay = 0, direction = "up" }: RevealProps) {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 80 : direction === "down" ? -80 : 0,
      x: direction === "left" ? 80 : direction === "right" ? -80 : 0,
      filter: "blur(10px)",
      scale: direction === "none" ? 0.98 : 1,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
