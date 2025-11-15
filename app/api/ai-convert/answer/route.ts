import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  loadSession,
  saveSession,
  followUpQuestion,
  OUTPUT_DIR,
  AiSession,
} from "../../../../lib/aiSession";

type AnswerPayload = {
  session_id?: string;
  answers?: Record<string, string>;
};

function escapeCsv(value: string) {
  const cleaned = value.replace(/"/g, '""');
  return `"${cleaned}"`;
}

function generateCsv(session: AiSession) {
  const currency =
    session.answers.currency ?? session.preview.detected.currency_guess;
  const template = session.answers.template ?? "fatura";
  const taxIncluded = session.answers.tax_included ?? "Evet, dahil";

  const rows = [
    ["Alan", "Değer"],
    ["Dosya", session.file_name],
    ["Şablon", template],
    ["Para Birimi", currency],
    ["KDV Durumu", taxIncluded],
    ["Toplam Tahmini", session.preview.detected.total_candidates[0] ?? "Bilinmiyor"],
  ];

  return rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as AnswerPayload;

  if (!payload.session_id) {
    return NextResponse.json(
      { ok: false, message: "session_id zorunludur." },
      { status: 400 }
    );
  }

  const session = await loadSession(payload.session_id);
  if (!session) {
    return NextResponse.json(
      { ok: false, message: "Geçersiz session_id." },
      { status: 404 }
    );
  }

  const answers = payload.answers ?? {};
  session.answers = { ...session.answers, ...answers };

  if (session.state === "needs_confirmation") {
    session.state = "needs_more_confirmation";
    session.pending_questions = [followUpQuestion];
    await saveSession(session);
    return NextResponse.json({
      ok: true,
      status: session.state,
      questions: session.pending_questions,
    });
  }

  if (session.state === "needs_more_confirmation") {
    session.state = "ready";
    session.pending_questions = [];
    ensureOutputDir();
    const outputPath = path.join(OUTPUT_DIR, `${session.session_id}.csv`);
    const csv = generateCsv(session);
    await fs.promises.writeFile(outputPath, csv, "utf-8");
    session.output_path = outputPath;
    session.download_url = `/api/ai-convert/download/${session.session_id}`;
    session.summary = {
      rows: session.preview.rows.length,
      template: session.answers.template ?? "fatura",
      currency: session.answers.currency ?? session.preview.detected.currency_guess,
      notes: [
        "Sentezlenen satır ve KDV bilgisi eklendi.",
        `KDV ${session.answers.tax_included ?? "Evet, dahil"}.`,
      ],
    };
    await saveSession(session);
    return NextResponse.json({
      ok: true,
      status: session.state,
      download_url: session.download_url,
      summary: session.summary,
    });
  }

  return NextResponse.json({
    ok: true,
    status: session.state,
    message: "Bu oturum zaten tamamlandı.",
    download_url: session.download_url,
  });
}

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}
