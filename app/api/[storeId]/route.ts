import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"

type Params = { params: { storeId: string } }

// Handler function for retrieving a specific store
export async function GET(req: Request, { params }: Params) {
  try {
    // Check if storeId parameter is provided
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 })

    // Retrieve the specific store from the database based on storeId
    const store = await prismadb.store.findUnique({
      where: { id: params.storeId },
    })

    // Return the retrieved store as JSON response
    return NextResponse.json(store)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[STORE_GET]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}
