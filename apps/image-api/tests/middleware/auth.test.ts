import jwt from "jsonwebtoken";
import { signToken } from "../../src/middleware/auth";

describe("auth middleware", () => {
  const secret = "test-secret";

  beforeAll(() => {
    process.env.JWT_SECRET = secret;
  });

  it("signs and verifies admin token", () => {
    const token = jwt.sign(
      { sub: 1, github_username: "Tydos", role: "admin" },
      secret,
      { expiresIn: "1h" },
    );
    const payload = jwt.verify(token, secret) as {
      role: string;
      github_username: string;
    };
    expect(payload.role).toBe("admin");
    expect(payload.github_username).toBe("Tydos");
  });

  it("rejects expired token", () => {
    const token = jwt.sign({ sub: 1, role: "admin" }, secret, {
      expiresIn: -1,
    });
    expect(() => jwt.verify(token, secret)).toThrow();
  });
});

describe("signToken", () => {
  it("returns a string token", () => {
    process.env.JWT_SECRET = "dev-secret-change-in-production";
    const token = signToken({
      sub: 1,
      github_username: "Tydos",
      role: "admin",
    });
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });
});
