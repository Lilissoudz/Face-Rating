export interface HaircutSuggestion {
  name: string;
  description: string;
  reason: string;
}

export interface AnalysisResult {
  rating: number;
  faceShape: string;
  critique: string[];
  bestFeatures: string[];
  haircutSuggestions: HaircutSuggestion[];
}

export type AppState = 'intro' | 'camera' | 'preview' | 'analyzing' | 'results' | 'error';
