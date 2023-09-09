type FormValuesType = z.infer<typeof formSchema>

type BillboardColumnsType = {
  id: string
  label: string
  imageUrl: string
  updatedAt: string
}

type CategoryColumnsType = {
  id: string
  name: string
  billboardLabel: string
  updatedAt: string
}

type SizeColumnsType = {
  id: string
  name: string
  value: string
  updatedAt: string
}

type ColorColumnsType = {
  id: string
  name: string
  value: string
  updatedAt: string
}

type OrderColumnsType = {
  id: string
  phone: string
  address: string
  isPaid: boolean
  product: string
  totalPrice: string
  updatedAt: string
}

type TableColumnsType =
  | BillboardColumnsType
  | CategoryColumnsType
  | SizeColumnsType
  | ColorColumnsType
  | OrderColumnsType

type PathType =
  | "orders"
  | "billboards"
  | "categories"
  | "colors"
  | "sizes"
  | "products"

type ApiAlertListEntityName = PathType

type ApiAlertListEntityNameId =
  | "billboardId"
  | "categoryId"
  | "colorId"
  | "sizeId"
  | "productId"
