import { z } from "zod"

export const createStoreFormSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
})

export const settingsFormSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
})
