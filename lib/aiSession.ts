import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

const ROOT_DIR = process.cwd();
export const SESSION_DIR = path.join(ROOT_DIR, "sessions");
export const UPLOAD_DIR = path.join(ROOT_DIR, "uploads", "ai");
export const OUTPUT_DIR = path.join(ROOT_DIR, "outputs", "ai");

export type AiQuestion = {
  id: string;
  type: "single_choice" | "text";
  prompt: string;
  options?: string[];
  default?: string;
};

export type AiAnswers = Record<string, string>;

export type AiSessionState =
  | "needs_confirmation"
  | "needs_more_confirmation"
  | "ready";

export interface AiPreview {
  rows: Array<{ Key: string; Value: string; Type: string }>;
  detected: {
    total_candidates: string[];
    date_candidates: string[];
    currency_guess: string;
  };
}

export interface AiSession {
  session_id: string;
  state: AiSessionState;
  created_at: string;
  file_path: string;
  file_name: string;
  preview: AiPreview;
  questions: AiQuestion[];
  pending_questions: AiQuestion[];
  answers: AiAnswers;
  download_url?: string;
  output_path?: string;
  summary?: {
    rows: number;
    template: string;
    currency: string;
    notes: string[];
  };
}

export const initialQuestions: AiQuestion[] = [
  {
    id: "currency",
    type: "single_choice",
    prompt: "Bu faturadaki toplam tutarın para birimi nedir?",
    options: ["TRY", "USD", "EUR"],
    default: "TRY",
  },
  {
    id: "template",
    type: "single_choice",
    prompt: "Bu belgeyi hangi şablonla kaydedelim?",
    options: ["fatura", "urun", "klasik"],
    default: "fatura",
  },
];

export const followUpQuestion: AiQuestion = {
  id: "tax_included",
  type: "single_choice",
  prompt: "Toplam tutar KDV dahil midir?",
  options: ["Evet, dahil", "Hayır, hariç"],
  default: "Evet, dahil",
};

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function ensureStorage() {
  ensureDir(SESSION_DIR);
  ensureDir(UPLOAD_DIR);
  ensureDir(OUTPUT_DIR);
}

function getPreviewFromFile(fileName: string): AiPreview {
  const totalHint = fileName.match(/(\d{1,3}(?:[\.,]\d{3})*(?:[\.,]\d{2}))/)?.[1];
  const currencyGuess = fileName.includes("USD")
    ? "USD"
    : fileName.includes("EUR")
    ? "EUR"
    : "TRY";

  return {
    rows: [
      { Key: "File", Value: fileName, Type: "raw" },
      {
        Key: "Summary",
        Value: totalHint ? `Toplam tahmini ${totalHint}` : "Toplam tespit edilemedi",
        Type: "raw",
      },
    ],
    detected: {
      total_candidates: totalHint ? [totalHint] : [],
      date_candidates: ["14.11.2025"],
      currency_guess: currencyGuess,
    },
  };
}

export function createSessionId() {
  return randomUUID();
}

export function createSession({
  sessionId,
  filePath,
  fileName,
}: {
  sessionId?: string;
  filePath: string;
  fileName: string;
}): AiSession {
  const session_id = sessionId ?? randomUUID();
  const preview = getPreviewFromFile(fileName);
  return {
    session_id,
    state: "needs_confirmation",
    created_at: new Date().toISOString(),
    file_path: filePath,
    file_name: fileName,
    preview,
    questions: initialQuestions,
    pending_questions: initialQuestions,
    answers: {},
  };
}

export function getSessionPath(sessionId: string) {
  return path.join(SESSION_DIR, `${sessionId}.json`);
}

export async function saveSession(session: AiSession) {
  ensureDir(SESSION_DIR);
  await fs.promises.writeFile(
    getSessionPath(session.session_id),
    JSON.stringify(session, null, 2),
    "utf-8"
  );
}

export async function loadSession(sessionId: string): Promise<AiSession | null> {
  try {
    const content = await fs.promises.readFile(getSessionPath(sessionId), "utf-8");
    return JSON.parse(content) as AiSession;
  } catch {
    return null;
  }
}
