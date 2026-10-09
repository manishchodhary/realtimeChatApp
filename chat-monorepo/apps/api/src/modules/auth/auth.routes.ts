import { Router } from "express";
import { register ,login,user} from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router()

router.post("/register",register)

router.post("/login",login)

router.get("/user",authenticate,user)
export default router