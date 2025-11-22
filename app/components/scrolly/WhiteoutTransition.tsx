"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function WhiteoutTransition({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="whiteout-flash"
          className="fixed inset-0 z-[120] bg-white dark:bg-neutral-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.3,
            times: [0, 0.3, 1],
            ease: "easeInOut",
          }}
        />
      )}
    </AnimatePresence>
  );
}
