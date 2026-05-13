import { streamText, gateway } from "ai";
import { PRONTUARIO_SYSTEM_PROMPT } from "@/lib/ia/prompts";

export async function POST(req: Request) {
  const { relato } = await req.json();

  const result = streamText({
    model: gateway("anthropic/claude-haiku-4.5"),
    system: PRONTUARIO_SYSTEM_PROMPT,
    prompt: `Estruture o seguinte relato de consulta psiquiátrica em formato SOAP:\n\n${relato}`,
    maxOutputTokens: 1500,
  });

  return result.toTextStreamResponse();
}
