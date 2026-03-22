process.env.NODE_ENV = "test";
process.env.PORT = "3000";
process.env.DIGIT_AUTH_MODE = "mock";
process.env.DIGIT_TENANT_ID = "pb.amritsar";
process.env.DIGIT_MOCK_TOKEN = "dev-local-token";
process.env.DIGIT_EGOV_SEARCH_URL = "http://localhost:8080/egov-searcher";
process.env.DIGIT_IDGEN_URL = "http://localhost:8080/idgen-service";
process.env.DIGIT_MDMS_URL = "http://localhost:8080/mdms-v2";
process.env.DIGIT_FILEREPO_URL = "http://localhost:8080/filestore";
process.env.DIGIT_WORKFLOW_URL = "http://localhost:8080/egov-workflow-v2";

import request from "supertest";
import { createApp } from "../src/app";

describe("building plans api", () => {
  it("creates, lists, and transitions a plan", async () => {
    const app = createApp();

    const createRes = await request(app).post("/api/building-plans").send({
      tenantId: "pb.amritsar",
      applicantName: "Asha Singh",
      buildingAddress: "Sector 21",
      builtUpAreaSqFt: 1500,
      floors: 2
    });

    expect(createRes.status).toBe(201);
    expect(createRes.body.status).toBe("DRAFT");

    const listRes = await request(app)
      .get("/api/building-plans")
      .query({ tenantId: "pb.amritsar" });
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(1);

    const planId = createRes.body.id as string;
    const submitRes = await request(app)
      .patch(`/api/building-plans/${planId}/status`)
      .send({ status: "SUBMITTED" });
    expect(submitRes.status).toBe(200);
    expect(submitRes.body.status).toBe("SUBMITTED");
  });

  it("rejects invalid create payload", async () => {
    const app = createApp();
    const res = await request(app).post("/api/building-plans").send({
      tenantId: "",
      applicantName: "",
      buildingAddress: "",
      builtUpAreaSqFt: -1,
      floors: 0
    });

    expect(res.status).toBe(400);
  });
});
