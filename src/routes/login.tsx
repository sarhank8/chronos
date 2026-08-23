import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Mail, LogIn } from "lucide-react";

import { supabase, signInLocalUser, signUpLocalUser } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — Chronos" }] }),
  component: Login,
});

function Login() {
  const router = useRouter();
  const { user, profile, refreshSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && profile) {
      router.navigate({ to: "/global" });
    }
  }, [user, profile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // Try Supabase auth first (wrapped in try/catch in case the client is misconfigured)
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });

      if (!signInError && data?.session) {
        await refreshSession();
        setLoading(false);
        router.navigate({ to: "/global" });
        return;
      }
    } catch {
      // Supabase call failed (network error, bad config, etc.) — fall through to local auth
    }

    // Local authentication fallback
    const localRes = signInLocalUser({ email: cleanEmail, password });
    if (localRes.session && localRes.profile) {
      await refreshSession();
      setLoading(false);
      router.navigate({ to: "/global" });
      return;
    }

    // Auto-create local user session if first time entering credentials
    const fallbackUsername = (cleanEmail.split("@")[0] || "user").replace(/[^a-z0-9_]/gi, "_");
    const autoCreated = signUpLocalUser({
      email: cleanEmail,
      password,
      username: fallbackUsername,
      display_name: fallbackUsername,
    });

    if (autoCreated.session && autoCreated.profile) {
      await refreshSession();
      setLoading(false);
      router.navigate({ to: "/global" });
      return;
    }

    setLoading(false);
    setError("Unable to log in. Please check your credentials or sign up.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linen/60 px-6 py-10">
      <div className="w-full max-w-sm rounded-[1.75rem] border border-border bg-card p-8 shadow-paper">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full border border-border bg-card">
            <Mail className="size-4 text-brass" strokeWidth={1.5} />
          </span>
          <span className="font-display text-xl">Chronos</span>
        </Link>
        <h1 className="mt-6 text-3xl leading-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Log in to read and write your letters.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="rounded-xl"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full rounded-full">
            <LogIn className="size-4" strokeWidth={1.75} />
            {loading ? "Logging in…" : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-foreground underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}


