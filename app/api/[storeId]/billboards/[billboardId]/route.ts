import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

type Params = { params: { storeId: string; billboardId: string } }
type GETParams = { params: { billboardId: string } }

// Handler function for retrieving a specific billboard
export async function GET(req: Request, { params }: GETParams) {
  try {
    // Check if billboardId parameter is provided
    if (!params.billboardId)
      return new NextResponse("Billboard id is required", { status: 400 })

    // Retrieve the specific billboard from the database based on billboardId
    const billboard = await prismadb.billboard.findUnique({
      where: { id: params.billboardId },
    })

    // Return the retrieved billboard as JSON response
    return NextResponse.json(billboard)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[BILLBOARD_GET]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// Handles updating a specific billboard's details associated with a store.
export async function PATCH(req: Request, { params }: Params) {
  try {
    // Authenticate the user using Clerk
    const { userId } = auth()

    // Extract label and imageUrl from request body
    const { label, imageUrl } = await req.json()

    // Check if the user is authenticated
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    // Check if storeId, billboardId, label, and imageUrl are provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })
    if (!params.billboardId)
      return new NextResponse("Billboard id is required", { status: 400 })
    if (!label) return new NextResponse("Label is required", { status: 400 })
    if (!imageUrl)
      return new NextResponse("Image Url is required", { status: 400 })

    // Check if the user is authorized to update the billboard
    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: params.storeId },
    })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

    // Update the specified billboard in the database
    const updatedBillboard = await prismadb.billboard.updateMany({
      where: { storeId: params.storeId, id: params.billboardId },
      data: { label, imageUrl },
    })

    // Return the updated billboard as JSON response
    return NextResponse.json(updatedBillboard)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[BILLBOARD_PATCH]", error)

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

    // Check if storeId and billboardId parameters are provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })
    if (!params.billboardId)
      return new NextResponse("Billboard id is required", { status: 400 })

    // Check if the user is authorized to delete the billboard
    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: params.storeId },
    })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 400 })

    // Delete the specified billboard from the database
    const deletedBillboard = await prismadb.billboard.delete({
      where: { id: params.billboardId, storeId: params.storeId },
    })

    // Return the deleted billboard as JSON response
    return NextResponse.json(deletedBillboard)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[BILLBOARD_DELETE]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}
