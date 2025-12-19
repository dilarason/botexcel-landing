"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

function getPageProgress(): number {
  const doc = document.documentElement;
  const max = Math.max(1, doc.scrollHeight - window.innerHeight);
  return window.scrollY / max;
}

type BodyLockSnapshot = {
  overflow: string;
  paddingRight: string;
  touchAction: string;
};

function lockBodyScroll(snapshotRef: React.MutableRefObject<BodyLockSnapshot | null>) {
  const body = document.body;
  const docEl = document.documentElement;

  if (!snapshotRef.current) {
    snapshotRef.current = {
      overflow: body.style.overflow || "",
      paddingRight: body.style.paddingRight || "",
      touchAction: body.style.touchAction || "",
    };
  }

  const scrollbarWidth = window.innerWidth - docEl.clientWidth;
  if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

  body.style.overflow = "hidden";
  body.style.touchAction = "none";
}

function unlockBodyScroll(snapshotRef: React.MutableRefObject<BodyLockSnapshot | null>) {
  const body = document.body;
  const snap = snapshotRef.current;
  if (!snap) return;

  body.style.overflow = snap.overflow;
  body.style.paddingRight = snap.paddingRight;
  body.style.touchAction = snap.touchAction;

  snapshotRef.current = null;
}

export default function ClaritySection() {
  const [active, setActive] = useState(false);
  const router = useRouter();

  const threshold = useMemo(() => 0.92, []);
  const bodyLockRef = useRef<BodyLockSnapshot | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (active) return;
      const p = getPageProgress();
      if (p >= threshold) setActive(true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [active, threshold]);

  useEffect(() => {
    if (!active) return;

    lockBodyScroll(bodyLockRef);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      unlockBodyScroll(bodyLockRef);
    };
  }, [active]);

  const handleClose = () => setActive(false);

  const handleCTA = () => {
    unlockBodyScroll(bodyLockRef);
    router.push("/upload");
  };

  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Whiteout (inline) */}
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 z-[89] bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />

          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Kapat"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] cursor-default bg-white/70 backdrop-blur-xl"
          />

          {/* Panel */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[91] flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-md space-y-4 rounded-2xl border border-neutral-700 bg-neutral-900 p-6 text-center text-white shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold">
                  Belgeni Excel&apos;e çevir — 3 ücretsiz dönüşüm seni bekliyor
                </h2>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg px-2 py-1 text-sm text-neutral-300 hover:text-white"
                  aria-label="Kapat"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-neutral-300">
                Karmaşadan düzen yarat. BotExcel dosyanı otomatik ayıklayıp tabloya dönüştürür.
              </p>

              <button
                onClick={handleCTA}
                className="mt-2 w-full rounded-xl bg-emerald-600 py-2.5 font-semibold text-white transition hover:bg-emerald-500"
                data-analytics="clarity_cta_try_own_doc"
              >
                Kendi belgenle dene
              </button>

              <p className="text-[11px] text-neutral-400">ESC ile kapatabilirsin.</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
