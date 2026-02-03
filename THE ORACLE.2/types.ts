export interface DecisionScores {
  feasibility: number;
  risk: number;
  longTermImpact: number;
  opportunityCost: number;
}

export interface DecisionOption {
  title: string;
  description: string;
  shortTermSimulation: string;
  longTermSimulation: string;
  scores: DecisionScores;
}

export interface Recommendation {
  bestOptionTitle: string;
  reasoning: string;
}

export interface OracleAnalysis {
  objective: string;
  identifiedConstraints: string[];
  options: DecisionOption[];
  recommendation: Recommendation;
}

export interface UserInput {
  situation: string;
  financialConstraints: string;
  timeConstraints: string;
  riskTolerance: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}