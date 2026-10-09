import {z} from "zod"

export const createDirectConversationSchema = z.object({
    userId:z.string().min(1,"User ID is required")
})

export type CreateDirectConversationSchema = z.infer<typeof createDirectConversationSchema>