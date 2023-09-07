import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"
import { Category, Color, Size } from "@prisma/client"

type Params = { params: { storeId: string; productId: string } }
type GETParams = { params: { productId: string } }

// Handler function for retrieving a specific product
export async function GET(req: Request, { params }: GETParams) {
  try {
    // Check if productId parameter is provided
    if (!params.productId)
      return new NextResponse("Product id is required", { status: 400 })

    // Retrieve the specific product from the database based on productId
    const product = await prismadb.product.findUnique({
      where: { id: params.productId },
      include: {
        images: true,
        categories: { select: { category: true } },
        sizes: { select: { size: true } },
        colors: { select: { color: true } },
      },
    })

    // Return the retrieved product as JSON response
    return NextResponse.json(product)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[PRODUCT_GET]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// Handles updating a specific product's details associated with a store.
export async function PATCH(req: Request, { params }: Params) {
  try {
    // Authenticate the user using Clerk
    const { userId } = auth()

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

    // Check if the user is authorized to update the product
    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: params.storeId },
    })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

    const updatedProduct = await prismadb.product.update({
      where: { storeId: params.storeId, id: params.productId },
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categories: {
          deleteMany: {},
          create: categories.map(({ id }: Size) => ({
            category: { connect: { id } },
          })),
        },
        sizes: {
          deleteMany: {},
          create: sizes.map(({ id }: Size) => ({ size: { connect: { id } } })),
        },
        colors: {
          deleteMany: {},
          create: colors.map(({ id }: Size) => ({
            color: { connect: { id } },
          })),
        },
        images: {
          deleteMany: {},
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    })

    // Return the updated product as JSON response
    return NextResponse.json(updatedProduct)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[PRODUCT_PATCH]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    // Authenticate the user using Clerk
    const { userId } = auth()

    // Check if the user is authenticated
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    // Check if storeId and productId parameters are provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })
    if (!params.productId)
      return new NextResponse("Product id is required", { status: 400 })

    // Check if the user is authorized to delete the product
    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: params.storeId },
    })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

    await prismadb.product.update({
      where: { storeId: params.storeId, id: params.productId },
      data: {
        categories: { deleteMany: {} },
        sizes: { deleteMany: {} },
        colors: { deleteMany: {} },
      },
    })

    // Delete the specified product from the database
    const deletedProduct = await prismadb.product.delete({
      where: { id: params.productId, storeId: params.storeId },
    })

    // Return the deleted product as JSON response
    return NextResponse.json(deletedProduct)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[PRODUCT_DELETE]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}
