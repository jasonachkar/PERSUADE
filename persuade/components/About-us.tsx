"use client"

import { Brain, Target, Users, BarChart2, Shield, Clock } from "lucide-react"
import Image from "next/image"

export default function AboutUs() {
    const features = [
        {
            title: "AI-Powered Learning",
            description: "Our advanced AI technology creates realistic customer interactions, adapting to your responses and providing personalized feedback.",
            icon: Brain
        },
        {
            title: "Focused Training",
            description: "Practice specific scenarios tailored to your industry and goals, from basic sales calls to complex negotiations.",
            icon: Target
        },
        {
            title: "Community Driven",
            description: "Join a community of professionals committed to improving their sales and customer service skills.",
            icon: Users
        },
        {
            title: "Data-Driven Insights",
            description: "Track your progress with detailed analytics and identify areas for improvement in your communication style.",
            icon: BarChart2
        },
        {
            title: "Safe Environment",
            description: "Learn and make mistakes without real-world consequences, building confidence through practice.",
            icon: Shield
        },
        {
            title: "Flexible Learning",
            description: "Practice at your own pace, anytime, anywhere, with our convenient online platform.",
            icon: Clock
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
                                Transforming Sales Training
                                <br />
                                <span className="text-blue-600">Through AI</span>
                            </h1>
                            <p className="text-xl text-gray-600">
                                PERSUADE is revolutionizing how professionals develop their sales and customer service skills.
                                Our AI-powered platform provides realistic, interactive training that helps you master the art of persuasion.
                            </p>
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

            {/* Mission Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Our Mission
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            To democratize access to high-quality sales training by leveraging cutting-edge AI technology.
                            We believe everyone deserves the opportunity to develop their skills and reach their full potential.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Why Choose PERSUADE?
                        </h2>
                        <p className="text-xl text-gray-600">
                            Experience the future of sales training with our comprehensive platform
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                Empowering professionals with AI-powered sales training for better results.
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