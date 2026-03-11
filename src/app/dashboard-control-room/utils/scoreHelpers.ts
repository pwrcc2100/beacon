/**
 * Score and band classification helpers for Control Room dashboard
 */

export type RiskStatus = 'LOW' | 'WITHIN TOLERANCE' | 'EMERGING' | 'ELEVATED';

export const scoreToGradient = (score: number): string => {
  if (score >= 80) return "from-[#2d6785] to-[#3d8a9e]";
  if (score >= 70) return "from-[#b8860b] to-[#d4a84b]";
  if (score >= 60) return "from-[#d97036] to-[#e8904d]";
  return "from-[#8b3a3a] to-[#a64b4b]";
};

export const scoreToBandLabel = (score: number): RiskStatus => {
  if (score >= 80) return "LOW";
  if (score >= 70) return "WITHIN TOLERANCE";
  if (score >= 60) return "EMERGING";
  return "ELEVATED";
};

export const scoreToBandKey = (score: number): 'low' | 'tolerance' | 'emerging' | 'elevated' => {
  if (score >= 80) return 'low';
  if (score >= 70) return 'tolerance';
  if (score >= 60) return 'emerging';
  return 'elevated';
};

export const scoreToHex = (score: number): string => {
  if (score >= 80) return "#2d6785";
  if (score >= 70) return "#b8860b";
  if (score >= 60) return "#d97036";
  return "#8b3a3a";
};

export const scoreToRGB = (score: number): { r: number; g: number; b: number } => {
  const hex = scoreToHex(score);
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};
