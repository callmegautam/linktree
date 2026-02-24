import { HttpStatus } from "@/types";
import { errorReasonToHttpStatus, sendError, sendSuccess } from "@/utils";
import { getHomePageService } from "../services";
import { Request, Response } from "express";
import { usernameIdParamSchema } from "@linktree/validation";

export const getHomePage = async (req: Request, res: Response) => {
  try {
    const { username } = usernameIdParamSchema.parse(req.params);

    const result = await getHomePageService(username);
    if (!result.ok) {
      return sendError(res, result.message, errorReasonToHttpStatus(result.reason));
    }
    return sendSuccess(res, result.data, HttpStatus.OK);
  } catch (error) {
    console.log(error);
    return sendError(res, 'Failed to get home page', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}