import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { loadSession } from "../../../../../lib/aiSession";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: { sessionId: string };
  }
) {
  const sessionId = params.sessionId;
  const session = await loadSession(sessionId);
  if (!session || !session.output_path) {
    return NextResponse.json(
      { ok: false, message: "Çıktı dosyası bulunamadı." },
      { status: 404 }
    );
  }

  const filePath = session.output_path;
  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { ok: false, message: "Dosya halen oluşturulmadı." },
      { status: 404 }
    );
  }

  const fileBuffer = await fs.promises.readFile(filePath);
  const fileName = path.basename(filePath);
  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
