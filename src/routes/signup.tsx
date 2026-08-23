import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Mail, Lock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

import { supabase, signUpLocalUser, isUsernameTaken } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — Chronos" }] }),
  component: Signup,
});

function Signup() {
  const router = useRouter();
  const { refreshSession } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Username availability state
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");

  // Password validation
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber;

  // Debounced username availability check
  const checkUsername = useCallback((value: string) => {
    const clean = value.trim().toLowerCase();
    if (!clean || clean.length < 3) {
      setUsernameStatus("idle");
      return;
    }
    if (!/^[a-z0-9_]{3,20}$/.test(clean)) {
      setUsernameStatus("invalid");
      return;
    }
    setUsernameStatus("checking");
    // Small delay to simulate async and debounce rapid typing
    const timer = setTimeout(() => {
      const taken = isUsernameTaken(clean);
      setUsernameStatus(taken ? "taken" : "available");
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cleanup = checkUsername(username);
    return cleanup;
  }, [username, checkUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(cleanUsername)) {
      setError("Usernames are 3–20 characters: lowercase letters, numbers, and underscores.");
      return;
    }

    if (usernameStatus === "taken") {
      setError("That username is already taken. Please choose another one.");
      return;
    }

    if (!isPasswordValid) {
      setError("Password must be at least 8 characters and contain both letters and numbers.");
      return;
    }

    setLoading(true);

    // Try Supabase auth first (wrapped in try/catch in case the client is misconfigured)
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username: cleanUsername, display_name: cleanUsername } },
      });

      if (!signUpError && signUpData?.session) {
        await refreshSession();
        setLoading(false);
        router.navigate({ to: "/global" });
        return;
      }
    } catch {
      // Supabase call failed — fall through to local auth
    }

    // Always create local fallback user if Supabase hits rate limit, email confirmation, or error
    const localRes = signUpLocalUser({
      email,
      password,
      username: cleanUsername,
      display_name: cleanUsername,
    });

    setLoading(false);

    if (localRes.error) {
      setError(localRes.error.message);
      return;
    }

    if (localRes.session) {
      await refreshSession();
      router.navigate({ to: "/global" });
      return;
    }

    setError("Failed to create account. Please try again.");
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
        <h1 className="mt-6 text-3xl leading-tight">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Write letters, follow people, and keep it as private as you like.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          {/* Username field with availability indicator */}
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="jane_doe"
                required
                className="rounded-xl pr-10"
              />
              {username.trim().length >= 3 && (
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                  {usernameStatus === "checking" && (
                    <span className="block size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                  )}
                  {usernameStatus === "available" && (
                    <CheckCircle2 className="size-4 text-emerald-500" />
                  )}
                  {usernameStatus === "taken" && (
                    <XCircle className="size-4 text-destructive" />
                  )}
                  {usernameStatus === "invalid" && (
                    <AlertCircle className="size-4 text-amber-500" />
                  )}
                </span>
              )}
            </div>
            {usernameStatus === "taken" && (
              <p className="text-xs text-destructive">This username is already taken.</p>
            )}
            {usernameStatus === "available" && (
              <p className="text-xs text-emerald-600">Username is available!</p>
            )}
            {usernameStatus === "invalid" && (
              <p className="text-xs text-amber-600">3–20 characters: lowercase letters, numbers, underscores only.</p>
            )}
          </div>

          {/* Email field */}
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

          {/* Password field with requirements */}
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              className="rounded-xl"
            />
            {password.length > 0 && (
              <ul className="mt-1.5 space-y-0.5 text-xs">
                <li className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-600" : "text-muted-foreground"}`}>
                  {hasMinLength ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
                  At least 8 characters
                </li>
                <li className={`flex items-center gap-1.5 ${hasLetter ? "text-emerald-600" : "text-muted-foreground"}`}>
                  {hasLetter ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
                  Contains letters (a-z)
                </li>
                <li className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-600" : "text-muted-foreground"}`}>
                  {hasNumber ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
                  Contains numbers (0-9)
                </li>
              </ul>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            disabled={loading || usernameStatus === "taken" || usernameStatus === "invalid" || !isPasswordValid}
            className="w-full rounded-full"
          >
            <Lock className="size-4" strokeWidth={1.75} />
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
