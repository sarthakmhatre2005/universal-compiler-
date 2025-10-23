import { spawn } from "child_process";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { type Language } from "@shared/schema";

const EXECUTION_TIMEOUT = 10000; // 10 seconds
const MAX_OUTPUT_SIZE = 1024 * 1024; // 1MB

interface ExecutorConfig {
  command: string;
  args: string[];
  file?: string;
  compiledFile?: string;
}

export class CodeExecutor {
  private getTempDir(): string {
    return join(tmpdir(), "code-compiler");
  }

  private async ensureTempDir(): Promise<void> {
    try {
      await mkdir(this.getTempDir(), { recursive: true });
    } catch (err) {
      // Directory might already exist
    }
  }

  private getExecutorConfig(
    language: Language,
    filePath: string
  ): ExecutorConfig {
    const fileName = filePath.split("/").pop() || "temp";
    const baseName = fileName.replace(/\.[^/.]+$/, "");

    switch (language) {
      case "python":
        return {
          command: "python3",
          args: [filePath],
          file: filePath,
        };
      case "javascript":
        return {
          command: "node",
          args: [filePath],
          file: filePath,
        };
      case "cpp":
        const outputFile = join(this.getTempDir(), `${baseName}.out`);
        return {
          command: "g++",
          args: [filePath, "-o", outputFile, "-std=c++17"],
          file: filePath,
          compiledFile: outputFile,
        };
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  async execute(
    language: Language,
    code: string,
    stdin: string = "",
    onOutput: (data: string) => void,
    onError: (data: string) => void
  ): Promise<{ success: boolean; executionTime: number; status: string }> {
    await this.ensureTempDir();

    const fileId = randomUUID();
    const extension = this.getFileExtension(language);
    const filePath = join(this.getTempDir(), `${fileId}${extension}`);

    try {
      // Write code to temporary file
      await writeFile(filePath, code, "utf-8");

      const config = this.getExecutorConfig(language, filePath);
      const startTime = Date.now();

      // For C++, compile first
      if (language === "cpp") {
        const compileResult = await this.runProcess(
          config.command,
          config.args,
          "",
          onError
        );

        if (!compileResult.success) {
          return {
            success: false,
            executionTime: Date.now() - startTime,
            status: "error",
          };
        }

        // Run the compiled executable
        if (config.compiledFile) {
          const runResult = await this.runProcess(
            config.compiledFile,
            [],
            stdin,
            onOutput,
            onError
          );

          // Clean up compiled file
          try {
            await unlink(config.compiledFile);
          } catch (err) {
            // Ignore cleanup errors
          }

          return {
            success: runResult.success,
            executionTime: Date.now() - startTime,
            status: runResult.success ? "completed" : "error",
          };
        }
      }

      // For Python and JavaScript, run directly
      const result = await this.runProcess(
        config.command,
        config.args,
        stdin,
        onOutput,
        onError
      );

      return {
        success: result.success,
        executionTime: Date.now() - startTime,
        status: result.success ? "completed" : "error",
      };
    } catch (err: any) {
      onError(`Execution error: ${err.message}`);
      return {
        success: false,
        executionTime: 0,
        status: "error",
      };
    } finally {
      // Clean up source file
      try {
        await unlink(filePath);
      } catch (err) {
        // Ignore cleanup errors
      }
    }
  }

  private runProcess(
    command: string,
    args: string[],
    stdin: string,
    onOutput?: (data: string) => void,
    onError?: (data: string) => void
  ): Promise<{ success: boolean; timedOut: boolean }> {
    return new Promise((resolve) => {
      const process = spawn(command, args, {
        timeout: EXECUTION_TIMEOUT,
      });

      let outputSize = 0;
      let timedOut = false;

      const timeout = setTimeout(() => {
        timedOut = true;
        process.kill();
        onError?.("\nExecution timed out (10s limit)");
      }, EXECUTION_TIMEOUT);

      process.stdout.on("data", (data) => {
        const output = data.toString();
        outputSize += output.length;

        if (outputSize > MAX_OUTPUT_SIZE) {
          process.kill();
          onError?.("\nOutput size limit exceeded (1MB)");
          return;
        }

        onOutput?.(output);
      });

      process.stderr.on("data", (data) => {
        const error = data.toString();
        outputSize += error.length;

        if (outputSize > MAX_OUTPUT_SIZE) {
          process.kill();
          onError?.("\nOutput size limit exceeded (1MB)");
          return;
        }

        onError?.(error);
      });

      // Send stdin if provided
      if (stdin && process.stdin) {
        process.stdin.write(stdin);
        process.stdin.end();
      }

      process.on("close", (code) => {
        clearTimeout(timeout);
        resolve({
          success: code === 0 && !timedOut,
          timedOut,
        });
      });

      process.on("error", (err) => {
        clearTimeout(timeout);
        onError?.(`Process error: ${err.message}`);
        resolve({ success: false, timedOut: false });
      });
    });
  }

  private getFileExtension(language: Language): string {
    switch (language) {
      case "python":
        return ".py";
      case "javascript":
        return ".js";
      case "cpp":
        return ".cpp";
      default:
        return ".txt";
    }
  }
}

export const codeExecutor = new CodeExecutor();
