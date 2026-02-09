import type {
  GenerationRequest,
  GenerationResult,
  GeneratedName,
  NameCandidate,
  PoetrySource,
  ProviderConfig,
} from "./types";
import {
  AI_MAX_TOKENS,
  ANTHROPIC_API_PATH,
  OPENAI_API_PATH,
  NAME_GENERATION_MAX,
  NAME_GENERATION_MIN,
} from "./config";
import { getProviderConfig } from "./ai-config";

interface AIMessageContent {
  text?: string;
}

interface AIResponse {
  content?: AIMessageContent[];
}

interface OpenAIResponse {
  choices?: { message?: { content?: string } }[];
}

interface GenerateNamesParams {
  poetrySource: PoetrySource;
  requestedCount: number;
  excludedNames?: string[];
  signal?: AbortSignal;
}

interface ParsedNameCandidate {
  name?: unknown;
  excerpt?: unknown;
  reason?: unknown;
  sourceReference?: {
    book?: unknown;
    title?: unknown;
    author?: unknown;
    dynasty?: unknown;
  };
}

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function clampRequestedCount(requestedCount: number): number {
  return Math.max(
    NAME_GENERATION_MIN,
    Math.min(NAME_GENERATION_MAX, Math.round(requestedCount)),
  );
}

function extractJsonArray(responseText: string): ParsedNameCandidate[] | null {
  let jsonStr = responseText.trim();
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  }

  const parsed = JSON.parse(jsonStr) as unknown;
  if (!Array.isArray(parsed)) {
    return null;
  }
  return parsed as ParsedNameCandidate[];
}

function mapCandidate(item: ParsedNameCandidate): NameCandidate | null {
  const name = typeof item.name === "string" ? item.name.trim() : "";
  const excerpt = typeof item.excerpt === "string" ? item.excerpt.trim() : "";
  const reason = typeof item.reason === "string" ? item.reason.trim() : "";

  if (!name || !excerpt || !reason) {
    return null;
  }

  return {
    candidateId: createId("cand"),
    name,
    excerpt,
    reason,
    sourceReference: {
      book:
        typeof item.sourceReference?.book === "string"
          ? item.sourceReference.book
          : undefined,
      title:
        typeof item.sourceReference?.title === "string"
          ? item.sourceReference.title
          : undefined,
      author:
        typeof item.sourceReference?.author === "string"
          ? item.sourceReference.author
          : undefined,
      dynasty:
        typeof item.sourceReference?.dynasty === "string"
          ? item.sourceReference.dynasty
          : undefined,
    },
    isValid: true,
  };
}

export function buildGenerationPrompt(
  poetrySource: PoetrySource,
  requestedCount: number,
  excludedNames: string[] = [],
): string {
  const excludedLine =
    excludedNames.length > 0
      ? `\n请尽量避免重复以下名字：${excludedNames.join("、")}`
      : "";

  return `你是一位精通中国古典文学与姓名美学的专家。请基于下面提供的诗文内容，生成 ${requestedCount} 个中文名字候选。

来源类型：${poetrySource.sourceType}
来源书目：${poetrySource.book || "未指定"}
诗文内容：
${poetrySource.poetryText}
${excludedLine}

要求：
1. 每个候选名字应简洁、适合起名。
2. 每个候选都必须提供对应诗句摘录（excerpt）。
3. 每个候选都必须提供简要理由（reason），说明名字与诗文关系。
4. 候选之间尽量避免重复。

请严格返回 JSON 数组，不要输出任何额外文本，格式如下：
[
  {
    "name": "清和",
    "excerpt": "诗句摘录",
    "reason": "简要解释",
    "sourceReference": {
      "book": "诗经",
      "title": "关雎",
      "author": "佚名",
      "dynasty": "先秦"
    }
  }
]`;
}

export function parseGenerationResponse(responseText: string): NameCandidate[] | null {
  try {
    const parsed = extractJsonArray(responseText);
    if (!parsed) {
      return null;
    }

    return parsed
      .map(mapCandidate)
      .filter((candidate): candidate is NameCandidate => candidate !== null);
  } catch {
    return null;
  }
}

function buildAnthropicHeaders(config: ProviderConfig): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-API-Key": config.apiKey,
  };
  if (config.providerType === "anthropic") {
    headers["anthropic-version"] = "2023-06-01";
  }
  return headers;
}

function buildOpenAIHeaders(config: ProviderConfig): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config.apiKey}`,
  };
}

function parseAnthropicResponse(data: unknown): string {
  const resp = data as AIResponse;
  const text = resp?.content?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error("Failed to parse AI generation response");
  }
  return text;
}

function parseOpenAIResponse(data: unknown): string {
  const resp = data as OpenAIResponse;
  const text = resp?.choices?.[0]?.message?.content;
  if (typeof text !== "string") {
    throw new Error("Failed to parse AI generation response");
  }
  return text;
}

async function requestAIContent(
  prompt: string,
  config: ProviderConfig,
  signal?: AbortSignal,
): Promise<string> {
  const isOpenAI = config.requestFormat === "openai";

  const headers = isOpenAI
    ? buildOpenAIHeaders(config)
    : buildAnthropicHeaders(config);

  const body = JSON.stringify({
    model: config.model,
    max_tokens: AI_MAX_TOKENS,
    messages: [{ role: "user", content: prompt }],
  });

  const base = config.baseUrl.replace(/\/+$/, "");
  const path = isOpenAI ? OPENAI_API_PATH : ANTHROPIC_API_PATH;
  const url = `${base}${path}`;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body,
    signal,
  });

  if (!response.ok) {
    throw new Error(`AI generation failed with status ${response.status}`);
  }

  const data = await response.json();

  return isOpenAI ? parseOpenAIResponse(data) : parseAnthropicResponse(data);
}

export async function generateNameCandidates(
  params: GenerateNamesParams,
): Promise<GenerationResult> {
  const {
    poetrySource,
    requestedCount,
    excludedNames = [],
    signal,
  } = params;

  const config = getProviderConfig();
  const clampedCount = clampRequestedCount(requestedCount);
  const requestId = createId("req");

  const requestPayload: GenerationRequest = {
    requestId,
    poetrySource,
    requestedCount: clampedCount,
    excludedNames,
    createdAt: new Date().toISOString(),
  };

  const prompt = buildGenerationPrompt(
    requestPayload.poetrySource,
    requestPayload.requestedCount,
    requestPayload.excludedNames,
  );

  const text = await requestAIContent(prompt, config, signal);
  const candidates = parseGenerationResponse(text);

  if (!candidates || candidates.length === 0) {
    throw new Error("Failed to parse AI generation response");
  }

  return {
    generationId: createId("gen"),
    requestId,
    candidates,
    status: "completed",
    generatedAt: new Date().toISOString(),
  };
}

export function toPoetrySourceFromGeneratedName(name: GeneratedName): PoetrySource {
  return {
    sourceType: "builtin",
    sourceId: `${name.book}-${name.title}`,
    book: name.book,
    poetryText: name.content,
    title: name.title,
    author: name.author,
    dynasty: name.dynasty,
  };
}
