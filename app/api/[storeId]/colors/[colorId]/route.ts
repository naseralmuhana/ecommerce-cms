import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

type Params = { params: { storeId: string; colorId: string } }
type GETParams = { params: { colorId: string } }

// Handler function for retrieving a specific color
export async function GET(req: Request, { params }: GETParams) {
  try {
    // Check if colorId parameter is provided
    if (!params.colorId)
      return new NextResponse("Color id is required", { status: 400 })

    // Retrieve the specific color from the database based on colorId
    const color = await prismadb.color.findUnique({
      where: { id: params.colorId },
    })

    // Return the retrieved color as JSON response
    return NextResponse.json(color)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[COLOR_GET]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// Handles updating a specific color's details associated with a store.
export async function PATCH(req: Request, { params }: Params) {
  try {
    // Authenticate the user using Clerk
    const { userId } = auth()

    // Extract name and value from request body
    const { name, value } = await req.json()

    // Check if the user is authenticated
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    // Check if storeId, colorId, name, and value are provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })
    if (!params.colorId)
      return new NextResponse("Color id is required", { status: 400 })
    if (!name) return new NextResponse("Name is required", { status: 400 })
    if (!value) return new NextResponse("Value is required", { status: 400 })

    // Check if the user is authorized to update the color
    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: params.storeId },
    })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

    // Update the specified color in the database
    const updatedColor = await prismadb.color.update({
      where: { storeId: params.storeId, id: params.colorId },
      data: { name, value },
    })

    // Return the updated color as JSON response
    return NextResponse.json(updatedColor)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[COLOR_PATCH]", error)

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

    // Check if storeId and colorId parameters are provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })
    if (!params.colorId)
      return new NextResponse("Color id is required", { status: 400 })

    // Check if the user is authorized to delete the color
    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: params.storeId },
    })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

    // Delete the specified color from the database
    const deletedColor = await prismadb.color.delete({
      where: { id: params.colorId, storeId: params.storeId },
    })

    // Return the deleted color as JSON response
    return NextResponse.json(deletedColor)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[COLOR_DELETE]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}
