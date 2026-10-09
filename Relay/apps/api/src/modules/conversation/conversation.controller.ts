import type { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { createDirectConversationSchema } from "./conversation.schema.js";
import { getOrCreateDirectConversation } from "./conversation.service.js";

export const createOrGetDriectCoversation = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId: otherUserId } = createDirectConversationSchema.parse(
      req.body,
    );

    const currentUserId = req.user!.id;

    const conversation = await getOrCreateDirectConversation(
      currentUserId,
      otherUserId,
    );
    res.status(201).json({
      success: true,
      message: "Conversation created",
      data: conversation,
    });
  },
);
