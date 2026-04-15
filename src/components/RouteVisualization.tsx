import { motion } from "framer-motion";
import type { AnalyzedRoute } from "@/lib/safetyEngine";

interface RouteVisualizationProps {
  routes: AnalyzedRoute[];
}

export const RouteVisualization = ({ routes }: RouteVisualizationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <h3 className="font-heading font-semibold text-foreground text-sm mb-4">Route Visualization</h3>
      <div className="relative w-full aspect-[2/1] bg-secondary/30 rounded-lg overflow-hidden border border-border/30">
        {/* Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="currentColor" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`v${i}`} x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="currentColor" strokeWidth="0.5" />
          ))}
        </svg>

        <svg className="relative w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {routes.map((route, ri) => {
            const isSafe = route.safetyScore >= 65;
            const isMid = route.safetyScore >= 40 && route.safetyScore < 65;
            const color = isSafe ? "hsl(145, 80%, 42%)" : isMid ? "hsl(38, 92%, 50%)" : "hsl(0, 75%, 55%)";
            const pathD = route.waypoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

            return (
              <motion.path
                key={route.id}
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth={route.isRecommended ? "2.5" : "1.5"}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={route.isRecommended ? 1 : 0.4}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: ri * 0.2, duration: 1, ease: "easeInOut" }}
              />
            );
          })}
        </svg>

        {/* Start / End labels */}
        <div className="absolute left-[8%] bottom-[12%] flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-safe animate-pulse-glow" />
          <span className="text-[10px] font-mono text-safe">START</span>
        </div>
        <div className="absolute right-[6%] top-[12%] flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-danger animate-pulse-glow" />
          <span className="text-[10px] font-mono text-danger">END</span>
        </div>

        {/* Legend */}
        <div className="absolute bottom-2 right-2 flex flex-col gap-1">
          {routes.map((r) => (
            <div key={r.id} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${
                r.safetyScore >= 65 ? "bg-safe" : r.safetyScore >= 40 ? "bg-warning" : "bg-danger"
              }`} />
              <span className="text-[9px] font-mono text-muted-foreground">{r.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
