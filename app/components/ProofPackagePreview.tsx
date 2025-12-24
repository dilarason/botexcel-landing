"use client";

import React from "react";
import { useI18n } from "../lib/i18n";

interface ProofPackagePreviewProps {
    fileName?: string;
    onDownload?: () => void;
    timestamp?: string;
}

interface FileItem {
    name: string;
    translationKey: "proofPdf" | "proofAudit" | "proofSources" | "proofWorkbook";
    icon: "pdf" | "json" | "folder" | "excel";
    size?: string;
}

const fileItems: FileItem[] = [
    { name: "proof.pdf", translationKey: "proofPdf", icon: "pdf", size: "~120 KB" },
    { name: "audit.ndjson", translationKey: "proofAudit", icon: "json", size: "~8 KB" },
    { name: "sources/", translationKey: "proofSources", icon: "folder" },
    { name: "workbook.xlsx", translationKey: "proofWorkbook", icon: "excel", size: "~45 KB" },
];

const FileIcon: React.FC<{ type: FileItem["icon"] }> = ({ type }) => {
    const iconClasses = "w-4 h-4 flex-shrink-0";

    switch (type) {
        case "pdf":
            return (
                <svg className={`${iconClasses} text-rose-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            );
        case "json":
            return (
                <svg className={`${iconClasses} text-amber-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            );
        case "folder":
            return (
                <svg className={`${iconClasses} text-blue-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
            );
        case "excel":
            return (
                <svg className={`${iconClasses} text-emerald-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            );
    }
};

export const ProofPackagePreview: React.FC<ProofPackagePreviewProps> = ({
    fileName,
    onDownload,
    timestamp,
}) => {
    const { t } = useI18n();

    const displayFileName = fileName || `proof_${timestamp || new Date().toISOString().split("T")[0]}.zip`;

    const handleDownload = () => {
        if (onDownload) {
            onDownload();
            return;
        }

        // Mock download - create a simple text file for demo
        const mockContent = JSON.stringify({
            proof_package: "BotExcel Demo",
            timestamp: new Date().toISOString(),
            note: "This is a demo proof package. In production, this ZIP would contain proof.pdf, audit.ndjson, sources/, and workbook.xlsx",
        }, null, 2);



        const blob = new Blob([mockContent], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = displayFileName.replace(".zip", "-demo.json");
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm p-5 shadow-lg">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="text-sm font-semibold text-slate-100">{t.trustLayer.proofPackage}</h3>
            </div>

            {/* File name */}
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-mono text-slate-300 truncate">{displayFileName}</span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                {t.trustLayer.proofPackageDesc}
            </p>

            {/* File tree */}
            <div className="space-y-2 mb-5">
                {fileItems.map((item, index) => {
                    const isLast = index === fileItems.length - 1;
                    const prefix = isLast ? "└──" : "├──";

                    return (
                        <div key={item.name} className="flex items-center gap-2 text-xs">
                            <span className="font-mono text-slate-600 w-8">{prefix}</span>
                            <FileIcon type={item.icon} />
                            <span className="font-mono text-slate-200">{item.name}</span>
                            <span className="text-slate-500 ml-auto">
                                {t.trustLayer[item.translationKey]}
                            </span>
                            {item.size && (
                                <span className="text-slate-600 font-mono text-[10px]">{item.size}</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Download button */}
            <button
                type="button"
                onClick={handleDownload}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-500/50 px-4 py-2.5 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500/30 hover:border-indigo-400"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {t.trustLayer.downloadProof}
            </button>
        </div>
    );
};

export default ProofPackagePreview;
