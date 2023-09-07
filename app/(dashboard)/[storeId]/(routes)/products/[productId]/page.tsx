import prismadb from "@/lib/prismadb"
import ProductForm from "./components/ProductForm"

type ProductPageProps = {
  params: { productId: string; storeId: string }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prismadb.product.findUnique({
    where: { id: params.productId, storeId: params.storeId },
    include: {
      images: true,
      categories: { select: { categoryId: true } },
      colors: { select: { colorId: true } },
      sizes: { select: { sizeId: true } },
    },
  })
  const categories = await prismadb.category.findMany({
    where: { storeId: params.storeId },
    select: { id: true, name: true },
  })
  const sizes = await prismadb.size.findMany({
    where: { storeId: params.storeId },
    select: { id: true, name: true },
  })
  const colors = await prismadb.color.findMany({
    where: { storeId: params.storeId },
    select: { id: true, name: true },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  )
}
