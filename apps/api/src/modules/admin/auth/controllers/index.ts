import { HttpStatus } from "@/types";
import { sendError, zodError, errorReasonToHttpStatus, sendSuccess } from "@/utils";
import { adminLoginService, adminRegisterService } from "../services";
import type { Request, Response } from "express";
import { adminLoginSchema, createAdminBodySchema } from "@linktree/validation";

export const adminLogin = async (req: Request, res: Response) => {
  const { success, error, data } = adminLoginSchema.safeParse(req.body);

  if (!success) {
    return sendError(res, zodError(error), HttpStatus.BAD_REQUEST);
  }
  
  const result = await adminLoginService(data);
  
  if (!result.ok) {
    return sendError(res, result.message, errorReasonToHttpStatus(result.reason));
  }

  return sendSuccess(res, result.data, HttpStatus.OK);
}


export const adminRegister = async (req: Request, res: Response) => {
  const { success, error, data } = createAdminBodySchema.safeParse(req.body);
  if (!success) {
    return sendError(res, zodError(error), HttpStatus.BAD_REQUEST);
  }
  const result = await adminRegisterService(data);
  if (!result.ok) {
    return sendError(res, result.message, errorReasonToHttpStatus(result.reason));
  }
  return sendSuccess(res, result.data, HttpStatus.OK);
}