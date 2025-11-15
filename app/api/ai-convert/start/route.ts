import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  ensureStorage,
  createSession,
  createSessionId,
  saveSession,
  UPLOAD_DIR,
} from "../../../../lib/aiSession";

export async function POST(request: Request) {
  ensureStorage();

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, message: "Lütfen bir dosya yükleyin." },
      { status: 400 }
    );
  }

  const sessionId = createSessionId();
  const fileName = file.name || `document-${sessionId}`;
  const uploadPath = path.join(UPLOAD_DIR, `${sessionId}-${fileName}`);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.promises.writeFile(uploadPath, buffer);

  const session = createSession({
    sessionId,
    filePath: uploadPath,
    fileName,
  });
  await saveSession(session);

  return NextResponse.json({
    ok: true,
    session_id: session.session_id,
    status: session.state,
    preview: session.preview,
    questions: session.pending_questions,
  });
}
