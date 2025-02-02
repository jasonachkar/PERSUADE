import { NextResponse } from "next/server"
import { createProduct, getProducts, deleteProduct } from "@/lib/kv"

export const dynamic = "force-dynamic" // Ensure fresh data on every request

export async function POST(req: Request) {
  try {
    const product = await req.json()

    if (!product.name || !product.imageUrl || !product.description) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const newProduct = await createProduct(product)
    return NextResponse.json(newProduct)
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    await deleteProduct(id)
    const updatedProducts = await getProducts() // Fetch updated list

    return NextResponse.json(updatedProducts) // Return updated list
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}

