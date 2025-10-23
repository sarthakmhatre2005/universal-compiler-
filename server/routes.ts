import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { executeCodeSchema, type ExecuteCodeRequest, type LanguageInfo } from "@shared/schema";
import { codeExecutor } from "./executor";

const LANGUAGES: LanguageInfo[] = [
  {
    id: "python",
    name: "Python",
    extension: ".py",
    monacoLanguage: "python",
    icon: "python",
    version: "3.11",
    defaultCode: `# Python Code
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,
  },
  {
    id: "javascript",
    name: "JavaScript",
    extension: ".js",
    monacoLanguage: "javascript",
    icon: "javascript",
    version: "Node 20",
    defaultCode: `// JavaScript Code
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
  },
  {
    id: "cpp",
    name: "C++",
    extension: ".cpp",
    monacoLanguage: "cpp",
    icon: "cpp",
    version: "GCC 11",
    defaultCode: `// C++ Code
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  },
];

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // API endpoint for language information
  app.get("/api/languages", (req, res) => {
    res.json(LANGUAGES);
  });

  // WebSocket server for real-time code execution
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", async (message: string) => {
      try {
        const data = JSON.parse(message.toString()) as ExecuteCodeRequest;
        
        // Validate request
        const validationResult = executeCodeSchema.safeParse(data);
        if (!validationResult.success) {
          ws.send(
            JSON.stringify({
              type: "result",
              status: "error",
              error: "Invalid request format",
            })
          );
          ws.close();
          return;
        }

        const { language, code, stdin } = validationResult.data;

        // Send output chunks in real-time
        const onOutput = (output: string) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "output",
                content: output,
              })
            );
          }
        };

        const onError = (error: string) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "output",
                content: error,
              })
            );
          }
        };

        // Execute code
        const result = await codeExecutor.execute(
          language,
          code,
          stdin,
          onOutput,
          onError
        );

        // Send final result
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: "result",
              status: result.status,
              executionTime: result.executionTime,
              success: result.success,
            })
          );
          ws.close();
        }
      } catch (err: any) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: "result",
              status: "error",
              error: err.message || "Execution failed",
            })
          );
          ws.close();
        }
      }
    });

    ws.on("error", (err) => {
      console.error("WebSocket error:", err);
    });
  });

  return httpServer;
}
