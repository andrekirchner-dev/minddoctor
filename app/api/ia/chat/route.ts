import { streamText, convertToModelMessages, gateway } from "ai";
import { CHAT_SYSTEM_PROMPT } from "@/lib/ia/prompts";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: gateway("anthropic/claude-haiku-4.5"),
    system: CHAT_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 1500,
  });

  return result.toUIMessageStreamResponse();
}
