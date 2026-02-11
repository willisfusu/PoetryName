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

export type PoetrySourceType = "builtin" | "custom_text";

export interface PoetrySource {
  sourceType: PoetrySourceType;
  sourceId?: string;
  book?: string;
  poetryText: string;
  title?: string;
  author?: string;
  dynasty?: string;
}

export interface GenerationRequest {
  requestId: string;
  poetrySource: PoetrySource;
  requestedCount: number;
  excludedNames: string[];
  createdAt: string;
}

export interface SourceReference {
  book?: string;
  title?: string;
  author?: string;
  dynasty?: string;
}

export interface NameCandidate {
  candidateId: string;
  name: string;
  excerpt: string;
  reason: string;
  sourceReference?: SourceReference;
  isValid: boolean;
}

export type GenerationStatus = "idle" | "generating" | "completed" | "failed";

export type WaitingFeedbackMode =
  | "card_wash"
  | "reduced_motion_fallback"
  | "hidden";

export type WaitingMessageStage = "initial" | "long_wait" | "failure";

export interface GenerationResult {
  generationId: string;
  requestId: string;
  candidates: NameCandidate[];
  status: "completed" | "failed";
  errorCode?: string;
  errorMessage?: string;
  generatedAt: string;
}

export interface CreateSelectionRequest {
  generationId: string;
  candidateId: string;
}

export interface SelectedName extends CreateSelectionRequest {
  selectionId: string;
  selectedAt: string;
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

export type ProviderType = "default" | "anthropic" | "openai" | "custom";

export type RequestFormat = "anthropic" | "openai";

export interface ProviderPreset {
  id: ProviderType;
  name: string;
  baseUrl: string;
  defaultModel: string;
  requestFormat: RequestFormat;
}

export interface ProviderConfig {
  providerType: ProviderType;
  baseUrl: string;
  model: string;
  apiKey: string;
  requestFormat: RequestFormat;
}
