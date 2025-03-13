"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Pricing() {
    const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly')

    const plans = [
        {
            name: "Free Plan",
            price: { monthly: 0, yearly: 0 },
            description: "Perfect for trying out our AI professor",
            features: [
                "Access to AI professor",
                "2 document uploads (total)",
                "Basic question answering",
                "Community support"
            ],
            cta: "Start for Free",
            popular: false
        },
        {
            name: "Pro Plan",
            price: { monthly: 9.99, yearly: 99.99 },
            description: "Ideal for students and regular learners",
            features: [
                "Everything in Free",
                "7 document uploads per month",
                "Priority response time",
                "Advanced question answering",
                "Email support"
            ],
            cta: "Upgrade to Pro",
            popular: true
        },
        {
            name: "Premium Plan",
            price: { monthly: 19.99, yearly: 199.99 },
            description: "For power users who need unlimited access",
            features: [
                "Everything in Pro",
                "Unlimited document uploads",
                "Priority 24/7 support",
                "Advanced quiz generation",
                "Personalized learning paths",
                "Custom AI training"
            ],
            cta: "Get Premium",
            popular: false
        }
    ]

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                {/* Header Section */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Simple, transparent pricing
                    </h1>
                    <p className="text-xl text-gray-600">
                        No contracts. No surprise fees.
                    </p>

                    {/* Billing Toggle */}
                    <motion.div
                        className="mt-12 flex items-center justify-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <button
                            onClick={() => setBillingInterval('monthly')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingInterval === 'monthly'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingInterval('yearly')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingInterval === 'yearly'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Yearly
                            <span className="ml-1 text-xs text-emerald-500 font-semibold">
                                Save 15%
                            </span>
                        </button>
                    </motion.div>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {plans.map((plan) => (
                            <motion.div
                                key={plan.name}
                                className={`relative bg-white rounded-2xl p-8 ${plan.popular
                                        ? 'shadow-lg border-2 border-blue-600 transform hover:-translate-y-1'
                                        : 'shadow-sm border border-gray-200 hover:border-blue-600'
                                    } transition-all duration-300`}
                                {...fadeInUp}
                                transition={{ duration: 0.4 }}
                                whileHover={{ y: -8 }}
                            >
                                {plan.popular && (
                                    <motion.div
                                        className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        Most Popular
                                    </motion.div>
                                )}

                                <motion.h3
                                    className="text-xl font-semibold text-gray-900 mb-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    {plan.name}
                                </motion.h3>
                                <motion.div
                                    className="mb-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <span className="text-4xl font-bold">
                                        ${billingInterval === 'monthly'
                                            ? plan.price.monthly
                                            : plan.price.yearly}
                                    </span>
                                    <span className="text-gray-500">
                                        /{billingInterval === 'monthly' ? 'month' : 'year'}
                                    </span>
                                </motion.div>
                                <p className="text-gray-600 text-sm mb-6">
                                    {plan.description}
                                </p>
                                <div className="space-y-4 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <motion.div
                                            key={feature}
                                            className="flex items-center gap-3"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * i }}
                                        >
                                            <Check className="w-5 h-5 text-blue-600" />
                                            <span className="text-gray-600">{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>
                                <Button
                                    className={`w-full py-6 ${plan.popular
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
                                        }`}
                                >
                                    {plan.cta}
                                </Button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* FAQ Section */}
                <motion.div
                    className="mt-24"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="text-lg font-semibold mb-2">
                                How does billing work?
                            </h3>
                            <p className="text-gray-600">
                                We offer both monthly and yearly billing options. You can switch between plans at any time, and we&apos;ll prorate your charges accordingly.
                            </p>
                        </motion.div>
                        <motion.div
                            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="text-lg font-semibold mb-2">
                                Can I cancel my subscription?
                            </h3>
                            <p className="text-gray-600">
                                Yes, you can cancel your subscription at any time. You&apos;ll continue to have access to your plan until the end of your billing period.
                            </p>
                        </motion.div>
                        <motion.div
                            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="text-lg font-semibold mb-2">
                                What payment methods do you accept?
                            </h3>
                            <p className="text-gray-600">
                                We accept all major credit cards, PayPal, and bank transfers for yearly plans.
                            </p>
                        </motion.div>
                        <motion.div
                            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="text-lg font-semibold mb-2">
                                Do you offer refunds?
                            </h3>
                            <p className="text-gray-600">
                                We offer a 30-day money-back guarantee for all paid plans. No questions asked.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </main>
    )
}