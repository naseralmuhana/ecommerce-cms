import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

type Params = { params: { storeId: string; categoryId: string } }
type GETParams = { params: { categoryId: string } }

// Handler function for retrieving a specific category
export async function GET(req: Request, { params }: GETParams) {
  try {
    // Check if categoryId parameter is provided
    if (!params.categoryId)
      return new NextResponse("Category id is required", { status: 400 })

    // Retrieve the specific category from the database based on categoryId
    const category = await prismadb.category.findUnique({
      where: { id: params.categoryId },
    })

    // Return the retrieved category as JSON response
    return NextResponse.json(category)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[CATEGORY_GET]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// Handles updating a specific category's details associated with a store.
export async function PATCH(req: Request, { params }: Params) {
  try {
    // Authenticate the user using Clerk
    const { userId } = auth()

    // Extract name and billboardId from request body
    const { name, billboardId } = await req.json()

    // Check if the user is authenticated
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    // Check if storeId, categoryId, name, and billboardId are provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })
    if (!params.categoryId)
      return new NextResponse("Category id is required", { status: 400 })
    if (!name) return new NextResponse("Name is required", { status: 400 })
    if (!billboardId)
      return new NextResponse("billboard is required", { status: 400 })

    // Check if the user is authorized to update the category
    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: params.storeId },
    })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

    // Update the specified category in the database
    const updatedCategory = await prismadb.category.update({
      where: { storeId: params.storeId, id: params.categoryId },
      data: { name, billboardId },
    })

    // Return the updated category as JSON response
    return NextResponse.json(updatedCategory)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[CATEGORY_PATCH]", error)

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

    // Check if storeId and categoryId parameters are provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })
    if (!params.categoryId)
      return new NextResponse("Category id is required", { status: 400 })

    // Check if the user is authorized to delete the category
    const storeByUserId = await prismadb.store.findUnique({
      where: { userId, id: params.storeId },
    })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

    // Delete the specified category from the database
    const deletedCategory = await prismadb.category.delete({
      where: { id: params.categoryId, storeId: params.storeId },
    })

    // Return the deleted category as JSON response
    return NextResponse.json(deletedCategory)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[CATEGORY_DELETE]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}
