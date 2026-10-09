import jwt from "jsonwebtoken"
import { env } from "../config/env.js"


interface AccessTokenPayload{
    userId:string
}

export const signAccessToken = (payload:AccessTokenPayload)=>{
    const token = jwt.sign(payload,env.JWT_SECRET,{expiresIn:"15min"})
    return token
}

export const verifyToken = (token:string)=>{
    return jwt.verify(token,env.JWT_SECRET) as AccessTokenPayload
}

