import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, type UIMessage } from "ai";

const doubao = createOpenAI({
  baseURL: "https://ark.cn-beijing.volces.com/api/v3",
  apiKey: process.env.DOUBAO_API_KEY || "",
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: doubao("doubao-seed-1-6-flash-250828"),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}
