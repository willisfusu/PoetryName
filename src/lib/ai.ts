import type { GeneratedName, NameEvaluation } from "./types";
import { AI_PROXY_URL, AI_MODEL, AI_MAX_TOKENS } from "./config";

export interface EvaluateNamesParams {
  familyName: string;
  names: GeneratedName[];
  apiKey: string;
  signal?: AbortSignal;
}

export function buildPrompt(
  familyName: string,
  names: GeneratedName[],
): string {
  const nameList = names
    .map(
      (n, i) =>
        `${i + 1}. ${n.name} — 出自「${n.sentence}」（${n.book}·${n.title}，${n.dynasty} ${n.author || "佚名"}）`,
    )
    .join("\n");

  return `你是一位精通中国古典文学和姓名学的专家。请评估以下从古诗文中提取的名字。

姓氏：${familyName || "（未指定）"}

请对以下每个名字进行评分（1-10分），并给出简短的中文评语。
评分维度：音韵和谐、文化寓意、字形美感、姓名搭配。

名字列表：
${nameList}

请严格按以下JSON格式返回结果，不要包含其他内容：
[
  {
    "name": "名字",
    "score": 8,
    "phonetic": 8,
    "meaning": 9,
    "aesthetics": 7,
    "compatibility": 8,
    "explanation": "简短评语（2-3句话）"
  }
]`;
}

function clampScore(value: unknown): number {
  const num = typeof value === "number" ? value : Number(value);
  if (isNaN(num)) return 5;
  return Math.max(1, Math.min(10, Math.round(num)));
}

export function parseEvaluationResponse(
  responseText: string,
): NameEvaluation[] | null {
  try {
    // Try to extract JSON from the response (handle markdown code blocks)
    let jsonStr = responseText.trim();
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) return null;

    return parsed.map((item: Record<string, unknown>) => ({
      score: clampScore(item.score),
      phonetic: clampScore(item.phonetic),
      meaning: clampScore(item.meaning),
      aesthetics: clampScore(item.aesthetics),
      compatibility: clampScore(item.compatibility),
      explanation: typeof item.explanation === "string" ? item.explanation : "",
    }));
  } catch {
    return null;
  }
}

export async function evaluateNames(
  params: EvaluateNamesParams,
): Promise<(NameEvaluation | null)[]> {
  const { familyName, names, apiKey, signal } = params;
  const prompt = buildPrompt(familyName, names);

  const response = await fetch(AI_PROXY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS,
      messages: [{ role: "user", content: prompt }],
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`AI evaluation failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = data?.content?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error("Failed to parse AI evaluation response");
  }

  const evaluations = parseEvaluationResponse(text);
  if (!evaluations) {
    throw new Error("Failed to parse AI evaluation response");
  }

  // Match evaluations to input names by the "name" field from the parsed response
  // If we can match by name, do so; otherwise fall back to index alignment
  const parsedRaw = (() => {
    try {
      let jsonStr = text.trim();
      const m = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (m) jsonStr = m[1].trim();
      return JSON.parse(jsonStr) as { name?: string }[];
    } catch {
      return [];
    }
  })();

  return names.map((genName, i) => {
    // Try to find by name match first
    const matchIdx = parsedRaw.findIndex((item) => item.name === genName.name);
    if (matchIdx >= 0 && evaluations[matchIdx]) {
      return evaluations[matchIdx];
    }
    // Fall back to index alignment
    return evaluations[i] ?? null;
  });
}
