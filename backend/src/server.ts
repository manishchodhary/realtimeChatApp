import { Server } from "socket.io";
import app from "./app.js";
import { env } from "./config/env.js";
import http from "node:http"
import { initailizeSocket } from "./socket/socket.server.js";

const httpserver = http.createServer(app);
const PORT = env.PORT
const io = initailizeSocket(httpserver)

httpserver.listen(PORT ,()=>{
console.log("Sever is runnig on",PORT);

})