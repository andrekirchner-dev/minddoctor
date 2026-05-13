import { streamText, gateway } from "ai";
import { DIAGNOSTICO_SYSTEM_PROMPT } from "@/lib/ia/prompts";

export async function POST(req: Request) {
  const { sintomas, duracao, historia, medicacoes, idade, sexo } = await req.json();

  const prompt = `
Paciente: ${idade ? `${idade} anos` : "idade não informada"}, ${sexo || "sexo não informado"}
Sintomas principais: ${sintomas}
Duração: ${duracao || "não informada"}
História psiquiátrica prévia: ${historia || "não informada"}
Medicações em uso: ${medicacoes || "nenhuma"}

Elabore o raciocínio diagnóstico conforme a estrutura solicitada.
`.trim();

  const result = streamText({
    model: gateway("anthropic/claude-haiku-4.5"),
    system: DIAGNOSTICO_SYSTEM_PROMPT,
    prompt,
    maxOutputTokens: 1200,
  });

  return result.toTextStreamResponse();
}
