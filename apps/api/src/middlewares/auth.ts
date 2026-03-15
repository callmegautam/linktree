import { NextFunction, Request, RequestHandler, Response } from 'express';
import { HttpStatus } from '../types';
import { sendError, verifyToken } from '../utils';
import { User } from '@/models/users';

export const authMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return sendError(res, 'Authorization header missing', HttpStatus.UNAUTHORIZED);
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return sendError(
      res,
      'Invalid authorization format. Expected: Bearer <token>',
      HttpStatus.UNAUTHORIZED
    );
  }

  try {
    const payload = verifyToken(token) as {
      id: string;
      email: string;
    };

    const user = await User.findById(payload.id).lean();

    if (!user) {
      return sendError(res, 'User not found', HttpStatus.UNAUTHORIZED);
    }

    if (user.isBlocked) {
      return sendError(res, 'Your account has been blocked', HttpStatus.FORBIDDEN);
    }

    req.auth = {
      id: payload.id,
      email: payload.email,
    };

    next();
  } catch {
    return sendError(res, 'Invalid or expired token', HttpStatus.UNAUTHORIZED);
  }
};

export const adminAuthMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return sendError(res, 'Authorization header missing', HttpStatus.UNAUTHORIZED);
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return sendError(
      res,
      'Invalid authorization format. Expected: Bearer <token>',
      HttpStatus.UNAUTHORIZED
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
    return sendError(res, 'Invalid or expired token', HttpStatus.UNAUTHORIZED);
  }
};
