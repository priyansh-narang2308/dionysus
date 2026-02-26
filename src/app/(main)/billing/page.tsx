"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { createCheckoutSession } from "@/lib/stripe"
import { api } from "@/trpc/react"
import { Info, CreditCard, Coins, Sparkles, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const BillingPage = () => {
    const { data: user } = api.project.getUserCredits.useQuery()
    const [creditsToBuy, setCreditsToBuy] = useState([100])
    const [loading, setLoading] = useState(false)
    const creditsToBuyAmount = creditsToBuy[0]!
    const price = (creditsToBuyAmount / 50).toFixed(2)

    const handleCheckout = async () => {
        setLoading(true)
        try {
            const url = await createCheckoutSession(creditsToBuyAmount)
            if (url) {
                window.location.href = url
            } else {
                toast.error("Failed to create checkout session")
            }
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
                    <p className="text-muted-foreground">Manage your credits and subscription</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Coins className="size-5 text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Balance</p>
                        <p className="text-xl font-bold text-blue-900">{user?.credits ?? 0} Credits</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                <Card className="border-2 border-blue-50 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-5 text-blue-600" />
                            <CardTitle>Buy Credits</CardTitle>
                        </div>
                        <CardDescription>
                            Slide to choose how many credits you need for your projects.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="py-10">
                        <div className="flex flex-col items-center justify-center mb-8">
                            <span className="text-5xl font-extrabold text-slate-900">
                                {creditsToBuyAmount}
                            </span>
                            <span className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest">
                                Credits
                            </span>
                        </div>

                        <div className="px-8">
                            <Slider
                                defaultValue={[100]}
                                max={1000}
                                step={5}
                                min={25}
                                onValueChange={(value) => setCreditsToBuy(value)}
                                value={creditsToBuy}
                                className="cursor-pointer"
                            />
                            <div className="flex justify-between mt-4 text-xs font-medium text-slate-400">
                                <span>25 Credits ($0.50)</span>
                                <span>1,000 Credits ($20.00)</span>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="bg-slate-50/50 border-t p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between w-full">
                            <div className="text-sm">
                                <span className="text-slate-500">Total Price:</span>
                                <span className="ml-2 font-bold text-lg">${price}</span>
                            </div>
                            <Button
                                size="lg"
                                onClick={handleCheckout}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 shadow-indigo-200 shadow-lg px-8 transition-all active:scale-95 cursor-pointer disabled:opacity-70"
                            >
                                {loading ? (
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                ) : (
                                    <CreditCard className="mr-2 size-4" />
                                )}
                                {loading ? "Redirecting..." : "Checkout Now"}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>

                <div className="bg-blue-50/50 p-2 rounded-xl border border-blue-100 flex gap-4">
                    <div className="bg-blue-100 p-2 h-fit rounded-full">
                        <Info className="size-4 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-blue-900">How do credits work?</p>
                        <p className="text-sm text-blue-700/80 leading-relaxed">
                            Each credit allows you to index 1 file in a repository.
                            For example, if your project has 100 files, you will need 100 credits to index it successfully.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BillingPage