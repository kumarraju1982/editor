# PROJECT AGENT INSTRUCTIONS

## Mode: DIGIT_STRICT (Default)

These defaults are mandatory for this repository unless explicitly overridden in writing.

1. Configuration
- Load all runtime settings from environment variables.
- Validate configuration at startup and fail fast on invalid or missing values.
- Never hardcode DIGIT service base URLs, tenant IDs, or auth tokens.

2. DIGIT Integration
- Use explicit service-wise URLs (`DIGIT_EGOV_SEARCH_URL`, `DIGIT_IDGEN_URL`, etc.).
- Pass tenant context on every business operation.
- Include a request correlation id (`x-correlation-id`) on outgoing calls.
- Keep integration contracts typed and validated.

3. Error Handling
- Convert integration errors to stable API error responses.
- Do not leak stack traces or raw downstream payloads to API clients.

4. Security
- Do not commit secrets.
- Use local mock token defaults only for development.
- Require auth mode selection via env (`DIGIT_AUTH_MODE=mock|bearer`).

5. Testing
- Every module must include unit tests and API-level integration tests.
- Include both success and failure-path coverage for validation and status transitions.

6. Local Run Contract
- `npm test` must pass before reporting completion.
- `npm run dev` must start without manual edits when using `.env` derived from `.env.example`.
