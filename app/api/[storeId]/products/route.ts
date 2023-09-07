import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"
import { Category, Color, Size } from "@prisma/client"

type Params = { params: { storeId: string } }

// Handler function for retrieving products associated with a store
export async function GET(req: Request, { params }: Params) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId") || undefined
    const sizeId = searchParams.get("sizeId") || undefined
    const colorId = searchParams.get("colorId") || undefined
    const isFeatured = searchParams.get("isFeatured")

    // Check if storeId parameter is provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })

    // Retrieve products from the database based on storeId
    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        // categories: { some: { id: categoryId } },
        // sizes: { some: { id: sizeId } },
        // colors: { some: { id: colorId } },
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        categories: true,
        sizes: true,
        colors: true,
      },
      orderBy: {
        createdAt: "desc",
      },
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
  console.log("[PRODUCTS_DELETE]")
}
