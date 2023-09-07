import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { TablePageContent } from "@/components/TablePageContent"
import { formatter } from "@/lib/utils"
import {
  ProductColumnsType,
  productColumns,
} from "@/components/columns/products-columns"

interface ProductsPageProps {
  params: { storeId: string }
}

const ProductsPage: React.FC<ProductsPageProps> = async ({ params }) => {
  const products = await prismadb.product.findMany({
    where: { storeId: params.storeId },
    include: {
      categories: { include: { category: true } },
      colors: { include: { color: true } },
      sizes: { include: { size: true } },
      images: true,
    },
    orderBy: { updatedAt: "desc" },
  })
  // console.log({ products })

  const formattedProducts: ProductColumnsType[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: formatter.format(product.price.toNumber()),
    categories: product.categories.map((record) => record.category),
    sizes: product.sizes.map((record) => record.size),
    colors: product.colors.map((record) => record.color),
    images: product.images,
    updatedAt: format(product.updatedAt, "kk:mm MMMM do, yyyy"),
  }))

  return (
    <TablePageContent
      data={formattedProducts}
      columns={productColumns}
      headingTitle="Products"
      headingDescription="Manage products for your store"
      apiAlertListEntityName="products"
      apiAlertListEntityIdName="productId"
    />
  )
}
export default ProductsPage
