import { createClickCountSchema } from "@linktree/validation";
import {
  errorReasonToHttpStatus,
  sendError,
  sendSuccess,
  zodError,
} from "@/utils";
import { HttpStatus } from "@/types";
import type { Request, Response } from "express";
import {
  increaseHomePageClicksService,
  increaseLinkClicksService,
} from "../services";

export const incrementClickController = async (req: Request, res: Response) => {
  try {
    const link = req.params.link;

    if (!link) {
      return sendError(res, "Invalid link", HttpStatus.BAD_REQUEST);
    }

    const result = await increaseLinkClicksService({
      linkId: link as string,
    });

    if (!result.ok) {
      return sendError(
        res,
        result.message,
        errorReasonToHttpStatus(result.reason),
      );
    }

    return sendSuccess(res, result.data, HttpStatus.CREATED);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const incrementHomePageClicksController = async (
  req: Request,
  res: Response,
) => {
  try {
    const username = req.params.username;

    if (!username) {
      return sendError(res, "Invalid username", HttpStatus.BAD_REQUEST);
    }

    const result = await increaseHomePageClicksService(username as string);

    if (!result.ok) {
      return sendError(
        res,
        result.message,
        errorReasonToHttpStatus(result.reason),
      );
    }
    return sendSuccess(res, result.data, HttpStatus.CREATED);
  } catch (error) {
    console.log(error);
    return sendError(
      res,
      "Internal server error",
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
