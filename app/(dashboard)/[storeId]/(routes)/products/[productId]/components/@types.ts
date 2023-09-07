import { Image, Product } from "@prisma/client"

type imagesInProductType = { images: Image[] }
type categoriesInProductType = { categories: { categoryId: string }[] }
type sizesInProductType = { sizes: { sizeId: string }[] }
type colorsInProductType = { colors: { colorId: string }[] }

// type categoriesInProductType = { categories: { category: { id: string } }[] }
// type sizesInProductType = { sizes: { size: { id: string } }[] }
// type colorsInProductType = { colors: { color: { id: string } }[] }

export type initialDataType =
  | (Product &
      imagesInProductType &
      categoriesInProductType &
      sizesInProductType &
      colorsInProductType)
  | null

type sharedType = { id: string; name: string }[]

export type ProductFormProps = {
  initialData: initialDataType
  categories: sharedType
  sizes: sharedType
  colors: sharedType
}
