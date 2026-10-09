import type { Request, Response } from "express";
import { loginService, registerService, userService } from "./auth.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { string } from "zod";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const {user,accessToken} = await registerService(req.body);

  return res.status(201).json({
    success: true,
    data: {
      user,
      accessToken
    },
  });
});

export const login = asyncHandler(async(req:Request,res:Response)=>{
  const {user,accessToken} = await loginService(req.body)

   return res.status(201).json({
    success: true,
    data: {
      user,
      accessToken
    },
  });
})

export const user = asyncHandler(async(req:Request,res:Response)=>{
  const user = await userService(req.user!.id)

  res.status(200).json({
    success: true,
    data: user,
  });
})