import { config } from "dotenv";

import { z } from "zod"; 
const resulte = config();

const envSchmea = z.object({
  NODE_ENV:z.enum(["development","production","testing"]).default("development"),

  PORT:z.coerce.number().default(5000),

  DATABASE_URI : z.string(),

  JWT_SECRET:z.string().min(32, "JWT_SECRET must be at least 32 characters long")
  

})

export const env = envSchmea.parse(process.env)


