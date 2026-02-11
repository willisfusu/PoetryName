import type { WaitingMessageStage } from "$lib/types";

export function getWaitingMessage(stage: WaitingMessageStage): string {
  if (stage === "long_wait") {
    return "AI 正在细致推敲，请稍候…";
  }

  if (stage === "failure") {
    return "本次生成未成功，可立即重试";
  }

  return "AI 正在起名，请稍候…";
}
