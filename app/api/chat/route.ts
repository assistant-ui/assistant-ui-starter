// import { v4 as uuidv4 } from 'uuid'; // You may need to: npm install uuid

// export async function POST(req: Request) {
//   const body = await req.json();

//   // The ag-ui-langgraph library requires these exact fields
//   const payload = {
//     messages: body.messages || [],
//     input: body.input || "",
//     threadId: body.threadId || "default",
//     runId: uuidv4(), // MANDATORY: Generate a unique ID for this execution
//     tools: body.tools || [], // MANDATORY: Even if empty
//     state: body.state || {},
//     context: body.context || [],
//     forwardedProps: body.forwardedProps || {},
//   };

//   // Forward the request to your Python backend
//   const response = await fetch("http://192.168.8.11:9017/ag-ui/run", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//       });

//   if (!response.ok) {
//       // Log the detailed error from FastAPI to your terminal
//       const errorText = await response.text();
//       console.error("FastAPI Error Details:", errorText);
//       return new Response("Agent error", { status: response.status });
//     }

//   // Stream the response back to the frontend exactly as it comes from Python
//   return new Response(response.body, {
//     headers: {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//       "Connection": "keep-alive",
//     },
//   });
// }

// app/api/chat/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const threadId = body.threadId || "default-thread";
    const runId = body.runId || `run-${Date.now()}`;

    const payload = {
      input: body.input || body.messages?.[body.messages.length - 1]?.content || "",
      ...body,
      threadId,
      runId
    };

    const response = await fetch("http://192.168.8.11:9017/ag-ui/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    // Pipe the response body directly as a stream
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Content-Encoding": "none",
      },
    });
  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}