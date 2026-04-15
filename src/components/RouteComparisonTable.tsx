import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Clock, Route } from "lucide-react";
import type { AnalyzedRoute } from "@/lib/safetyEngine";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";

interface Props {
  routes: AnalyzedRoute[];
}

function scoreColor(value: number, invert = false) {
  const v = invert ? value : 100 - value;
  if (v > 60) return "text-danger";
  if (v > 35) return "text-warning";
  return "text-safe";
}

function barWidth(value: number) {
  return { width: `${Math.round(value)}%` };
}

function MiniBar({ value, invert = false }: { value: number; invert?: boolean }) {
  const effective = invert ? value : 100 - value;
  const bg = effective > 60 ? "bg-danger" : effective > 35 ? "bg-warning" : "bg-safe";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${bg}`} style={barWidth(value)} />
      </div>
      <span className={`font-mono text-xs ${scoreColor(value, invert)}`}>{Math.round(value)}%</span>
    </div>
  );
}

export const RouteComparisonTable = ({ routes }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-5 overflow-x-auto"
  >
    <h3 className="font-heading font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
      <Route className="w-4 h-4 text-safe" /> Side-by-Side Comparison
    </h3>
    <Table>
      <TableHeader>
        <TableRow className="border-border/40">
          <TableHead className="text-muted-foreground text-xs font-mono">Metric</TableHead>
          {routes.map((r) => (
            <TableHead key={r.id} className="text-xs font-mono">
              <span className="flex items-center gap-1.5">
                {r.isRecommended && <CheckCircle className="w-3.5 h-3.5 text-safe" />}
                <span className={r.isRecommended ? "text-safe" : "text-muted-foreground"}>{r.name}</span>
              </span>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="border-border/20">
          <TableCell className="text-xs text-muted-foreground">Safety Score</TableCell>
          {routes.map((r) => (
            <TableCell key={r.id}>
              <span className={`font-mono text-sm font-bold ${r.safetyScore >= 70 ? "text-safe" : r.safetyScore >= 45 ? "text-warning" : "text-danger"}`}>
                {r.safetyScore}%
              </span>
            </TableCell>
          ))}
        </TableRow>
        <TableRow className="border-border/20">
          <TableCell className="text-xs text-muted-foreground">Confidence</TableCell>
          {routes.map((r) => (
            <TableCell key={r.id}><span className="font-mono text-xs text-foreground">{r.confidence}%</span></TableCell>
          ))}
        </TableRow>
        <TableRow className="border-border/20">
          <TableCell className="text-xs text-muted-foreground">Distance</TableCell>
          {routes.map((r) => (
            <TableCell key={r.id}><span className="font-mono text-xs text-foreground">{r.distance}</span></TableCell>
          ))}
        </TableRow>
        <TableRow className="border-border/20">
          <TableCell className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Duration</TableCell>
          {routes.map((r) => (
            <TableCell key={r.id}><span className="font-mono text-xs text-foreground">{r.duration}</span></TableCell>
          ))}
        </TableRow>
        <TableRow className="border-border/20">
          <TableCell className="text-xs text-muted-foreground flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Crime Risk</TableCell>
          {routes.map((r) => (
            <TableCell key={r.id}><MiniBar value={r.adjustedRisk.crime} invert /></TableCell>
          ))}
        </TableRow>
        <TableRow className="border-border/20">
          <TableCell className="text-xs text-muted-foreground">Lighting</TableCell>
          {routes.map((r) => (
            <TableCell key={r.id}><MiniBar value={r.adjustedRisk.lighting} /></TableCell>
          ))}
        </TableRow>
        <TableRow className="border-border/20">
          <TableCell className="text-xs text-muted-foreground">Crowd Density</TableCell>
          {routes.map((r) => (
            <TableCell key={r.id}><MiniBar value={r.adjustedRisk.crowdDensity} /></TableCell>
          ))}
        </TableRow>
        <TableRow className="border-border/20">
          <TableCell className="text-xs text-muted-foreground">Isolation</TableCell>
          {routes.map((r) => (
            <TableCell key={r.id}><MiniBar value={r.adjustedRisk.isolation} invert /></TableCell>
          ))}
        </TableRow>
        <TableRow className="border-border/20">
          <TableCell className="text-xs text-muted-foreground">Warning</TableCell>
          {routes.map((r) => (
            <TableCell key={r.id}>
              <span className="text-[11px] text-warning/80">{r.timeWarning || "—"}</span>
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  </motion.div>
);
