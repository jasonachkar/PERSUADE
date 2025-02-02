"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Plus, Trash2 } from "lucide-react"
import type { Product } from "@/lib/kv"

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/products")
        console.log("API Response status:", response.status)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const text = await response.text()
        console.log("Raw API response:", text)

        const data = JSON.parse(text)
        console.log("Parsed products:", data)

        if (Array.isArray(data)) {
          setProducts(data)
        } else {
          console.error("Unexpected data format:", data)
          setError("Received invalid data format from server")
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        setError("Failed to load products")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedProducts = await response.json()
      if (Array.isArray(updatedProducts)) {
        setProducts(updatedProducts)
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      setError("Failed to delete product")
    }
  }

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Products & Services</CardTitle>
        <Link href="/add-product">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No products available. Add your first product!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={product.imageUrl || "/placeholder.svg?height=200&width=200"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive/90"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

