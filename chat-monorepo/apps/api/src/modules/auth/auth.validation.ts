import { z } from "zod";

const registerSchema = z.object({
    name:z.string().min(3),
    email:z.email().trim().toLowerCase(),
    password:z.string().min(6)

})

export type RegisterUserInput = z.infer<typeof registerSchema>


const loginSchema = z.object({
    email:z.email().trim().toLowerCase(),
    password:z.string().min(1,"password required")
})

export type LoginUserInput = z.infer<typeof loginSchema>