"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
  const [status, setStatus] = useState("loading");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    // In a real app, you'd verify the session server-side
    // For now, we'll just assume success if there's a session ID
    setStatus("success");
  }, [sessionId]);

  return (
    <div className="container mx-auto py-12 px-4 text-center">
      {status === "loading" && <p>Loading...</p>}
      
      {status === "error" && (
        <div>
          <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-6">We couldn't process your subscription.</p>
          <Link href="/pricing">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Try Again
            </button>
          </Link>
        </div>
      )}
      
      {status === "success" && (
        <div>
          <h1 className="text-3xl font-bold mb-4">Thank you for subscribing!</h1>
          <p className="mb-6">Your subscription has been activated successfully.</p>
          <Link href="/">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Return to Home
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}