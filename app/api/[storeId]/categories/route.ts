import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

type Params = { params: { storeId: string } }

// Handler function for retrieving categories associated with a store
export async function GET(req: Request, { params }: Params) {
  try {
    // Check if storeId parameter is provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })

    // Retrieve categories from the database based on storeId
    const categories = await prismadb.category.findMany({
      where: { storeId: params.storeId },
    })

    // Return the retrieved categories as JSON response
    return NextResponse.json(categories)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[CATEGORIES_GET]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// Handler function for creating a new category
export async function POST(req: Request, { params }: Params) {
  try {
    // Authenticate the user using Clerk
    const { userId } = auth()

    // Extract name and billboardId from request body
    const { name, billboardId } = await req.json()

    // Check if the user is authenticated
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })
    // Check if storeId, name, and billboardId are provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })
    if (!name) return new NextResponse("Name is required", { status: 400 })
    if (!billboardId)
      return new NextResponse("Billboard is required", { status: 400 })

    // Check if the user is authorized to create a category for this store
    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: params.storeId },
    })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

    // Create a new category record in the database
    const category = await prismadb.category.create({
      data: { name, billboardId, storeId: params.storeId },
    })

    // Return the newly created category as JSON response
    return NextResponse.json(category)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[CATEGORY_POST]", error)

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
      return new NextResponse("No categories Selected", { status: 400 })
    }

    // Check if the user is authorized to delete ids
    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: params.storeId },
    })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

    // Delete the ids from the database
    const deleteSelected = await prismadb.category.deleteMany({
      where: {
        id: { in: ids },
        storeId: params.storeId,
      },
    })

    // Return the deleted colors as JSON response
    return NextResponse.json(deleteSelected)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[MULTIPLE_CATEGORIES_DELETE]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}
