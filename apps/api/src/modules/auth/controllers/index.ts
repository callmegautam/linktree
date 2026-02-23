import type { Request, Response } from 'express';
import { createUserSchema, loginUserSchema } from '@linktree/validation';
import { loginService, registerService } from '@/modules/auth/services';
import { HttpStatus } from '@/types';
import { sendError, sendSuccess, setCookie } from '@/utils';
import { zodError } from '@/utils/zod-error';
import { errorReasonToHttpStatus } from '@/utils/http-mapper';
import { removeCookie } from '@/utils/cookie';

export const register = async (req: Request, res: Response) => {
  const { success, error, data } = createUserSchema.safeParse(req.body);

  if (!success) {
    return sendError(res, zodError(error), HttpStatus.BAD_REQUEST);
  }

  const result = await registerService(data);

  if (!result.ok) {
    return sendError(res, result.message, errorReasonToHttpStatus(result.reason));
  }

  setCookie(res, 'token', result.data.token);

  const { token, ...response } = result.data;

  return sendSuccess(res, result.data, HttpStatus.OK);
};

export const login = async (req: Request, res: Response) => {
  const { success, error, data } = loginUserSchema.safeParse(req.body);

  if (!success) {
    return sendError(res, zodError(error), HttpStatus.BAD_REQUEST);
  }

  const result = await loginService(data);

  if (!result.ok) {
    return sendError(res, result.message, errorReasonToHttpStatus(result.reason));
  }

  return sendSuccess(res, result.data, HttpStatus.OK);
};

export const logout = async (_req: Request, res: Response) => {
  removeCookie(res, 'token');
  return sendSuccess(res, 'Logged out successfully', HttpStatus.OK);
};

export const me = async (req: Request, res: Response) => {
  // if (!req?.auth?.id) {
  //   return sendError(res, 'Unauthorized', HttpStatus.UNAUTHORIZED);
  // }

  // const result = await findUserService(req.auth.id);

  // if (!result.ok) {
  //   return sendError(res, result.message, errorReasonToHttpStatus(result.reason));
  // }

  // return sendSuccess(res, result.data, HttpStatus.OK);
};
