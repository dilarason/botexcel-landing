"use client";

type Source = {
  sheet_name?: string;
  cell_range?: string;
  row_count?: number;
  label?: string;
};

type SourceSectionProps = {
  sources?: Source[];
  fileVersionLabel?: string;
};

export function SourceSection({ sources, fileVersionLabel }: SourceSectionProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-200">
      <div className="mb-1 flex items-center gap-2 font-semibold text-slate-100">
        <span>📊</span>
        <span>Kaynak</span>
        {fileVersionLabel && <span className="text-[10px] text-slate-400">{fileVersionLabel}</span>}
      </div>
      <ul className="space-y-1">
        {sources.map((src, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-slate-400">{idx + 1}.</span>
            <div className="space-y-0.5">
              {src.sheet_name && <div className="text-slate-200">Sayfa: {src.sheet_name}</div>}
              {src.cell_range && <div className="text-slate-200">Hücreler: {src.cell_range}</div>}
              {typeof src.row_count === "number" && (
                <div className="text-slate-400">{src.row_count} değer kullanıldı</div>
              )}
              {src.label && <div className="text-slate-300">{src.label}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
