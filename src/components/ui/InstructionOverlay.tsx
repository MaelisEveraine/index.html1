"use client";

import { motion } from "framer-motion";

export function InstructionOverlay() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center pb-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="px-6 text-center">
        <p className="text-outline-subtle text-lg font-extrabold tracking-[0.08em] text-white">
          Show your hand
        </p>
        <p className="text-outline-subtle mt-2 text-sm font-semibold text-white/85">
          We’ll ask for camera access next.
        </p>
      </div>
    </motion.div>
  );
}