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

export const colorFormSchema = z.object({
  name: z.string().trim().nonempty({ message: "Required" }),
  value: z.string().min(4, { message: "Must be a valid hex code" }).regex(/^#/),
})

// const sharedValidation = z
//   .object({ id: z.string(), name: z.string() })
//   .array()
//   .min(1, { message: "Required" })

const sharedValidation = z
  .object({
    id: z.string().trim().nonempty(),
  })
  .array()
  .min(1, { message: "Required" })

export const productFormSchema = z.object({
  name: z.string().trim().nonempty({ message: "Required" }),
  price: z.coerce.number().min(1, { message: "Required" }),
  images: z.object({ url: z.string() }).array().min(1, {
    message: "Must have at least 1 image(s)",
  }),
  sizes: sharedValidation,
  colors: sharedValidation,
  categories: sharedValidation,
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
})
