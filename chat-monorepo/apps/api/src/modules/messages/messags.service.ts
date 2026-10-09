import prisma from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

export const createMessage = async (
  userId: string,
  conversationId: string,
  content: string,
) => {
  const member = await prisma.conversationMember.findUnique({
    where: {
      userId_conversationId: {
        userId,
        conversationId,
      },
    },
  });
  if (!member) {
    throw new ApiError(403, "You are not a member of this conversation");
  }
  const message = await prisma.message.create({
    data:{
        conversationId,
        senderId:userId,
        content
    },
      select: {
      id: true,
      conversationId: true,
      senderId: true,
      content: true,
      createdAt: true,
      updateAt: true,
    },
  })
  return message;
};
