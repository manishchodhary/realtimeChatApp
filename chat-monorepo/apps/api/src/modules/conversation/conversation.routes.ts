import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { createOrGetDriectCoversation } from "./conversation.controller.js";

 const router = Router()

router.post("/direct",authenticate,createOrGetDriectCoversation)


export default router;