
// import { AssistantRuntimeProvider } from "@assistant-ui/react";
// import { useAgUiRuntime } from "@assistant-ui/react-ag-ui";
// import { Thread } from "@/components/assistant-ui/thread";

// export default function Page() {
//   /**
//    * This hook is what makes it the "AG-UI" version.
//    * It tells the frontend to expect AG-UI protocol events 
//    * (like Tool Calls and State Patches) instead of just plain text.
//    */
//   const runtime = useAgUiRuntime({
//     connection: {
//       url: "/api/chat", // Move the URL here
//     },
//   });

//   return (
//     <div className="h-screen flex flex-col">
//       <AssistantRuntimeProvider runtime={runtime}>
//         <Thread />
//       </AssistantRuntimeProvider>
//     </div>
//   );
// }

"use client";

import { useMemo } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useAgUiRuntime } from "@assistant-ui/react-ag-ui";
import { HttpAgent } from "@ag-ui/client"; // Import the Agent class
import { Thread } from "@/components/assistant-ui/thread";

export default function Page() {
  // 1. Create the Agent instance
  // We use useMemo to prevent the agent from being recreated on every render
  const agent = useMemo(() => new HttpAgent({
    url: "/api/chat", // Your backend endpoint goes here
  }), []);

  // 2. Pass the agent instance to the hook
  const runtime = useAgUiRuntime({
    agent: agent,
    showThinking: true, // Optional: shows the agent's reasoning steps
  });

  return (
    <div className="h-screen flex flex-col">
      <AssistantRuntimeProvider runtime={runtime}>
        <Thread />
      </AssistantRuntimeProvider>
    </div>
  );
}