import {
  errorReasonToHttpStatus,
  sendError,
  sendSuccess,
  zodError,
} from "@/utils";
import {
  getAdminUsersService,
  toggleUserStatusService,
  UserStatus,
} from "../services";
import { HttpStatus } from "@/types";
import type { Request, Response } from "express";

export const getAdminUsers = async (req: Request, res: Response) => {
  const result = await getAdminUsersService();
  if (!result.ok) {
    return sendError(
      res,
      result.message,
      errorReasonToHttpStatus(result.reason),
    );
  }
  return sendSuccess(res, result.data, HttpStatus.OK);
};

export const toggleUserStatus = async (req: Request, res: Response) => {
  const userId = req?.params?.user as string;
  const status = req?.params?.status as UserStatus;

  if (!userId || !status) {
    return sendError(
      res,
      "User ID and status are required",
      HttpStatus.BAD_REQUEST,
    );
  }

  if (!["block", "unblock"].includes(status)) {
    return sendError(res, "Invalid status", HttpStatus.BAD_REQUEST);
  }

  const result = await toggleUserStatusService(userId, status);

  if (!result.ok) {
    return sendError(
      res,
      result.message,
      errorReasonToHttpStatus(result.reason),
    );
  }
  return sendSuccess(res, result.data, HttpStatus.OK);
};
