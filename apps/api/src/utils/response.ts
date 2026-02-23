import { Response } from 'express';
import { ApiResponse } from '@linktree/shared-types';

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200) => {
  // const payload: ApiResponse<T> = { success: true, data };
  const payload: ApiResponse<T> = { data };
  return res.status(statusCode).json(payload);
};

export const sendError = (res: Response, error: any, statusCode = 500) => {
  // const payload: ApiResponse<null> = { success: false, error };
  const payload: ApiResponse<null> = { error };
  return res.status(statusCode).json(payload);
};
