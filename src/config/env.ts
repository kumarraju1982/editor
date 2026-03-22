import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DIGIT_AUTH_MODE: z.enum(["mock", "bearer"]).default("mock"),
  DIGIT_TENANT_ID: z.string().min(1),
  DIGIT_MOCK_TOKEN: z.string().min(1).optional(),
  DIGIT_EGOV_SEARCH_URL: z.string().url(),
  DIGIT_IDGEN_URL: z.string().url(),
  DIGIT_MDMS_URL: z.string().url(),
  DIGIT_FILEREPO_URL: z.string().url(),
  DIGIT_WORKFLOW_URL: z.string().url()
});

export type AppConfig = z.infer<typeof envSchema>;

export function loadConfig(source: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid configuration: ${message}`);
  }

  if (parsed.data.DIGIT_AUTH_MODE === "mock" && !parsed.data.DIGIT_MOCK_TOKEN) {
    throw new Error("Invalid configuration: DIGIT_MOCK_TOKEN is required when DIGIT_AUTH_MODE=mock");
  }

  return parsed.data;
}
