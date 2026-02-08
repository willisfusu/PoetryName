import type { BookConfig } from "./types";

export const DEBUG_MODE = false;
export const DEFAULT_BOOK = "shijing";
export const DEFAULT_FAMILY_NAME = "李";
export const NAME_AMOUNT = 6;

export const BOOKS: BookConfig[] = [
  { value: "shijing", name: "诗经" },
  { value: "chuci", name: "楚辞" },
  { value: "tangshi", name: "唐诗" },
  { value: "songci", name: "宋词" },
  { value: "yuefu", name: "乐府诗集" },
  { value: "gushi", name: "古诗三百首" },
  { value: "cifu", name: "著名辞赋" },
];

export const BAD_CHARS =
  "胸鬼懒禽鸟鸡我罪凶丑仇鼠蟋蟀淫秽狐鸡鸭蝇肉苦犬吠窥血丧饥搔父母昏狗蟊痛死潦哀痒害蛇牲妇狸鹅穴畜烂兽靡爪氓劫鬣螽婚姻匪婆羞辱";

export const AI_PROXY_URL = "https://onedayai.autocode.space/v1/messages";
export const AI_MODEL = "claude-opus-4-5-20251101";
export const AI_MAX_TOKENS = 2048;
export const API_KEY_STORAGE_KEY = "poetryname_api_key";
