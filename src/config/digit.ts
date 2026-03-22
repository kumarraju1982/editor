import { randomUUID } from "crypto";
import { AppConfig } from "./env";

export type DigitServiceUrls = {
  egovSearch: string;
  idgen: string;
  mdms: string;
  filestore: string;
  workflow: string;
};

export function buildDigitServiceUrls(config: AppConfig): DigitServiceUrls {
  return {
    egovSearch: config.DIGIT_EGOV_SEARCH_URL,
    idgen: config.DIGIT_IDGEN_URL,
    mdms: config.DIGIT_MDMS_URL,
    filestore: config.DIGIT_FILEREPO_URL,
    workflow: config.DIGIT_WORKFLOW_URL
  };
}

export function buildDigitHeaders(config: AppConfig, correlationId = randomUUID()): Record<string, string> {
  const headers: Record<string, string> = {
    "x-correlation-id": correlationId
  };

  if (config.DIGIT_AUTH_MODE === "mock") {
    headers.Authorization = `Bearer ${config.DIGIT_MOCK_TOKEN ?? ""}`;
  }

  return headers;
}
