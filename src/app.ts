import express from "express";
import { loadConfig } from "./config/env";
import { buildBuildingPlansRouter } from "./modules/buildingPlans/router";
import { BuildingPlanService } from "./modules/buildingPlans/service";

export function createApp() {
  loadConfig();

  const app = express();
  app.use(express.json());

  const service = new BuildingPlanService();
  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/building-plans", buildBuildingPlansRouter(service));

  return app;
}
