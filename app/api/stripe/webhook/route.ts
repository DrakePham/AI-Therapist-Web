import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/utils/stripe";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature")!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    // Handle subscription events
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // In a production app, you would store this in a database
        // For now, we'll just log the info
        console.log(`Subscription event for customer ${customerId}: ${event.type}`);
        console.log(`Subscription status: ${subscription.status}`);
        console.log(`Subscription ID: ${subscription.id}`);
        
        // When you add authentication, you'd update the user's subscription status here
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// For Stripe webhooks, we need to disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};