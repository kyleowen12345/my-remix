// utils/cookies.server.ts
export function getCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => c.split("="))
  );

  return cookies[name];
}

export function destroyCookie(name: string) {
  return `${name}=; Path=/; HttpOnly; Max-Age=0`;
}
