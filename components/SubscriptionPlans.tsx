"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

interface Plan {
  id: string;
  name: string;
  price: number;
  priceId: string;
  features: string[];
}

const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 9.99,
    priceId: "price_your_basic_price_id", // Replace with actual Stripe price ID
    features: ["Feature 1", "Feature 2"]
  },
  {
    id: "premium",
    name: "Premium",
    price: 19.99,
    priceId: "price_your_premium_price_id", // Replace with actual Stripe price ID
    features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"]
  }
];

export default function SubscriptionPlans() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = (plan: Plan) => {
    setSelectedPlanId(plan.id);
    setShowEmailInput(true);
  };

  const handleCheckout = async () => {
    if (!email || !selectedPlanId) return;
    
    const plan = plans.find(p => p.id === selectedPlanId);
    if (!plan) return;
    
    setIsLoading(selectedPlanId);
    
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          priceId: plan.priceId,
          email: email 
        })
      });
      
      const { url } = await response.json();
      if (url) {
        router.push(url);
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div>
      {!showEmailInput ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-2xl font-bold">${plan.price}/month</p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span>✓</span> {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleSubscribe(plan)}
                disabled={isLoading === plan.id}
                className="mt-6 w-full"
              >
                {isLoading === plan.id ? "Processing..." : "Subscribe"}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto p-6 border rounded-lg shadow-sm">
          <h3 className="text-xl font-bold mb-4">Almost there!</h3>
          <p className="mb-4">Please enter your email to continue:</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full p-2 border rounded mb-4"
            required
          />
          <div className="flex gap-2">
            <Button onClick={() => setShowEmailInput(false)} variant="outline">
              Back
            </Button>
            <Button 
              onClick={handleCheckout}
              disabled={!email || isLoading !== null}
              className="flex-1"
            >
              {isLoading ? "Processing..." : "Continue to Checkout"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}