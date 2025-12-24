"use client";

import React, { useEffect, useState } from "react";
import { useI18n } from "../lib/i18n";

interface TrustMetric {
    key: "sourceCoverage" | "ruleCompliance" | "changeTrail" | "outputQuality";
    value: number;
}

interface TrustScoreCardProps {
    score: number;
    metrics: TrustMetric[];
    onImproveClick?: () => void;
    animated?: boolean;
}

type ScoreColor = "emerald" | "amber" | "rose";

const getScoreColor = (value: number): ScoreColor => {
    if (value >= 80) return "emerald";
    if (value >= 50) return "amber";
    return "rose";
};

const MetricBar: React.FC<{
    label: string;
    description: string;
    value: number;
    delay: number;
    animated: boolean;
}> = ({ label, description, value, delay, animated }) => {
    const [displayValue, setDisplayValue] = useState(animated ? 0 : value);
    const color = getScoreColor(value);

    useEffect(() => {
        if (!animated) return;
        const timeout = setTimeout(() => {
            const duration = 800;
            const startTime = Date.now();
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                setDisplayValue(Math.round(value * eased));
                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }, delay);
        return () => clearTimeout(timeout);
    }, [value, delay, animated]);

    const barColors = {
        emerald: "bg-emerald-500",
        amber: "bg-amber-500",
        rose: "bg-rose-500",
    };

    return (
        <div className="group relative">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-300">{label}</span>
                <span className="text-xs font-mono text-slate-400">{displayValue}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${barColors[color]}`}
                    style={{ width: `${displayValue}%` }}
                />
            </div>
            {/* Tooltip */}
            <div className="absolute left-0 top-full mt-1 z-10 hidden group-hover:block">
                <div className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 shadow-xl max-w-[200px]">
                    {description}
                </div>
            </div>
        </div>
    );
};

export const TrustScoreCard: React.FC<TrustScoreCardProps> = ({
    score,
    metrics,
    onImproveClick,
    animated = true,
}) => {
    const { t } = useI18n();
    const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
    const scoreColor = getScoreColor(score);

    useEffect(() => {
        if (!animated) return;
        const duration = 1200;
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayScore(Math.round(score * eased));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [score, animated]);

    const ringColors = {
        emerald: "stroke-emerald-500",
        amber: "stroke-amber-500",
        rose: "stroke-rose-500",
    };

    const glowColors = {
        emerald: "shadow-emerald-500/20",
        amber: "shadow-amber-500/20",
        rose: "shadow-rose-500/20",
    };

    // SVG circle params
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (displayScore / 100) * circumference;

    const metricLabels: Record<TrustMetric["key"], { label: string; desc: string }> = {
        sourceCoverage: { label: t.trustLayer.sourceCoverage, desc: t.trustLayer.sourceCoverageDesc },
        ruleCompliance: { label: t.trustLayer.ruleCompliance, desc: t.trustLayer.ruleComplianceDesc },
        changeTrail: { label: t.trustLayer.changeTrail, desc: t.trustLayer.changeTrailDesc },
        outputQuality: { label: t.trustLayer.outputQuality, desc: t.trustLayer.outputQualityDesc },
    };

    return (
        <div
            className={`rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm p-5 shadow-lg ${glowColors[scoreColor]}`}
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="text-sm font-semibold text-slate-100">{t.trustLayer.trustScore}</h3>
            </div>

            {/* Score Circle */}
            <div className="flex items-center gap-6 mb-5">
                <div className="relative w-32 h-32 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        {/* Background circle */}
                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="none"
                            strokeWidth="8"
                            className="stroke-slate-800"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="none"
                            strokeWidth="8"
                            strokeLinecap="round"
                            className={`${ringColors[scoreColor]} transition-all duration-500`}
                            style={{
                                strokeDasharray: circumference,
                                strokeDashoffset,
                            }}
                        />
                    </svg>
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white">{displayScore}</span>
                        <span className="text-xs text-slate-400">/100</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">
                    {t.trustLayer.trustScoreDesc}
                </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-3.5">
                {metrics.map((metric, index) => (
                    <MetricBar
                        key={metric.key}
                        label={metricLabels[metric.key].label}
                        description={metricLabels[metric.key].desc}
                        value={metric.value}
                        delay={400 + index * 150}
                        animated={animated}
                    />
                ))}
            </div>

            {/* CTA */}
            {onImproveClick && (
                <button
                    type="button"
                    onClick={onImproveClick}
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20 hover:border-emerald-400"
                >
                    {t.trustLayer.improveScore}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default TrustScoreCard;
