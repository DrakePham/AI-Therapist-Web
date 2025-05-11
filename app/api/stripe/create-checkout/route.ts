import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { stripe } from "@/utils/stripe";

export async function POST(req: Request) {
  try {
    const { priceId, email } = await req.json();
    
    // Check if we have a customer ID stored in cookies
    const cookieStore = cookies();
    let customerId = cookieStore.get('stripe_customer_id')?.value;
    
    // If no customer ID exists, create a new customer
    if (!customerId && email) {
      const customer = await stripe.customers.create({ email });
      customerId = customer.id;
      
      // Store customer ID in cookie for future use
      cookieStore.set('stripe_customer_id', customerId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
      });
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer: customerId,
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/pricing`,
      client_reference_id: customerId, // Store this to identify the customer later
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}