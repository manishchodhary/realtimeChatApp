import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./socket.handler.js";
import { socketAuth } from "./socket.auth.js";

export const initailizeSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    registerSocketHandlers(io, socket);
  });
  return io;
};
