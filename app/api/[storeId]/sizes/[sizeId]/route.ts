import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

type Params = { params: { storeId: string; sizeId: string } }
type GETParams = { params: { sizeId: string } }

// Handler function for retrieving a specific size
export async function GET(req: Request, { params }: GETParams) {
  try {
    // Check if sizeId parameter is provided
    if (!params.sizeId)
      return new NextResponse("Size id is required", { status: 400 })

    // Retrieve the specific size from the database based on sizeId
    const size = await prismadb.size.findUnique({
      where: { id: params.sizeId },
    })

    // Return the retrieved size as JSON response
    return NextResponse.json(size)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[SIZE_GET]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// Handles updating a specific size's details associated with a store.
export async function PATCH(req: Request, { params }: Params) {
  try {
    // Authenticate the user using Clerk
    const { userId } = auth()

    // Extract name and value from request body
    const { name, value } = await req.json()

    // Check if the user is authenticated
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    // Check if storeId, sizeId, name, and value are provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })
    if (!params.sizeId)
      return new NextResponse("Size id is required", { status: 400 })
    if (!name) return new NextResponse("Name is required", { status: 400 })
    if (!value) return new NextResponse("Value is required", { status: 400 })

    // Check if the user is authorized to update the size
    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: params.storeId },
    })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

    // Update the specified size in the database
    const updatedSize = await prismadb.size.update({
      where: { storeId: params.storeId, id: params.sizeId },
      data: { name, value },
    })

    // Return the updated size as JSON response
    return NextResponse.json(updatedSize)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[SIZE_PATCH]", error)

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

    // Check if storeId and sizeId parameters are provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })
    if (!params.sizeId)
      return new NextResponse("Size id is required", { status: 400 })

    // Check if the user is authorized to delete the size
    const storeByUserId = await prismadb.store.findUnique({
      where: { userId, id: params.storeId },
    })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

    // Delete the specified size from the database
    const deletedSize = await prismadb.size.delete({
      where: { id: params.sizeId, storeId: params.storeId },
    })

    // Return the deleted size as JSON response
    return NextResponse.json(deletedSize)
  } catch (error) {
    // Log the error with context for debugging purposes
    console.error("[SIZE_DELETE]", new Date().toISOString(), error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}
