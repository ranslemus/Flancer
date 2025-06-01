"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@/app/lib/supabase/client";
import { signIn } from "@/app/lib/supabase/actions";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [supabase, setSupabase] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const client = createClient();
    setSupabase(client);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = await signIn(formData);
    console.log("SignIn Result:", result)

    if (result?.error) {
      setFormError(result.error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: result.error,
      });
      return;
    }

    router.refresh();
    router.push("/job-list");
  };

  return (
    <div className="flex justify-center mt-24 px-4">
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-xs">
        <h1 className="text-2xl font-medium mb-2">Sign in</h1>
        <p className="text-sm text-foreground mb-6">
          Don&apos;t have an account?{" "}
          <Link className="text-primary font-medium underline" href="/auth/register">
            Sign up
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
            name="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>
    </div>
  );
}
