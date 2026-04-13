"use client";
import React, { useEffect, useRef } from "react";

export default function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    // Track mouse globally across the container
    let mouse = { x: -1000, y: -1000, radius: 200 };

    const resize = () => {
      canvas.width = window.innerWidth;
      // Match the canvas height to its parent strictly so it spans both sections flawlessly
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight * 2;
      init();
    };

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      density: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.size = Math.random() * 2.5 + 0.5;
        // 80% dominant Neon Blue, 20% Deep Cyber Purple
        this.color = Math.random() > 0.2 ? 'rgba(0, 230, 255, 0.8)' : 'rgba(139, 92, 246, 0.8)';
        this.density = (Math.random() * 30) + 1;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        
        // Render Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        
        ctx.shadowBlur = 0; // reset for lines
      }

      update() {
        // Natural ambient drift
        this.baseX += this.vx * 0.3;
        this.baseY += this.vy * 0.3;

        // Bounding box bounce logic
        if (this.baseX < 0 || this.baseX > canvas!.width) this.vx *= -1;
        if (this.baseY < 0 || this.baseY > canvas!.height) this.vy *= -1;

        // Magnetic repel interaction from mouse
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          // Easing equation for smooth force
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = forceDirectionX * force * this.density;
          let directionY = forceDirectionY * force * this.density;
          
          this.x -= directionX;
          this.y -= directionY;
        } else {
          // Smooth return ease to base position naturally recreating shape
          if (this.x !== this.baseX) {
            this.x -= (this.x - this.baseX) * 0.05;
          }
          if (this.y !== this.baseY) {
            this.y -= (this.y - this.baseY) * 0.05;
          }
        }
      }
    }

    const init = () => {
      particles = [];
      // Calculate dense enough particle count for 60fps
      const particleCount = Math.floor((canvas.width * canvas.height) / 10000); 
      for (let i = 0; i < particleCount; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      // Draw neural network connective lines between extremely close particles
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 80) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 230, 255, ${(1 - distance / 80) * 0.25})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    
    // Register global mouse tracking inside window, offset by canvas bounding box
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    
    const handleMouseOut = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);

    // Minor delay to ensure parent is completely rendered and sized
    setTimeout(resize, 100);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 mix-blend-screen"
    />
  );
}
