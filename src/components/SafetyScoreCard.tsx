import { motion } from "framer-motion";
import { Shield, TrendingUp, Star } from "lucide-react";
import type { AnalyzedRoute } from "@/lib/safetyEngine";

interface SafetyScoreCardProps {
  route: AnalyzedRoute;
  index: number;
}

export const SafetyScoreCard = ({ route, index }: SafetyScoreCardProps) => {
  const isSafe = route.safetyScore >= 65;
  const isMid = route.safetyScore >= 40 && route.safetyScore < 65;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      className={`glass-card p-5 relative overflow-hidden ${
        route.isRecommended ? "glow-safe ring-1 ring-safe/30" : ""
      }`}
    >
      {route.isRecommended && (
        <div className="absolute top-0 right-0 bg-safe text-safe-foreground text-[10px] font-mono font-bold px-3 py-1 rounded-bl-lg">
          <Star className="w-3 h-3 inline mr-1" />RECOMMENDED
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading font-semibold text-foreground">{route.name}</h3>
          <p className="text-xs text-muted-foreground">{route.description}</p>
          <p className="text-xs text-muted-foreground mt-1 font-mono">{route.distance} • {route.duration}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
            className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
              isSafe ? "border-safe" : isMid ? "border-warning" : "border-danger"
            }`}
          >
            <span className={`text-xl font-heading font-bold ${
              isSafe ? "text-safe neon-text-safe" : isMid ? "text-warning" : "text-danger neon-text-danger"
            }`}>
              {route.safetyScore}%
            </span>
          </motion.div>
          <p className="text-[10px] text-muted-foreground mt-1 font-mono">SAFETY</p>
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-mono text-foreground">{route.confidence}%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${route.confidence}%` }}
              transition={{ delay: index * 0.15 + 0.4, duration: 0.8 }}
              className="h-full bg-safe/70 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 bg-secondary/40 rounded-lg p-3">
        <TrendingUp className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSafe ? "text-safe" : isMid ? "text-warning" : "text-danger"}`} />
        <p className="text-xs text-muted-foreground leading-relaxed">{route.explanation}</p>
      </div>

      {route.timeWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 flex items-start gap-2 bg-warning/10 border border-warning/20 rounded-lg p-3"
        >
          <Shield className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
          <p className="text-xs text-warning/90 leading-relaxed">{route.timeWarning}</p>
        </motion.div>
      )}
    </motion.div>
  );
};
