import type { Request, Response } from "express";
import { HttpStatus } from "@/types";
import { sendError, errorReasonToHttpStatus, sendSuccess, zodError } from "@/utils";
import { changeUsernameService, getProfileService, updateProfileService } from "../services";
import { changeUsernameSchema, updateProfileBodySchema } from "@linktree/validation";
import { Profile } from "@/models/profile";
import env from "@/config/env";

export const getProfile = async (req: Request, res: Response) => {
  const userId = req?.auth?.id;

  if (!userId) {
    return sendError(res, 'Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  const result = await getProfileService(userId);

  if (!result.ok) {
    return sendError(res, result.message, errorReasonToHttpStatus(result.reason));
  }

  return sendSuccess(res, result.data, HttpStatus.OK);
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = req?.auth?.id;

  if (!userId) {
    return sendError(res, 'Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  const { success, error, data } = updateProfileBodySchema.safeParse(req.body);

  if (!success) {
    return sendError(res, zodError(error), HttpStatus.BAD_REQUEST);
  }

  const result = await updateProfileService(userId, data);

  if (!result.ok) {
    return sendError(res, result.message, errorReasonToHttpStatus(result.reason));
  }

  return sendSuccess(res, result.data, HttpStatus.OK);
};

export const changeUsername = async (req: Request, res: Response) => {
  const userId = req?.auth?.id;

  if (!userId) {
    return sendError(res, 'Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  const { success, error, data } = changeUsernameSchema.safeParse(req.body);

  if (!success) {
    return sendError(res, zodError(error), HttpStatus.BAD_REQUEST);
  }

  const result = await changeUsernameService(userId, data);

  if (!result.ok) {
    return sendError(res, result.message, errorReasonToHttpStatus(result.reason));
  }

  return sendSuccess(res, result.data, HttpStatus.OK);
};


export const uploadAvatar = async (req: Request, res: Response) => {
  const userId = req?.auth?.id;
  
  if (!userId) {
    return sendError(res, 'Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded"
    });
  }

  const filePath = `/images/${req.file.filename}`;


  await Profile.findOneAndUpdate(
    { user_id: userId },
    { $set: { avatar_url: filePath } },
    { new: true }
  );

  return sendSuccess(res, {path: filePath}, HttpStatus.OK)
  
}