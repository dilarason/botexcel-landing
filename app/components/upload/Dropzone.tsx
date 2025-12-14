'use client';

import { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropzoneProps {
    onFileSelect: (file: File | null) => void;
    loading?: boolean;
}

export function Dropzone({ onFileSelect, loading = false }: DropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragIn = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    }, []);

    const handleDragOut = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            setSelectedFile(file);
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const clearFile = useCallback(() => {
        setSelectedFile(null);
        onFileSelect(null);
    }, [onFileSelect]);

    return (
        <div
            className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${isDragging
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-700 bg-slate-900/40'
                } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            aria-busy={loading}
        >
            <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileInput}
                accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx,.docx"
                disabled={loading}
            />

            <AnimatePresence mode="wait">
                {selectedFile ? (
                    <motion.div
                        key="selected"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <Upload className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-200">{selectedFile.name}</p>
                                <p className="text-sm text-slate-400">
                                    {(selectedFile.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={clearFile}
                            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                            type="button"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </motion.div>
                ) : (
                    <motion.label
                        key="empty"
                        htmlFor="file-upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-4 cursor-pointer"
                    >
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                            <Upload className="w-8 h-8 text-slate-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-medium text-slate-200">
                                Dosyayı sürükleyin veya tıklayın
                            </p>
                            <p className="text-sm text-slate-400 mt-1">
                                PDF, görüntü, Excel, Word destekleniyor
                            </p>
                        </div>
                    </motion.label>
                )}
            </AnimatePresence>
        </div>
    );
}
