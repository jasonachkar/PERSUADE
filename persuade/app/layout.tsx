import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"
import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Sales Training Simulator",
  description: "Interactive sales call simulation for training",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-gray-100`}>
          <header className="sticky top-0 z-50 w-full bg-white border-b">
            {/* Added mx-auto and px-4 to the container to keep content from touching the edges */}
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold">
                  PERSUADE
                </Link>
              </div>

              <nav className="hidden md:flex items-center space-x-6">
                <Link
                  href="/platform"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Platform
                </Link>
                <Link
                  href="/resources"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Resources
                </Link>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  About Us
                </Link>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/pricing"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Pricing
                </Link>
              </nav>

              <div className="flex items-center space-x-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      className="px-4 py-2 text-base font-medium rounded-md hover:bg-gray-200"
                    >
                      Log in
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button
                      variant="default"
                      className="px-4 py-2 text-base font-medium rounded-md bg-[#3b5aef] hover:bg-[#2b3fd1] text-white"
                    >
                      Sign up
                    </Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 rounded-full",
                      },
                    }}
                  />
                </SignedIn>
              </div>
            </div>
          </header>
          <main className="container py-6">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}
