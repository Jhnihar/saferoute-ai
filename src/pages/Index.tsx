import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Cpu } from "lucide-react";
import { analyzeRoutes, type AnalyzedRoute } from "@/lib/safetyEngine";
import { RouteInput } from "@/components/RouteInput";
import { SafetyScoreCard } from "@/components/SafetyScoreCard";
import { RiskBreakdown } from "@/components/RiskBreakdown";
import { RouteComparisonTable } from "@/components/RouteComparisonTable";
import { RouteVisualization } from "@/components/RouteVisualization";
import { AlertBanner } from "@/components/AlertBanner";
import { AnalyzingOverlay } from "@/components/AnalyzingOverlay";

const Index = () => {
  const [from, setFrom] = useState("City Center");
  const [to, setTo] = useState("Tech Park");
  const [hour, setHour] = useState(21); // 9 PM
  const [routes, setRoutes] = useState<AnalyzedRoute[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const runAnalysis = useCallback((showLoading = true) => {
    if (showLoading) {
      setIsAnalyzing(true);
      setRoutes(null);
      setTimeout(() => {
        setRoutes(analyzeRoutes(from, to, hour));
        setIsAnalyzing(false);
      }, 1800);
    } else {
      setRoutes(analyzeRoutes(from, to, hour));
    }
  }, [from, to, hour]);

  // Auto-run on first load
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);
      runAnalysis(true);
    }
  }, [hasInitialized, runAnalysis]);

  // Re-analyze on time change
  useEffect(() => {
    if (hasInitialized && routes) {
      setRoutes(analyzeRoutes(from, to, hour));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour]);

  const recommended = routes?.find((r) => r.isRecommended);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/40 backdrop-blur-md sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-safe/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-safe" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-foreground text-lg leading-none">SafeRoute AI</h1>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Context-Aware Urban Safety Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Cpu className="w-3.5 h-3.5 text-safe animate-pulse-glow" />
            <span className="hidden sm:inline">AI Engine Active</span>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Input */}
        <RouteInput
          from={from}
          to={to}
          hour={hour}
          onFromChange={setFrom}
          onToChange={setTo}
          onHourChange={setHour}
          onAnalyze={() => runAnalysis(true)}
          isAnalyzing={isAnalyzing}
        />

        <AnimatePresence mode="wait">
          {isAnalyzing && (
            <motion.div key="analyzing" exit={{ opacity: 0 }}>
              <AnalyzingOverlay />
            </motion.div>
          )}
        </AnimatePresence>

        {routes && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <AlertBanner routes={routes} />

            <RouteVisualization routes={routes} />

            {/* Route Cards */}
            <div className="space-y-2">
              <h2 className="font-heading font-semibold text-foreground text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-safe" /> Route Analysis Results
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {routes.map((route, i) => (
                  <SafetyScoreCard key={route.id} route={route} index={i} />
                ))}
              </div>
            </div>

            {/* Comparison Table */}
            <RouteComparisonTable routes={routes} />

            {/* Risk Breakdown for recommended */}
            {recommended && (
              <RiskBreakdown risk={recommended.adjustedRisk} label={recommended.name} />
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Index;
