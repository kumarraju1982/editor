import express, { Request, Response } from "express";
import { z } from "zod";
import { BuildingPlanService } from "./service";

const createSchema = z.object({
  tenantId: z.string().min(1),
  applicantName: z.string().min(1),
  buildingAddress: z.string().min(1),
  builtUpAreaSqFt: z.number().positive(),
  floors: z.number().int().positive()
});

const statusSchema = z.object({
  status: z.enum(["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"])
});

export function buildBuildingPlansRouter(service: BuildingPlanService): express.Router {
  const router = express.Router();

  router.post("/", (req: Request, res: Response) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "invalid request" });
    }

    try {
      const result = service.create(parsed.data);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get("/", (req: Request, res: Response) => {
    const tenantId = String(req.query.tenantId ?? "");
    try {
      const results = service.listByTenant(tenantId);
      return res.json(results);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get("/:id", (req: Request, res: Response) => {
    const id = String(req.params.id);
    try {
      const result = service.getById(id);
      return res.json(result);
    } catch {
      return res.status(404).json({ error: "building plan not found" });
    }
  });

  router.patch("/:id/status", (req: Request, res: Response) => {
    const id = String(req.params.id);
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "invalid request" });
    }

    try {
      const result = service.transitionStatus(id, parsed.data.status);
      return res.json(result);
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes("not found")) {
        return res.status(404).json({ error: message });
      }
      return res.status(400).json({ error: message });
    }
  });

  return router;
}
