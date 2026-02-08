export interface PoemEntry {
  author: string;
  dynasty: string;
  content: string;
  book: string;
  title: string;
}

export interface BookConfig {
  value: string;
  name: string;
}

export interface GeneratedName {
  name: string;
  sentence: string;
  content: string;
  title: string;
  author: string;
  book: string;
  dynasty: string;
}

export interface NameEvaluation {
  score: number;
  explanation: string;
  phonetic: number;
  meaning: number;
  aesthetics: number;
  compatibility: number;
}

export interface EvaluatedName {
  generated: GeneratedName;
  evaluation: NameEvaluation | null;
}

export type EvaluationState = "idle" | "evaluating" | "completed" | "failed";
