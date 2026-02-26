"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { createCheckoutSession } from "@/lib/stripe"
import { api } from "@/trpc/react"
import { Info, CreditCard, Coins, Sparkles, Loader2, RefreshCcw } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const BillingPage = () => {
    const { data: user, refetch, isRefetching } = api.project.getUserCredits.useQuery(undefined, {
        refetchOnWindowFocus: true
    })
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

                <div className="bg-white border border-blue-100 pl-4 pr-3 py-3 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-100 flex items-center justify-center shrink-0">
                        <Coins className="size-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Balance</p>
                        <p className="text-2xl font-black text-slate-900 leading-none mt-1">
                            {user?.credits ?? 0} <span className="text-sm font-medium text-slate-500">Credits</span>
                        </p>
                    </div>
                    <div className="h-10 w-px bg-slate-100 mx-1" />
                    <button
                        onClick={() => {
                            void refetch()
                            toast.success("Balance updated")
                        }}
                        disabled={isRefetching}
                        className={cn(
                            "p-2.5 rounded-xl hover:bg-slate-50 transition-all active:scale-90 cursor-pointer",
                            "text-slate-400 hover:text-blue-600",
                            isRefetching && "opacity-50"
                        )}
                        title="Refresh balance"
                    >
                        <RefreshCcw className={cn("size-4", isRefetching && "animate-spin")} />
                    </button>
                </div>
            </div>

            <div className="grid gap-6">
                <Card className="border-2 border-blue-50 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b">
                        <div className="flex items-center gap-2">
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