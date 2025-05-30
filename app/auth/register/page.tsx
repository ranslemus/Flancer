"use client";

import { useState, useEffect } from "react";
import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function Signup({ searchParams }: { searchParams: Promise<Message> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<Message | null>(null);

  // Resolve searchParams once when component mounts
  useEffect(() => {
    searchParams.then(setMessage).catch(() => {});
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    await signUpAction(formData);
  };

  if (message && "message" in message) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={message} />
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-24 px-4">
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-xs">
        <h1 className="text-2xl font-medium mb-2">Sign up</h1>
        <p className="text-sm text-foreground mb-6">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            type="password"
            name="confirm-password"
            placeholder="Re-enter your password"
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <SubmitButton pendingText="Signing up...">Sign up</SubmitButton>
          {message && <FormMessage message={message} />}
        </div>
      </form>
    </div>
  );
}
