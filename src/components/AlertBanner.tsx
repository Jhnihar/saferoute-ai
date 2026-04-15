import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { AnalyzedRoute } from "@/lib/safetyEngine";

interface AlertBannerProps {
  routes: AnalyzedRoute[];
}

export const AlertBanner = ({ routes }: AlertBannerProps) => {
  const hasHighRisk = routes.some((r) => r.safetyScore < 40);
  if (!hasHighRisk) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 bg-danger/10 border border-danger/20 rounded-lg p-4"
    >
      <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0" />
      <p className="text-sm text-danger/90">
        <strong>High-risk zone detected.</strong> Alternative route recommended. Review the safety breakdown below.
      </p>
    </motion.div>
  );
};
