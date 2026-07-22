"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BackgroundEffects() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#050505]">
      {/* Nebula Blurs (Static for Performance) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#E64A19] opacity-10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#A9C4EB] opacity-5 blur-[120px] rounded-full" />
      
      {/* Magma Orbs (Static for Performance) */}
      <div className="absolute top-[20%] left-[30%] w-64 h-64 bg-orange-600 opacity-10 blur-[80px] rounded-full" />
      <div className="absolute top-[60%] right-[20%] w-96 h-96 bg-red-700 opacity-10 blur-[100px] rounded-full" />

      {/* Lightweight CSS Particles instead of heavy Framer Motion elements */}
      {mounted && (
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-screen" />
      )}
    </div>
  );
}
