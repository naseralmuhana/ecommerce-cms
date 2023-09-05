type FormValuesType = z.infer<typeof formSchema>

type BillboardColumnsType = {
  id: string
  label: string
  imageUrl: string
  updatedAt: string
}

type ApiAlertListEntityName =
  | "billboards"
  | "categories"
  | "colors"
  | "sizes"
  | "products"

type ApiAlertListEntityNameId =
  | "billboardId"
  | "categoryId"
  | "colorId"
  | "sizeId"
  | "productId"
