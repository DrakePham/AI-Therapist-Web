import Stripe from 'stripe';
import { cookies } from 'next/headers';

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Get or create customer ID from cookies
export const getOrCreateCustomerId = async (email: string): Promise<string> => {
  const cookieStore = cookies();
  const customerId = cookieStore.get('stripe_customer_id')?.value;
  
  if (customerId) {
    return customerId;
  }
  
  // Create new customer in Stripe
  const customer = await stripe.customers.create({
    email,
  });
  
  // Store in cookies (will move to DB with auth later)
  cookieStore.set('stripe_customer_id', customer.id, { 
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  });
  
  return customer.id;
};

// Store subscription data in cookies temporarily
export const storeSubscriptionData = (subscriptionId: string, status: string) => {
  const cookieStore = cookies();
  cookieStore.set('subscription_id', subscriptionId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  });
  
  cookieStore.set('subscription_status', status, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  });
};