import { MapPin, Clock, Search } from "lucide-react";
import { motion } from "framer-motion";

interface RouteInputProps {
  from: string;
  to: string;
  hour: number;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  onHourChange: (v: number) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 || 12;
  const ampm = i < 12 ? "AM" : "PM";
  return { value: i, label: `${h}:00 ${ampm}` };
});

export const RouteInput = ({ from, to, hour, onFromChange, onToChange, onHourChange, onAnalyze, isAnalyzing }: RouteInputProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-6 space-y-4"
  >
    <h2 className="font-heading font-semibold text-foreground flex items-center gap-2">
      <MapPin className="w-4 h-4 text-safe" />
      Route Configuration
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">From</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-safe/60" />
          <input
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            className="w-full bg-secondary/60 border border-border/60 rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-safe/50 transition-all"
            placeholder="Starting point"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">To</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-danger/60" />
          <input
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            className="w-full bg-secondary/60 border border-border/60 rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-safe/50 transition-all"
            placeholder="Destination"
          />
        </div>
      </div>
    </div>
    <div className="space-y-1.5">
      <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider flex items-center gap-1">
        <Clock className="w-3 h-3" /> Travel Time
      </label>
      <select
        value={hour}
        onChange={(e) => onHourChange(Number(e.target.value))}
        className="w-full bg-secondary/60 border border-border/60 rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-safe/50 transition-all appearance-none cursor-pointer"
      >
        {timeOptions.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>
    </div>
    <button
      onClick={onAnalyze}
      disabled={isAnalyzing || !from || !to}
      className="w-full bg-safe text-safe-foreground font-heading font-semibold py-3 rounded-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
    >
      <Search className="w-4 h-4" />
      {isAnalyzing ? "Analyzing…" : "Analyze Route"}
    </button>
  </motion.div>
);
