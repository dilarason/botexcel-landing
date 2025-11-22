"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import { useRouter } from "next/navigation";
import WhiteoutTransition from "./WhiteoutTransition";

export default function ClaritySection() {
  const [active, setActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const progress =
        window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      if (progress > 0.92 && !active) {
        setActive(true);
        try {
          const win = window as unknown as { lenis?: Lenis };
          const lenis = win.lenis;
          if (lenis) lenis.stop();
        } catch {
          /* ignore */
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [active]);

  const handleCTA = () => {
    try {
      const win = window as unknown as { lenis?: Lenis };
      const lenis = win.lenis;
      if (lenis) lenis.start();
    } catch {
      /* ignore */
    }
    router.push("/upload");
  };

  return (
    <AnimatePresence>
      {active && (
        <>
          <WhiteoutTransition active={active} />
          {/* Arka Plan Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/70 backdrop-blur-xl z-[90]"
          />

          {/* CTA Paneli */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[91] flex items-center justify-center"
          >
            <div
              className="
              w-[90%] max-w-md rounded-2xl
              bg-neutral-900 text-white shadow-2xl
              border border-neutral-700 p-6 space-y-4 text-center
            "
            >
              <h2 className="text-xl font-semibold">
                Belgeni Excel&apos;e çevir — 3 ücretsiz dönüşüm seni bekliyor
              </h2>

              <p className="text-neutral-300 text-sm">
                Karmaşadan düzen yarat. BotExcel dosyanı otomatik ayıklayıp tabloya dönüştürür.
              </p>

              <button
                onClick={handleCTA}
                className="mt-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500
                  transition py-2.5 font-semibold text-white"
              >
                Kendi belgenle dene
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
