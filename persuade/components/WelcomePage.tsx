"use client"

import { Button } from "@/components/ui/button"
import { useAuth, SignUpButton } from "@clerk/nextjs"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function WelcomePage() {
    const { isSignedIn } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isSignedIn) {
            router.push('/dashboard')
        }
    }, [isSignedIn, router])

    const features = [
        {
            title: "Scenario-Based Training",
            description: "Practice with AI-powered simulations of real customer interactions across various industries",
            icon: CheckCircle2
        },
        {
            title: "Real-Time Feedback",
            description: "Receive instant feedback on your communication skills, sales techniques, and customer handling",
            icon: CheckCircle2
        },
        {
            title: "Performance Analytics",
            description: "Track your progress with detailed metrics and identify areas for improvement in your sales approach",
            icon: CheckCircle2
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center mb-8">
                                <Image
                                    src="/logo.svg"
                                    alt="PERSUADE Logo"
                                    width={40}
                                    height={40}
                                    className="w-10 h-10"
                                />
                                <span className="ml-3 text-2xl font-bold text-gray-900">PERSUADE</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
                                Master Sales Calls,
                                <br />
                                <span className="text-blue-600">Risk-Free</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8">
                                Practice sales and customer service calls with our AI-powered voice simulator.
                                Perfect your pitch, handle objections, and boost your confidence in a safe environment.
                            </p>
                            <SignUpButton mode="modal">
                                <Button size="lg" className="h-14 px-8 text-lg">
                                    Start Training Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </SignUpButton>
                        </div>
                        <div className="relative h-[400px] lg:h-[500px]">
                            <Image
                                src="/hero-image.svg"
                                alt="Sales Training Illustration"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Train Like It&apos;s Real
                        </h2>
                        <p className="text-xl text-gray-600">
                            Practice with our AI voice bot that simulates real customer interactions
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <div key={feature.title}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100
                                hover:border-blue-600 hover:shadow-md transition-all duration-300">
                                <feature.icon className="w-12 h-12 text-blue-600 mb-6" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            How PERSUADE Works
                        </h2>
                        <p className="text-xl text-gray-600">
                            Choose your scenario, practice your calls, and improve with instant feedback
                        </p>
                    </div>

                    <div className="relative h-[600px] rounded-2xl overflow-hidden border border-gray-200">
                        <Image
                            src="/demo-screenshot.png"
                            alt="Product Demo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-2">
                            <div className="flex items-center mb-4">
                                <Image
                                    src="/logo.svg"
                                    alt="PERSUADE Logo"
                                    width={32}
                                    height={32}
                                    className="w-8 h-8"
                                />
                                <span className="ml-2 text-xl font-bold text-gray-900">PERSUADE</span>
                            </div>
                            <p className="text-gray-600">
                                Level up your sales and customer service skills with AI-powered voice training simulations.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-600 hover:text-blue-600">Features</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-blue-600">Pricing</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-blue-600">Use Cases</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-600 hover:text-blue-600">About</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-blue-600">Blog</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-blue-600">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}