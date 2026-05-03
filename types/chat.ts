export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  ts: Date;
}
