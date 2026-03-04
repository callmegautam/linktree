import { errorReasonToHttpStatus, sendError, sendSuccess } from "@/utils";
import { getAnalyticsService } from "../services";
import { Request, Response } from "express";
import { HttpStatus } from "@/types";

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const result = await getAnalyticsService();
    if (!result.ok) {
      return sendError(
        res,
        result.message,
        errorReasonToHttpStatus(result.reason),
      );
    }
    return sendSuccess(res, result.data, HttpStatus.OK);
  } catch (error) {
    console.log(error);
    return sendError(
      res,
      "Failed to get analytics",
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
