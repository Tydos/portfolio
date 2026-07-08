import { Router, Request, Response } from "express";
import { authLimiter } from "../middleware/rateLimit";
import { requireAdmin, requireAuth, signToken } from "../middleware/auth";
import { config } from "../config";
import { getUserByGithub, upsertUser } from "../services/db";

const router = Router();

router.post(
  "/github/callback",
  authLimiter,
  async (req: Request, res: Response) => {
    const { code } = req.body as { code?: string };
    if (!code) {
      res.status(400).json({ detail: "Missing code" });
      return;
    }

    if (!config.github.clientId || !config.github.clientSecret) {
      res.status(503).json({ detail: "GitHub OAuth not configured" });
      return;
    }

    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: config.github.clientId,
          client_secret: config.github.clientSecret,
          code,
        }),
      },
    );

    const tokenData = (await tokenRes.json()) as {
      access_token?: string;
      error?: string;
    };

    if (!tokenData.access_token) {
      res.status(401).json({ detail: tokenData.error ?? "OAuth failed" });
      return;
    }

    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!userRes.ok) {
      res.status(401).json({ detail: "Failed to fetch GitHub user" });
      return;
    }

    const ghUser = (await userRes.json()) as { login: string };
    const isAdmin = ghUser.login === config.adminGithubUsername;
    const role = isAdmin ? "admin" : "viewer";

    const user = await upsertUser(ghUser.login, role);
    const token = signToken({
      sub: user.id,
      github_username: ghUser.login,
      role: role as "viewer" | "admin",
    });

    res.json({
      token,
      user: {
        id: user.id,
        github_username: ghUser.login,
        role,
      },
    });
  },
);

router.get("/me", requireAuth, async (req: Request, res: Response) => {
  const user = await getUserByGithub(req.user!.github_username);
  if (!user) {
    res.status(404).json({ detail: "User not found" });
    return;
  }
  res.json({
    id: user.id,
    github_username: req.user!.github_username,
    role: user.role,
  });
});

export default router;
