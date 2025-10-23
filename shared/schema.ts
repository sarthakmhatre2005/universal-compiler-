import { z } from "zod";

export const languageSchema = z.enum(["python", "javascript", "cpp"]);
export type Language = z.infer<typeof languageSchema>;

export const executionModeSchema = z.enum(["run", "compile", "compile-run"]);
export type ExecutionMode = z.infer<typeof executionModeSchema>;

export const executeCodeSchema = z.object({
  language: languageSchema,
  code: z.string(),
  stdin: z.string().optional().default(""),
  mode: executionModeSchema.optional().default("run"),
});

export type ExecuteCodeRequest = z.infer<typeof executeCodeSchema>;

export const executionResultSchema = z.object({
  success: z.boolean(),
  output: z.string(),
  error: z.string().optional(),
  executionTime: z.number().optional(),
  status: z.enum(["completed", "timeout", "error", "running"]),
});

export type ExecutionResult = z.infer<typeof executionResultSchema>;

export const languageInfoSchema = z.object({
  id: languageSchema,
  name: z.string(),
  extension: z.string(),
  monacoLanguage: z.string(),
  icon: z.string(),
  version: z.string(),
  defaultCode: z.string(),
});

export type LanguageInfo = z.infer<typeof languageInfoSchema>;
