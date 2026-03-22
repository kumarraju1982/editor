import { randomUUID } from "crypto";

export type BuildingPlanStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

export type BuildingPlan = {
  id: string;
  tenantId: string;
  applicantName: string;
  buildingAddress: string;
  builtUpAreaSqFt: number;
  floors: number;
  status: BuildingPlanStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateBuildingPlanInput = {
  tenantId: string;
  applicantName: string;
  buildingAddress: string;
  builtUpAreaSqFt: number;
  floors: number;
};

const allowedTransitions: Record<BuildingPlanStatus, BuildingPlanStatus[]> = {
  DRAFT: ["SUBMITTED"],
  SUBMITTED: ["APPROVED", "REJECTED"],
  APPROVED: [],
  REJECTED: []
};

export class BuildingPlanService {
  private readonly plans = new Map<string, BuildingPlan>();

  create(input: CreateBuildingPlanInput): BuildingPlan {
    this.validateCreate(input);

    const now = new Date().toISOString();
    const plan: BuildingPlan = {
      id: randomUUID(),
      tenantId: input.tenantId,
      applicantName: input.applicantName.trim(),
      buildingAddress: input.buildingAddress.trim(),
      builtUpAreaSqFt: input.builtUpAreaSqFt,
      floors: input.floors,
      status: "DRAFT",
      createdAt: now,
      updatedAt: now
    };

    this.plans.set(plan.id, plan);
    return plan;
  }

  listByTenant(tenantId: string): BuildingPlan[] {
    if (!tenantId?.trim()) {
      throw new Error("tenantId is required");
    }

    return [...this.plans.values()].filter((plan) => plan.tenantId === tenantId);
  }

  getById(id: string): BuildingPlan {
    const plan = this.plans.get(id);
    if (!plan) {
      throw new Error("building plan not found");
    }
    return plan;
  }

  transitionStatus(id: string, nextStatus: BuildingPlanStatus): BuildingPlan {
    const plan = this.getById(id);
    const allowed = allowedTransitions[plan.status];

    if (!allowed.includes(nextStatus)) {
      throw new Error(`invalid status transition: ${plan.status} -> ${nextStatus}`);
    }

    const updated: BuildingPlan = {
      ...plan,
      status: nextStatus,
      updatedAt: new Date().toISOString()
    };

    this.plans.set(id, updated);
    return updated;
  }

  private validateCreate(input: CreateBuildingPlanInput): void {
    if (!input.tenantId?.trim()) throw new Error("tenantId is required");
    if (!input.applicantName?.trim()) throw new Error("applicantName is required");
    if (!input.buildingAddress?.trim()) throw new Error("buildingAddress is required");
    if (!Number.isFinite(input.builtUpAreaSqFt) || input.builtUpAreaSqFt <= 0) {
      throw new Error("builtUpAreaSqFt must be a positive number");
    }
    if (!Number.isInteger(input.floors) || input.floors <= 0) {
      throw new Error("floors must be a positive integer");
    }
  }
}
