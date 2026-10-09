import type { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { createMessageSchema } from "./message.schema.js";
import { createMessage } from "./messags.service.js";

export const createMessageController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const  conversationId  = req.params.conversationId as string;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    const { content } = createMessageSchema.parse(req.body);

    const message = await createMessage(userId, conversationId, content);
  },
);
