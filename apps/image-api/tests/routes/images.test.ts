import request from "supertest";
import app from "../../src/index";

describe("API routes", () => {
  it("GET /api returns welcome message", async () => {
    const res = await request(app).get("/api");
    expect(res.status).toBe(200);
    expect(res.body.message).toBeDefined();
  });

  it("GET /api/images returns paginated shape or 503 without db", async () => {
    const res = await request(app).get("/api/images?limit=10&offset=0");
    expect([200, 503]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty("data");
      expect(res.body).toHaveProperty("total");
      expect(Array.isArray(res.body.data)).toBe(true);
    }
  }, 10000);

  it("POST /api/images/upload without auth returns 401", async () => {
    const res = await request(app).post("/api/images/upload");
    expect(res.status).toBe(401);
  });

  it("DELETE /api/images/1 without auth returns 401", async () => {
    const res = await request(app).delete("/api/images/1");
    expect(res.status).toBe(401);
  });
});
