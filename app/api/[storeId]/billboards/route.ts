import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

type Params = { params: { storeId: string } }

// Handler function for retrieving billboards associated with a store
export async function GET(req: Request, { params }: Params) {
  try {
    // Check if storeId parameter is provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })

    // Retrieve billboards from the database based on storeId
    const billboards = await prismadb.billboard.findMany({
      where: { storeId: params.storeId },
    })

    // Return the retrieved billboards as JSON response
    return NextResponse.json(billboards)
  } catch (error) {
    // Log the error with a timestamp for debugging purposes
    console.error("[BILLBOARDS_GET]", new Date().toISOString(), error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// Handler function for creating a new billboard
export async function POST(req: Request, { params }: Params) {
  try {
    // Authenticate the user using Clerk
    const { userId } = auth()

    // Extract label and imageUrl from request body
    const { label, imageUrl } = await req.json()

    // Check if the user is authenticated
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })
    // Check if storeId, label, and imageUrl are provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })
    if (!label) return new NextResponse("Label is required", { status: 400 })
    if (!imageUrl)
      return new NextResponse("Image Url is required", { status: 400 })

    // Check if the user is authorized to create a billboard for this store
    const storeByUserId = await prismadb.store.findFirst({
      where: { userId, id: params.storeId },
    })
    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

    // Create a new billboard record in the database
    const billboard = await prismadb.billboard.create({
      data: { label, imageUrl, storeId: params.storeId },
    })

    // Return the newly created billboard as JSON response
    return NextResponse.json(billboard)
  } catch (error) {
    // Log the error with context for debugging purposes
    console.error("[BILLBOARD_POST]", new Date().toISOString(), error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}
export async function DELETE(req: Request, { params }: Params) {
  console.log("[BILLBOARDS_DELETE]")
}
