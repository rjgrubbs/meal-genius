import { NextResponse } from "next/server"
import { createCheckoutSession } from "@/lib/subscription"
import { STRIPE_PRICE_IDS } from "@/lib/stripe"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { planType } = body

    // Validate plan type
    if (planType !== "monthly" && planType !== "annual") {
      return NextResponse.json({ error: "Invalid plan type" }, { status: 400 })
    }

    // Get appropriate price ID
    const priceId = STRIPE_PRICE_IDS[planType]

    // Create checkout session
    const session = await createCheckoutSession(priceId, planType)

    return NextResponse.json({
      url: session.url,
    })
  } catch (error: any) {
    console.error("Checkout session error:", error.message)
    return NextResponse.json({ error: error.message || "Failed to create checkout session" }, { status: 500 })
  }
}

