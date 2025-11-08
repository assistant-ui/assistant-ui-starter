import { openai } from "@ai-sdk/openai";
// import { AnthropicProviderOptions } from "@ai-sdk/anthropic";
import {
  streamText,
  convertToModelMessages,
  // gateway,
  type UIMessage,
} from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-5"),
    messages: convertToModelMessages(messages),
    providerOptions: {
      openai: {
        reasoningEffort: "medium",
        reasoningSummary: "auto",
      },
      // anthropic: {
      //   thinking: { type: 'enabled', budgetTokens: 12000 },
      // } satisfies AnthropicProviderOptions,
    },
  });

  // result.providerMetadata
  //   .then((metadata) => console.log(JSON.stringify(metadata, null, 2)))
  //   .catch((error) => console.error("Failed to fetch", error));

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}
