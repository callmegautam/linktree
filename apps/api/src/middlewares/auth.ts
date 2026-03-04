import { NextFunction, Request, RequestHandler, Response } from "express";
import { HttpStatus } from "../types";
import { sendError, verifyToken } from "../utils";

export const authMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return sendError(
      res,
      "Authorization header missing",
      HttpStatus.UNAUTHORIZED,
    );
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return sendError(
      res,
      "Invalid authorization format. Expected: Bearer <token>",
      HttpStatus.UNAUTHORIZED,
    );
  }

  try {
    const payload = verifyToken(token) as {
      id: string;
      email: string;
    };

    req.auth = {
      id: payload.id,
      email: payload.email,
    };

    next();
  } catch {
    return sendError(res, "Invalid or expired token", HttpStatus.UNAUTHORIZED);
  }
};

export const adminAuthMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return sendError(
      res,
      "Authorization header missing",
      HttpStatus.UNAUTHORIZED,
    );
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return sendError(
      res,
      "Invalid authorization format. Expected: Bearer <token>",
      HttpStatus.UNAUTHORIZED,
    );
  }

  try {
    const payload = verifyToken(token) as {
      id: string;
      email: string;
    };

    req.auth = {
      id: payload.id,
      email: payload.email,
    };

    next();
  } catch {
    return sendError(res, "Invalid or expired token", HttpStatus.UNAUTHORIZED);
  }
};
