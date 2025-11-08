import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, gateway, type UIMessage } from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: gateway("openai/gpt-5-mini"),
    messages: convertToModelMessages(messages),
    providerOptions: {
      openai: {
        reasoningEffort: 'high',
        reasoningSummary: 'auto',
      },
    },
  });

  result.providerMetadata
    .then((metadata) => {
      console.log(JSON.stringify(metadata, null, 2));
    })
    .catch((error) => {
      console.error("Failed to fetch provider metadata", error);
    });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}
