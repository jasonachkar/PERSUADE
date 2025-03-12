import { Button } from "@/components/ui/button"

export default function Pricing() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-bold text-primary mb-8">Pricing</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow-md p-6 rounded-lg flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-primary mb-4">Free Plan</h2>
                    <p className="text-muted-foreground mb-4">$0/forever</p>
                    <ul className="list-disc list-inside text-muted-foreground mb-6">
                        <li>Access to AI professor</li>
                        <li>2 document uploads (total)</li>
                        <li>Basic question answering</li>
                    </ul>
                    <Button className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-4 rounded-md text-lg shadow-md hover:shadow-lg transition-all">
                        Start for Free
                    </Button>
                </div>
                <div className="bg-white shadow-md p-6 rounded-lg flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-primary mb-4">Basic Plan</h2>
                    <p className="text-muted-foreground mb-4">$9.99/month</p>
                    <ul className="list-disc list-inside text-muted-foreground mb-6">
                        <li>Access to AI professor</li>
                        <li>Basic question answering</li>
                        <li>7 document uploads per month</li>
                        <li>Standard response time</li>
                    </ul>
                    <Button className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-4 rounded-md text-lg shadow-md hover:shadow-lg transition-all">
                        Subscribe to Basic Plan
                    </Button>
                </div>
                <div className="bg-white shadow-md p-6 rounded-lg flex flex-col items-center border-2 border-primary">
                    <h2 className="text-2xl font-bold text-primary mb-4">Premium Plan</h2>
                    <p className="text-muted-foreground mb-4">$19.99/month</p>
                    <ul className="list-disc list-inside text-muted-foreground mb-6">
                        <li>Everything in Basic</li>
                        <li>Unlimited document uploads</li>
                        <li>Priority response time</li>
                        <li>Advanced quiz generation</li>
                        <li>Personalized learning paths</li>
                    </ul>
                    <Button className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-4 rounded-md text-lg shadow-md hover:shadow-lg transition-all">
                        Subscribe to Premium Plan
                    </Button>
                </div>
            </div>
        </main>
    )
}