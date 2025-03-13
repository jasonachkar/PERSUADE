"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import type { Product } from "@/lib/kv"

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/products", {
          next: { revalidate: 0 }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        if (Array.isArray(data)) {
          setProducts(data)
        } else {
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
      } else {
        const refreshedProducts = await fetch("/api/products").then(res => res.json())
        setProducts(refreshedProducts)
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      setError("Failed to delete product")
    }
  }

  const getImageSource = (product: Product) => {
    if (product.image) {
      const imageType = product.image.type
      const imageData = product.image.data
      const base64Image = Buffer.from(imageData).toString('base64')
      return `data:${imageType};base64,${base64Image}`
    }
    return "/placeholder.svg?height=200&width=200"
  }

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold text-gray-800">Products & Services</CardTitle>
        <Link href="/add-product">
          <Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-200 shadow-sm hover:shadow-md">
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
          <div className="relative group">
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-0"
              disabled={isLoading}
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 pb-4 px-1 snap-x snap-mandatory scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="flex-none w-[300px] overflow-hidden snap-center bg-white hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-primary/20"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={getImageSource(product)}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-200 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-destructive transition-colors duration-200"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-0"
              disabled={isLoading}
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

