import { GITHUB_CLIENT_ID, IMAGE_API_URL } from "../constants/config";

const TOKEN_KEY = "image_hosting_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getGithubAuthUrl(redirectUri: string): string {
  if (!GITHUB_CLIENT_ID) throw new Error("VITE_GITHUB_CLIENT_ID not set");
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: "read:user",
  });
  return `https://github.com/login/oauth/authorize?${params}`;
}

export async function exchangeCodeForToken(
  code: string,
): Promise<{ token: string; role: string; github_username: string }> {
  const res = await fetch(`${IMAGE_API_URL}/api/auth/github/callback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? "Auth failed");
  }
  const data = await res.json();
  setToken(data.token);
  return {
    token: data.token,
    role: data.user.role,
    github_username: data.user.github_username,
  };
}

export async function fetchCurrentUser(): Promise<{
  role: string;
  github_username: string;
} | null> {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${IMAGE_API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    clearToken();
    return null;
  }
  return res.json();
}

export function signOut(): void {
  clearToken();
}
