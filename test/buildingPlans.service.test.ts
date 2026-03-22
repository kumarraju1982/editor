import { BuildingPlanService } from "../src/modules/buildingPlans/service";

describe("BuildingPlanService", () => {
  it("creates and fetches a plan", () => {
    const service = new BuildingPlanService();

    const created = service.create({
      tenantId: "pb.amritsar",
      applicantName: "Asha Singh",
      buildingAddress: "Sector 21",
      builtUpAreaSqFt: 1500,
      floors: 2
    });

    const fetched = service.getById(created.id);
    expect(fetched.id).toBe(created.id);
    expect(fetched.status).toBe("DRAFT");
  });

  it("enforces status transitions", () => {
    const service = new BuildingPlanService();
    const created = service.create({
      tenantId: "pb.amritsar",
      applicantName: "Asha Singh",
      buildingAddress: "Sector 21",
      builtUpAreaSqFt: 1500,
      floors: 2
    });

    expect(() => service.transitionStatus(created.id, "APPROVED")).toThrow(
      "invalid status transition: DRAFT -> APPROVED"
    );

    service.transitionStatus(created.id, "SUBMITTED");
    const approved = service.transitionStatus(created.id, "APPROVED");
    expect(approved.status).toBe("APPROVED");
  });
});
