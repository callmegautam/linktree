import { errorReasonToHttpStatus, sendError, sendSuccess } from "@/utils";
import { Request, Response } from "express";
import { HttpStatus } from "@/types";
import {
  getAdminLinksService,
  toggleLinkStatusService,
  deleteLinkService,
} from "../services";
import { LinkStatus } from "@linktree/validation";

export const getAdminLinks = async (req: Request, res: Response) => {
  const result = await getAdminLinksService();
  if (!result.ok) {
    return sendError(
      res,
      result.message,
      errorReasonToHttpStatus(result.reason),
    );
  }
  return sendSuccess(res, result.data, HttpStatus.OK);
};

export const toggleLinkStatus = async (req: Request, res: Response) => {
  const linkId = req?.params?.link as string;
  const status = req?.params?.status as LinkStatus;
  if (!linkId || !status) {
    return sendError(
      res,
      "Link ID and status are required",
      HttpStatus.BAD_REQUEST,
    );
  }
  const result = await toggleLinkStatusService(linkId, status);
  if (!result.ok) {
    return sendError(
      res,
      result.message,
      errorReasonToHttpStatus(result.reason),
    );
  }
  return sendSuccess(res, result.data, HttpStatus.OK);
};

export const deleteLink = async (req: Request, res: Response) => {
  const linkId = req?.params?.link as string;
  if (!linkId) {
    return sendError(res, "Link ID is required", HttpStatus.BAD_REQUEST);
  }
  const result = await deleteLinkService(linkId);
  if (!result.ok) {
    return sendError(
      res,
      result.message,
      errorReasonToHttpStatus(result.reason),
    );
  }
  return sendSuccess(res, result.data, HttpStatus.OK);
};
