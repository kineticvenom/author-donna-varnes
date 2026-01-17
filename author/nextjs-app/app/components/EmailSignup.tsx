"use client";

import { useState } from "react";

interface EmailSignupProps {
  variant?: "default" | "footer";
}

export default function EmailSignup({ variant = "default" }: EmailSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    // TODO: Integrate with email service (Mailchimp, ConvertKit, etc.)
    // For now, simulate a successful submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");
    setEmail("");
  };

  if (variant === "footer") {
    return (
      <div className="w-full max-w-md">
        <h4 className="font-serif text-lg text-cream-50 mb-2">Let&apos;s Stay Connected</h4>
        <p className="text-cream-300 text-sm mb-4">
          Quiet encouragement for your inbox.
        </p>
        {status === "success" ? (
          <p className="text-gold-400 text-sm">Thank you for joining!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              className="flex-1 px-3 py-2 rounded bg-brown-700 border border-brown-600 text-cream-100 placeholder-cream-400 text-sm focus:outline-none focus:border-gold-400"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white text-sm font-semibold rounded transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "..." : "Join"}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <section className="bg-cream-100 py-16">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-brown-800 mb-4">
          Let&apos;s Stay Connected
        </h2>
        <p className="text-brown-600 mb-8 leading-relaxed">
          Get quiet encouragement delivered to your inbox. Each week, I share a short
          reflection on finding God in the wilderness seasons of life—plus updates on
          new books and resources.
        </p>
        {status === "success" ? (
          <p className="text-sage-600 font-semibold">
            Thank you for joining! Check your inbox soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              className="flex-1 px-4 py-3 rounded-lg border border-cream-300 bg-white text-brown-700 placeholder-brown-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {status === "loading" ? "Joining..." : "Join Me"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="mt-4 text-red-600 text-sm">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}
