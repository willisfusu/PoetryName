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
  "胸鬼懒禽鸟鸡我邪罪凶丑仇鼠蟋蟀淫秽妹狐鸡鸭蝇悔鱼肉苦犬吠窥血丧饥女搔父母昏狗蟊痛死潦哀痒害蛇牲妇狸鹅穴畜烂兽靡爪氓劫鬣螽毛婚姻匪婆羞辱";
