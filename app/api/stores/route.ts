import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

// Define the expected JSON body for the request
interface StoreRequest extends Request {
  json: () => Promise<{ name: string }>
}

export async function POST(req: StoreRequest) {
  try {
    // Authenticate the user using Clerk
    const { userId } = auth()

    // Check if the user is authenticated
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    // Extract the 'name' field from the request body
    const { name } = await req.json()

    // Check if 'name' field is provided
    if (!name) return new NextResponse("Name is required", { status: 400 })

    // Create a new store record in the database
    const store = await prismadb.store.create({ data: { name, userId } })
    const storesCount = await prismadb.store.count()

    // Return the newly created store record
    return NextResponse.json({ ...store, storesCount })
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[STORES_POST]", error)

    // Return an internal error response
    return new NextResponse("Internal Error", { status: 500 })
  }
}
