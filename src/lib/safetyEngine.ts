export interface RouteRisk {
  crime: number;       // 0-100 (0=safe, 100=dangerous)
  lighting: number;    // 0-100 (0=dark, 100=well-lit)
  crowdDensity: number; // 0-100 (0=empty, 100=crowded/safe)
  isolation: number;   // 0-100 (0=connected, 100=isolated)
}

export interface Route {
  id: string;
  name: string;
  description: string;
  distance: string;
  duration: string;
  baseRisk: RouteRisk;
  waypoints: { x: number; y: number }[];
}

export interface AnalyzedRoute extends Route {
  adjustedRisk: RouteRisk;
  safetyScore: number;
  confidence: number;
  isRecommended: boolean;
  explanation: string;
  timeWarning?: string;
}

const ROUTES_DB: Record<string, Route[]> = {
  default: [
    {
      id: "route-a",
      name: "Main Avenue Route",
      description: "Via Main Avenue & Central Boulevard",
      distance: "3.2 km",
      duration: "12 min",
      baseRisk: { crime: 15, lighting: 85, crowdDensity: 75, isolation: 10 },
      waypoints: [
        { x: 10, y: 80 }, { x: 25, y: 65 }, { x: 45, y: 55 },
        { x: 65, y: 45 }, { x: 80, y: 30 }, { x: 90, y: 20 },
      ],
    },
    {
      id: "route-b",
      name: "Park Side Route",
      description: "Through Riverside Park & Oak Street",
      distance: "2.8 km",
      duration: "10 min",
      baseRisk: { crime: 35, lighting: 45, crowdDensity: 30, isolation: 55 },
      waypoints: [
        { x: 10, y: 80 }, { x: 20, y: 70 }, { x: 35, y: 40 },
        { x: 55, y: 30 }, { x: 75, y: 25 }, { x: 90, y: 20 },
      ],
    },
    {
      id: "route-c",
      name: "Industrial Shortcut",
      description: "Via Industrial Lane & Warehouse District",
      distance: "2.4 km",
      duration: "8 min",
      baseRisk: { crime: 55, lighting: 25, crowdDensity: 15, isolation: 75 },
      waypoints: [
        { x: 10, y: 80 }, { x: 30, y: 75 }, { x: 50, y: 50 },
        { x: 70, y: 35 }, { x: 85, y: 22 }, { x: 90, y: 20 },
      ],
    },
  ],
};

function getTimeMultiplier(hour: number): { crimeMultiplier: number; lightingPenalty: number; crowdReduction: number } {
  if (hour >= 6 && hour < 10) return { crimeMultiplier: 0.7, lightingPenalty: 0, crowdReduction: 0 };
  if (hour >= 10 && hour < 17) return { crimeMultiplier: 0.6, lightingPenalty: 0, crowdReduction: 0 };
  if (hour >= 17 && hour < 20) return { crimeMultiplier: 0.85, lightingPenalty: 5, crowdReduction: 10 };
  if (hour >= 20 && hour < 22) return { crimeMultiplier: 1.1, lightingPenalty: 15, crowdReduction: 30 };
  if (hour >= 22 || hour < 1) return { crimeMultiplier: 1.4, lightingPenalty: 30, crowdReduction: 55 };
  return { crimeMultiplier: 1.6, lightingPenalty: 40, crowdReduction: 70 }; // 1-6 AM
}

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

function calculateSafetyScore(risk: RouteRisk): number {
  const weights = { crime: 0.35, lighting: 0.25, crowdDensity: 0.2, isolation: 0.2 };
  const score =
    (100 - risk.crime) * weights.crime +
    risk.lighting * weights.lighting +
    risk.crowdDensity * weights.crowdDensity +
    (100 - risk.isolation) * weights.isolation;
  return Math.round(clamp(score));
}

function generateExplanation(route: AnalyzedRoute, hour: number): string {
  const { adjustedRisk, safetyScore } = route;
  const parts: string[] = [];

  if (adjustedRisk.lighting > 65) parts.push("well-lit streets");
  else if (adjustedRisk.lighting < 35) parts.push("poor lighting conditions");

  if (adjustedRisk.crowdDensity > 60) parts.push("high public activity");
  else if (adjustedRisk.crowdDensity < 25) parts.push("low pedestrian presence");

  if (adjustedRisk.crime < 25) parts.push("low crime probability");
  else if (adjustedRisk.crime > 50) parts.push("elevated crime risk in this area");

  if (adjustedRisk.isolation > 60) parts.push("isolated stretches with limited visibility");
  else if (adjustedRisk.isolation < 20) parts.push("well-connected urban corridors");

  if (safetyScore >= 70) {
    return `This route is recommended due to ${parts.slice(0, 3).join(", ")}.`;
  } else if (safetyScore >= 45) {
    return `This route has moderate safety — ${parts.slice(0, 3).join(", ")}.`;
  }
  return `Caution advised: ${parts.slice(0, 3).join(", ")}.`;
}

function generateTimeWarning(route: Route, hour: number): string | undefined {
  if (hour >= 22 || hour < 6) {
    if (route.baseRisk.isolation > 40 || route.baseRisk.lighting < 50) {
      return "After 10 PM, this route becomes more risky due to reduced crowd presence and lower visibility.";
    }
  }
  if (hour >= 20 && route.baseRisk.crowdDensity < 40) {
    return "Evening hours show decreased pedestrian activity on this route.";
  }
  return undefined;
}

export function analyzeRoutes(from: string, to: string, hour: number): AnalyzedRoute[] {
  const routes = ROUTES_DB.default;
  const timeMod = getTimeMultiplier(hour);

  const analyzed: AnalyzedRoute[] = routes.map((route) => {
    const adjustedRisk: RouteRisk = {
      crime: clamp(route.baseRisk.crime * timeMod.crimeMultiplier),
      lighting: clamp(route.baseRisk.lighting - timeMod.lightingPenalty),
      crowdDensity: clamp(route.baseRisk.crowdDensity - timeMod.crowdReduction),
      isolation: clamp(route.baseRisk.isolation + timeMod.crowdReduction * 0.3),
    };

    const safetyScore = calculateSafetyScore(adjustedRisk);
    const confidence = Math.round(75 + Math.random() * 20);

    return {
      ...route,
      adjustedRisk,
      safetyScore,
      confidence,
      isRecommended: false,
      explanation: "",
    };
  });

  analyzed.sort((a, b) => b.safetyScore - a.safetyScore);
  analyzed[0].isRecommended = true;

  analyzed.forEach((route) => {
    route.explanation = generateExplanation(route, hour);
    route.timeWarning = generateTimeWarning(route, hour);
  });

  return analyzed;
}
