import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"
import { Category, Color, Size } from "@prisma/client"

type Params = { params: { storeId: string } }

// Handler function for retrieving products associated with a store
export async function GET(req: Request, { params }: Params) {
  try {
    const { searchParams } = new URL(req.url)

    const categoriesSearchParams = searchParams.getAll("categoryId")
    const categoryIds = categoriesSearchParams.length
      ? categoriesSearchParams
      : undefined
    const sizeId = searchParams.get("sizeId") || undefined
    const colorId = searchParams.get("colorId") || undefined
    // const sort = searchParams.get("sort") || undefined
    const isFeatured = searchParams.get("isFeatured") || undefined

    console.log(categoryIds)

    // Check if storeId parameter is provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })

    // Retrieve products from the database based on storeId
    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categories: { some: { categoryId: { in: categoryIds } } },
        sizes: { some: { sizeId } },
        colors: { some: { colorId } },
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        categories: true,
        sizes: true,
        colors: true,
      },
      orderBy: [
        // {
        //   price: sort === "low" ? "asc" : sort === "high" ? "desc" : undefined,
        // },
        { createdAt: "desc" },
      ],
    })

    // Return the retrieved products as JSON response
    return NextResponse.json(products)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[PRODUCTS_GET]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// Handler function for creating a new product
export async function POST(req: Request, { params }: Params) {
  try {
    // Authenticate the user using Clerk
    const { userId } = auth()
    // console.log(await req.json())

    // Extract values from request body
    const {
      name,
      images,
      price,
      categories,
      sizes,
      colors,
      isFeatured,
      isArchived,
    } = await req.json()

    // Check if the user is authenticated
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })
    // Check if values are provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })
    if (!name) return new NextResponse("Name is required", { status: 400 })
    if (!images || !images.length)
      return new NextResponse("Images are required", { status: 400 })
    if (!price) return new NextResponse("Price is required", { status: 400 })
    if (!categories || !categories.length)
      return new NextResponse("category(s) is required", { status: 400 })
    if (!sizes || !sizes.length)
      return new NextResponse("size(s) is required", { status: 400 })
    if (!colors || !colors.length)
      return new NextResponse("color(s) is required", { status: 400 })

    // Check if the user is authorized to create a product for this store
    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: params.storeId },
    })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

    // Create a new product record in the database
    const product = await prismadb.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        storeId: params.storeId,
        categories: {
          create: categories.map(({ id }: Size) => ({
            category: { connect: { id } },
          })),
        },
        sizes: {
          create: sizes.map(({ id }: Size) => ({ size: { connect: { id } } })),
        },
        colors: {
          create: colors.map(({ id }: Size) => ({
            color: { connect: { id } },
          })),
        },
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    })

    // Return the newly created product as JSON response
    return NextResponse.json(product)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[PRODUCT_POST]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    // Authenticate the user using Clerk
    const { userId } = auth()

    // Extract ids from request body
    const { ids } = await req.json()

    // Check if the user is authenticated
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    // Check if storeId parameter is provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })

    // Check if ids parameter is provided
    if (!ids || !ids.length) {
      return new NextResponse("No product(s) Selected", { status: 400 })
    }

    // Check if the user is authorized to delete ids
    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: params.storeId },
    })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

    // await prismadb.product.updateMany({
    //   where: { storeId: params.storeId },
    //   data: {
    //     categories: { deleteMany: {} },
    //     sizes: { deleteMany: {} },
    //     colors: { deleteMany: {} },
    //   },
    // })

    await prismadb.productCategory.deleteMany({
      where: {
        productId: { in: ids },
      },
    })
    await prismadb.productColor.deleteMany({
      where: {
        productId: { in: ids },
      },
    })
    await prismadb.productSize.deleteMany({
      where: {
        productId: { in: ids },
      },
    })

    // Delete the ids from the database
    const deleteSelected = await prismadb.product.deleteMany({
      where: {
        id: { in: ids },
        storeId: params.storeId,
      },
    })

    // Return the deleted colors as JSON response
    return NextResponse.json(deleteSelected)
  } catch (error) {
    // Log the error with context for debugging purposes
    console.error("[MULTIPLE_COLORS_DELETE]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}
