import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

/** Extend Express Request so downstream handlers get req.user */
export interface AuthedRequest extends Request {
  user?: { sub: string; [k: string]: any };
}

/** Pull access token from Authorization header or httpOnly cookie */
function getToken(req: Request): string | null {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  const cookieToken = (req as any).cookies?.accessToken; // set by Auth service
  return cookieToken ?? null;
}

/** Guard: requires a valid access token; attaches decoded payload to req.user */
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = getToken(req);
  console.log(token,"Token==")
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    // HS256 verification using the SAME access secret as Auth service
    const payload = jwt.verify(token, env.jwtAccessSecret) as any;

    // Expect Auth service to set { sub: userId, ... } in the token
    if (!payload?.sub) return res.status(401).json({ error: "Invalid token payload" });

    req.user = payload; // e.g., { sub: "64f...", iat, exp, ... }
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
