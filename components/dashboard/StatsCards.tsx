"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCard {
  title: string;
  value: number;
  label: string;
  change: number;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  data: { v: number }[];
}

const stats: StatCard[] = [
  {
    title: "Plantão Hospitalar",
    value: 24,
    label: "pacientes internados",
    change: 12,
    color: "#FF6B6B",
    gradientFrom: "#FF6B6B",
    gradientTo: "#FF6B6B20",
    data: [4,7,5,8,6,10,9,12,8,11,9,13].map((v) => ({ v })),
  },
  {
    title: "Ambulatório Online",
    value: 18,
    label: "consultas online",
    change: 8,
    color: "#22C55E",
    gradientFrom: "#22C55E",
    gradientTo: "#22C55E20",
    data: [3,5,4,6,8,7,9,6,8,10,9,12].map((v) => ({ v })),
  },
  {
    title: "Escalas Aplicadas",
    value: 47,
    label: "análises clínicas",
    change: -3,
    color: "#4A6CF7",
    gradientFrom: "#4A6CF7",
    gradientTo: "#4A6CF720",
    data: [8,12,10,15,11,13,16,12,14,18,15,20].map((v) => ({ v })),
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s) => (
        <StatCard key={s.title} stat={s} />
      ))}
    </div>
  );
}

function StatCard({ stat }: { stat: StatCard }) {
  const isPositive = stat.change >= 0;

  return (
    <div className="bg-card rounded-2xl p-5 shadow-[0_4px_20px_rgba(74,108,247,0.08)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(74,108,247,0.13)] transition-all duration-200 border border-border">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {stat.title}
          </p>
          <p className="text-3xl font-bold text-foreground mt-1 font-mono">
            {stat.value}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
        </div>

        {/* Change badge */}
        <span
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold"
          style={{
            color: isPositive ? "#22C55E" : "#EF4444",
            background: isPositive ? "#22C55E15" : "#EF444415",
          }}
        >
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isPositive ? "+" : ""}{stat.change}%
        </span>
      </div>

      {/* Sparkline */}
      <div className="h-14 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stat.data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
            <defs>
              <linearGradient id={`grad-${stat.title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stat.gradientFrom} stopOpacity={0.3} />
                <stop offset="100%" stopColor={stat.gradientTo} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={stat.color}
              strokeWidth={2}
              fill={`url(#grad-${stat.title})`}
              dot={false}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
