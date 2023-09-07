import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

type Params = { params: { storeId: string } }

// Handler function for retrieving colors associated with a store
export async function GET(req: Request, { params }: Params) {
  try {
    // Check if storeId parameter is provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })

    // Retrieve colors from the database based on storeId
    const colors = await prismadb.color.findMany({
      where: { storeId: params.storeId },
    })

    // Return the retrieved colors as JSON response
    return NextResponse.json(colors)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[COLORS_GET]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// Handler function for creating a new color
export async function POST(req: Request, { params }: Params) {
  try {
    // Authenticate the user using Clerk
    const { userId } = auth()

    // Extract name and value from request body
    const { name, value } = await req.json()

    // Check if the user is authenticated
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })
    // Check if storeId, name, and value are provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })
    if (!name) return new NextResponse("Name is required", { status: 400 })
    if (!value) return new NextResponse("Value is required", { status: 400 })

    // Check if the user is authorized to create a color for this store
    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: params.storeId },
    })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

    // Create a new color record in the database
    const color = await prismadb.color.create({
      data: { name, value, storeId: params.storeId },
    })

    // Return the newly created color as JSON response
    return NextResponse.json(color)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[COLOR_POST]", error)

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
      return new NextResponse("No color(s) Selected", { status: 400 })
    }

    // Check if the user is authorized to delete ids
    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: params.storeId },
    })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

    // Delete the ids from the database
    const deleteSelected = await prismadb.color.deleteMany({
      where: {
        id: { in: ids },
        storeId: params.storeId,
      },
    })

    // Return the deleted colors as JSON response
    return NextResponse.json(deleteSelected)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[MULTIPLE_COLORS_DELETE]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}
