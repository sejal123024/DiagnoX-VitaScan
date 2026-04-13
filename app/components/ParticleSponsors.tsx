"use client";
import React, { useEffect, useRef } from "react";

const SPONSORS = [
  "Google", "Microsoft", "Amazon", "Apple", "Meta", 
  "OpenAI", "NVIDIA", "IBM", "Intel", "Adobe"
];

export default function ParticleSponsors() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let currentSponsorIndex = 0;
    
    // Mouse interaction tracking
    let mouse = { x: -1000, y: -1000, radius: 80 };

    let width = window.innerWidth;
    let height = canvas.parentElement?.clientHeight || window.innerHeight; 

    canvas.width = width;
    canvas.height = height;

    class Particle {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      size: number;
      color: string;
      vx: number;
      vy: number;
      friction: number;
      ease: number;
      isForming: boolean;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.size = Math.random() * 2 + 1;
        // Bright Teal, Medium Teal, or Dark Teal
        const teals = ['#14B8A6', '#2DD4BF', '#0F766E'];
        this.color = teals[Math.floor(Math.random() * teals.length)];
        this.vx = (Math.random() - 0.5) * 15;
        this.vy = (Math.random() - 0.5) * 15;
        this.friction = Math.random() * 0.04 + 0.88; // Physics drag
        this.ease = Math.random() * 0.1 + 0.02; // Snap-to-target speed
        this.isForming = false;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      update() {
        // Mouse repel logic
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          // Exponential repel force
          let force = (mouse.radius - distance) / mouse.radius;
          this.vx -= forceDirectionX * force * 5;
          this.vy -= forceDirectionY * force * 5;
        }

        if (this.isForming) {
             // Spring physics towards target
             let tx = this.targetX - this.x;
             let ty = this.targetY - this.y;
             this.vx += tx * this.ease;
             this.vy += ty * this.ease;
        } else {
             // Chaotic wander when not forming
             this.vx += (Math.random() - 0.5) * 0.5;
             this.vy += (Math.random() - 0.5) * 0.5;
             
             // Wrap around screen instead of hard bounce for cooler flow
             if (this.x < 0) this.x = width;
             if (this.x > width) this.x = 0;
             if (this.y < 0) this.y = height;
             if (this.y > height) this.y = 0;
        }

        // Apply global friction
        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;
      }
    }

    const getWordPixels = (word: string) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return [];

      offCtx.fillStyle = "white";
      // Auto-scale font dynamically based on screen width
      let fontSize = width < 768 ? 50 : 130;
      offCtx.font = `900 ${fontSize}px "Inter", "Segoe UI", sans-serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      // Draw text significantly below the center so it stays beneath the dark overlay
      offCtx.fillText(word, width / 2, height * 0.70);

      const imageData = offCtx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      const targetCoordinates = [];

      // Scan image data. Lower gap = higher particle density
      const gap = width < 768 ? 4 : 5; 
      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const index = (y * width + x) * 4;
          const alpha = pixels[index + 3];
          if (alpha > 128) {
             targetCoordinates.push({ x, y });
          }
        }
      }
      return targetCoordinates;
    };

    const morphToWord = (word: string) => {
      const newTargets = getWordPixels(word);
      
      // Inject missing particles into engine globally
      if (particles.length < newTargets.length) {
         const needed = newTargets.length - particles.length;
         for(let i=0; i<needed; i++) {
             // Spawn at random edges and storm inward
             particles.push(new Particle(Math.random() * width, Math.random() * height));
         }
      }

      // Re-assign array targets
      for (let i = 0; i < particles.length; i++) {
         if (i < newTargets.length) {
             particles[i].targetX = newTargets[i].x;
             particles[i].targetY = newTargets[i].y;
             particles[i].isForming = true;
         } else {
             particles[i].isForming = false; // Leftover particles wander the background
         }
      }
    };

    // Spin up initial pool
    for(let i=0; i<1500; i++) {
       particles.push(new Particle(Math.random() * width, Math.random() * height));
    }
    
    // Slight delay before first shape forms
    setTimeout(() => morphToWord(SPONSORS[currentSponsorIndex]), 500);

    const changeWordInterval = setInterval(() => {
        currentSponsorIndex = (currentSponsorIndex + 1) % SPONSORS.length;
        
        // Massive shatter explosion before reforming
        particles.forEach(p => {
           p.isForming = false;
           // Violent burst velocity
           p.vx = (Math.random() - 0.5) * 80;
           p.vy = (Math.random() - 0.5) * 80;
        });

        // Delay reforming to allow explosion to fill screen
        setTimeout(() => {
           morphToWord(SPONSORS[currentSponsorIndex]);
        }, 600);

    }, 3500);

    const animate = () => {
      // Draw semi-transparent black over previous frame to create motion blur trails
      ctx.fillStyle = "rgba(5, 5, 5, 0.25)";
      ctx.fillRect(0, 0, width, height);

      particles.forEach(p => {
         p.update();
         p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
       width = window.innerWidth;
       canvas.width = width;
       morphToWord(SPONSORS[currentSponsorIndex]);
    };

    const handleMouseMove = (e: MouseEvent) => {
       const rect = canvas.getBoundingClientRect();
       mouse.x = e.clientX - rect.left;
       mouse.y = e.clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
        mouse.x = -1000;
        mouse.y = -1000;
    }

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
       clearInterval(changeWordInterval);
       window.removeEventListener("resize", handleResize);
       if (canvas) {
           canvas.removeEventListener("mousemove", handleMouseMove);
           canvas.removeEventListener("mouseleave", handleMouseLeave);
       }
       cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', display: 'block' }}
        className="absolute inset-0 pointer-events-auto z-0"
      />
    </>
  );
}
