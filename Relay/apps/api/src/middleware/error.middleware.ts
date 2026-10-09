import type { ErrorRequestHandler , } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler:ErrorRequestHandler=(err,req,res,next)=>{
    if(err instanceof ApiError){
      res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return ;
    }

      console.error(err);
 res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
