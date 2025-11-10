"use client";

import { useEffect } from "react";

import BotExcelScrollDemo from "../BotExcelScrollDemo";
import { persistSource, readSourceFromUrl } from "../lib/source";

export default function LandingPage() {
  useEffect(() => {
    const src = readSourceFromUrl();
    if (src) {
      persistSource(src);
    }
  }, []);

  return <BotExcelScrollDemo />;
}
