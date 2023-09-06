import { z } from "zod"

export const createStoreFormSchema = z.object({
  name: z.string().trim().nonempty({ message: "Required" }),
})

export const settingsFormSchema = z.object({
  name: z.string().trim().nonempty({ message: "Required" }),
})

export const billboardFormSchema = z.object({
  label: z.string().trim().nonempty({ message: "Required" }),
  imageUrl: z
    .string()
    .trim()
    .nonempty({ message: "You must select an image to proceed" }),
})

export const categoryFormSchema = z.object({
  name: z.string().trim().nonempty({ message: "Required" }),
  billboardId: z.string().trim().nonempty({
    message: "Please select a billboard",
  }),
})

export const sizeFormSchema = z.object({
  name: z.string().trim().nonempty({ message: "Required" }),
  value: z.string().trim().nonempty({ message: "Required" }),
})
