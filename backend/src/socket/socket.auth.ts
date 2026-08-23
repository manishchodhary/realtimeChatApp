import { Socket } from "socket.io";
import { verifyToken } from "../utils/jwt.js";

export const socketAuth = (
    socket:Socket,
    next:(err?:Error) =>void
)=>{
    try {
            const token = socket.handshake.auth?.token;

    if(!token || typeof token !== "string"){
        return next(new Error("Authentication required"))
    }

    const payload = verifyToken(token);
    socket.data.userId = payload.userId;
    
next();
    } catch (error) {
        next(new Error("Invalid or expired token"));
    }

}