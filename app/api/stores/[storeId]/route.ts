import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

// Define the expected JSON body for the request
interface StoreRequest extends Request {
  json: () => Promise<{ name: string }>
}
type Params = { params: { storeId: string } }

// Handler function for updating a store
export async function PATCH(req: StoreRequest, { params }: Params) {
  try {
    // Authenticate the user using Clerk
    const { userId } = auth()

    // Check if the user is authenticated
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    // Extract the 'name' field from the request body
    const { name } = await req.json()

    // Check if 'storeId' and 'name' fields are provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })
    if (!name)
      return new NextResponse("Store name is required", { status: 400 })

    // Update the store record in the database
    await prismadb.store.updateMany({
      where: { id: params.storeId, userId },
      data: { name },
    })

    // Return the success response
    return NextResponse.json("Store updated")
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[STORE_PATCH]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// Handler function for deleting a store
export async function DELETE(req: StoreRequest, { params }: Params) {
  try {
    // Authenticate the user using Clerk
    const { userId } = auth()

    // Check if the user is authenticated
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    // Check if 'storeId' field is provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })

    // Delete the store record from the database
    await prismadb.store.delete({
      where: { id: params.storeId, userId },
    })

    // Return the success response
    return NextResponse.json("Store deleted.")
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[STORE_DELETE]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}
