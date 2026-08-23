import type { Server } from "socket.io";
import prisma from "../lib/prisma.js";
import type { AppSocket } from "./socket.types.js";

export const registerSocketHandlers = (io: Server, socket: AppSocket) => {
  const userId = socket.data.userId;
  if (!userId) {
    console.error(`Socket ${socket.id} has no authenticated user`);

    socket.disconnect();
    return;
  }

  console.log(`User ${userId} connected with socket ${socket.id}`);
  socket.on("conversation:join", async (conversationId, callback) => {
    try {
      const userId = socket.data.userId;

      if (!userId) {
        return callback({
          success: false,
          error: "Unauthorized",
        });
      }

      const member = await prisma.conversationMember.findUnique({
        where: {
          userId_conversationId: {
            userId,
            conversationId,
          },
        },
      });
      if (!member) {
        return callback({
          success: false,
          error: "You are not a member of this conversation",
        });
      }
      const roomName = `conversation:${conversationId}`;

      await socket.join(roomName);
      socket.emit("conversation:joined", conversationId);
      callback({
        success: true,
      });
    } catch (error) {
      console.error("Conversation join error:", error);

      callback({
        success: false,
        error: "Failed to join conversation",
      });
    }
  });
  socket.on("disconnect", (reason) => {
    console.log(`Socket disconnected: ${socket.id}`, reason);
  });
};
