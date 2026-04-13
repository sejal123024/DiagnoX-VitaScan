"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { 
  FiMic, FiSliders, FiCpu, FiActivity, FiFileText, FiRefreshCcw, 
  FiArrowLeft, FiShield, FiTrendingUp, FiTarget, FiZap, FiLayers, FiDatabase 
} from "react-icons/fi";

export default function LearnMore() {
  const { scrollYProgress } = useScroll();
  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#14B8A6] selection:text-black overflow-x-hidden relative">
      
      {/* Abstract Backgrounds */}
      <motion.div style={{ y: yBackground }} className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-20%] w-[50%] h-[50%] bg-[#14B8A6]/20 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute top-[40%] right-[-20%] w-[60%] h-[60%] bg-[#0B3B3C]/40 blur-[180px] rounded-full mix-blend-screen" />
      </motion.div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 lg:px-12 pointer-events-none">
        <Link href="/">
          <motion.button 
            whileHover={{ x: -5, backgroundColor: "rgba(255,255,255,0.1)" }}
            className="pointer-events-auto flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium transition-colors hover:border-white/20"
          >
            <FiArrowLeft className="text-[#14B8A6]" />
            Return to Home
          </motion.button>
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-32 lg:py-40 relative z-10">
        
        {/* HERO TITLE */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-32"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-[#14B8A6] text-xs font-bold tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(20,184,166,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" /> The Architecture
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] to-[#0B3B3C]">VitaScan</span> Works
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
            VitaScan follows a multi-stage intelligent pipeline to transform simple voice input into meaningful, actionable health insights.
          </p>
        </motion.div>

        {/* PIPELINE / TIMELINE */}
        <div className="relative max-w-4xl mx-auto mb-40">
          {/* Vertical Tracking Line */}
          <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#14B8A6]/20 to-transparent -translate-x-1/2" />

          {[
            { 
              step: "1", title: "Voice Capture", icon: FiMic,
              desc: "Users record a short voice sample, which serves as the primary non-invasive input for deep neural analysis."
            },
            { 
              step: "2", title: "Audio Processing", icon: FiSliders,
              desc: "The system dynamically cleans and normalizes the audio signal to mathematically remove background noise and enforce structural consistency."
            },
            { 
              step: "3", title: "Feature Extraction", icon: FiCpu,
              desc: "Advanced libraries (Librosa, OpenSMILE) calculate vocal biomarkers like pitch, MFCCs, energy, and frequency. Deep learning embeddings capture hidden voice architectures."
            },
            { 
              step: "4", title: "AI-Based Prediction", icon: FiActivity,
              desc: "Extracted features are passed into a pre-trained Wav2Vec 2.0 network that matches thousands of statistical patterns to infer specific disease risks."
            },
            { 
              step: "5", title: "Insight Generation", icon: FiFileText,
              desc: "The diagnostic system maps vectors into clear human-readable outputs, estimating the precise condition, probability score, and immediate risk index."
            },
            { 
              step: "6", title: "Continuous Monitoring", icon: FiRefreshCcw,
              desc: "All results are securely mapped over time, permitting the algorithm to detect subtle trend regressions, monitor health shifts, and trigger early medical warnings."
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-16 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
            >
              {/* Icon Marker */}
              <div className="absolute left-0 md:left-1/2 -translate-x-0 md:-translate-x-1/2 w-14 h-14 rounded-full bg-[#050505] border-2 border-[#14B8A6] shadow-[0_0_20px_rgba(20,184,166,0.4)] flex items-center justify-center z-10 text-[#14B8A6] overflow-hidden group hover:scale-110 transition-transform cursor-crosshair">
                <div className="absolute inset-0 bg-[#14B8A6]/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                <item.icon className="text-xl relative z-10" />
              </div>

              {/* Content Card */}
              <div className={`w-full md:w-1/2 pl-24 md:pl-0 ${i % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                <div className="bg-white/[0.02] border border-white/5 hover:border-[#14B8A6]/30 transition-colors p-8 rounded-3xl backdrop-blur-md hover:bg-white/[0.04]">
                  <div className={`text-[#14B8A6] font-mono text-sm tracking-widest mb-3 flex items-center gap-2 ${i % 2 === 0 ? "justify-start" : "md:justify-end justify-start"}`}>
                    PHASE 0{item.step} 
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-400 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* WHY IT MATTERS - OVERSIZED BILLBOARD */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full relative rounded-[3rem] overflow-hidden p-1 bg-gradient-to-br from-[#14B8A6]/40 via-transparent to-[#0B3B3C]/40 mb-32 group"
        >
          <div className="w-full h-full bg-[#050505] rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden backdrop-blur-3xl">
            {/* Inner glowing core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#14B8A6] opacity-0 group-hover:opacity-5 blur-[120px] transition-opacity duration-1000" />
            
            <FiShield className="text-5xl text-[#14B8A6] mx-auto mb-8 drop-shadow-[0_0_15px_rgba(20,184,166,0.6)]" />
            <h2 className="text-4xl md:text-5xl font-black mb-8">Why It Matters</h2>
            <p className="text-xl md:text-3xl text-gray-300 font-light leading-snug max-w-4xl mx-auto mb-10">
              Traditional diagnosis happens <span className="text-white font-medium italic">after</span> symptoms become visible. VitaScan entirely shifts the paradigm to <span className="text-[#14B8A6] font-bold">early detection and active prevention</span>.
            </p>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              By weaponizing the voice as a secure non-invasive biomarker, the system makes predictive healthcare exponentially more accessible, faster, and scalable for massive populations.
            </p>
          </div>
        </motion.div>

        {/* WHAT MAKES IT DIFFERENT */}
        <div className="mb-40">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Makes Us Different</h2>
            <p className="text-gray-400">Pioneering traits of the VitaScan architecture</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FiTarget, text: "Non-invasive & frictionless usage" },
              { icon: FiZap, text: "Real-time AI-powered inferences" },
              { icon: FiLayers, text: "Fusion of statistical & deep learning features" },
              { icon: FiTrendingUp, text: "Longitudinal health tracking & mapping" },
              { icon: FiDatabase, text: "Trained against immense clinical datasets" }
            ].map((prop, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:border-[#14B8A6]/40 hover:bg-[#14B8A6]/5 transition-all group cursor-default"
              >
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-[#14B8A6] shadow-[inset_0_0_15px_rgba(20,184,166,0.1)] group-hover:shadow-[inset_0_0_20px_rgba(20,184,166,0.4)] transition-all">
                  <prop.icon className="text-xl" />
                </div>
                <span className="font-medium text-gray-200 group-hover:text-white transition-colors">
                  {prop.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FUTURE SCOPE / FOOTER CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center pb-20 border-t border-white/10 pt-20"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-600">Future Scope</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed mb-6">
            VitaScan will continually evolve to support more exotic diseases, integrate natively with smart wearables, and arm clinical healthcare professionals with dense, data-driven vectors for critical decision-making.
          </p>
          <p className="text-white text-xl md:text-2xl font-medium max-w-2xl mx-auto italic mb-12">
            The vision is to engineer a smart, infinitely scalable, and preventive global healthcare ecosystem directly powered by artificial intelligence.
          </p>
          <Link href="/login?mode=signup">
            <button className="px-12 py-5 rounded-full bg-[#14B8A6] text-black font-bold uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_50px_rgba(20,184,166,0.6)] hover:scale-105 transition-all outline-none">
              Join the Ecosystem
            </button>
          </Link>
        </motion.div>

      </div>
    </main>
  );
}
