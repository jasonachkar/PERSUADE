import { NextResponse } from "next/server"
import { createProduct, getProducts, deleteProduct } from "@/lib/kv"

export const dynamic = "force-dynamic" // Ensure fresh data on every request

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const imageFile = formData.get("image") as File | null

    if (!name || !description) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    let imageBuffer: ArrayBuffer | null = null;
    let imageType: string = "";

    if (imageFile) {
      imageBuffer = await imageFile.arrayBuffer();
      imageType = imageFile.type || "";
    }

    const product = {
      name,
      description,
      image: imageBuffer ? { type: imageType, data: Array.from(new Uint8Array(imageBuffer)) } : null,
    };

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

