import { motion } from "framer-motion";
import { Shield, Scan } from "lucide-react";

export const AnalyzingOverlay = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center gap-6 py-20"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="relative"
    >
      <Shield className="w-16 h-16 text-safe" />
      <motion.div
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Scan className="w-10 h-10 text-safe/60" />
      </motion.div>
    </motion.div>
    <div className="text-center space-y-2">
      <p className="text-lg font-heading font-semibold text-foreground">Analyzing Safety…</p>
      <p className="text-sm text-muted-foreground font-mono">Evaluating crime data • lighting • crowd density • isolation</p>
    </div>
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-safe"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  </motion.div>
);
