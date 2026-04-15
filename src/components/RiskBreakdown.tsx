import { motion } from "framer-motion";
import { AlertTriangle, Lightbulb, Users, EyeOff } from "lucide-react";
import type { RouteRisk } from "@/lib/safetyEngine";

interface RiskBreakdownProps {
  risk: RouteRisk;
  label: string;
}

const metrics = [
  { key: "crime" as const, label: "Crime Risk", icon: AlertTriangle, invert: true },
  { key: "lighting" as const, label: "Lighting Quality", icon: Lightbulb, invert: false },
  { key: "crowdDensity" as const, label: "Crowd Density", icon: Users, invert: false },
  { key: "isolation" as const, label: "Isolation Risk", icon: EyeOff, invert: true },
];

function getBarColor(value: number, invert: boolean) {
  const effective = invert ? value : 100 - value;
  if (effective > 60) return "bg-danger";
  if (effective > 35) return "bg-warning";
  return "bg-safe";
}

export const RiskBreakdown = ({ risk, label }: RiskBreakdownProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-5"
  >
    <h3 className="font-heading font-semibold text-foreground text-sm mb-4">Risk Breakdown — {label}</h3>
    <div className="space-y-3">
      {metrics.map((m, i) => {
        const value = Math.round(risk[m.key]);
        const Icon = m.icon;
        return (
          <div key={m.key} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5" /> {m.label}
              </span>
              <span className="font-mono text-foreground">{value}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`h-full rounded-full ${getBarColor(value, m.invert)}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  </motion.div>
);
