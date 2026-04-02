"use client";

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, User, BarChart3 } from "lucide-react";
import { SocialLoginButtons } from "./SocialLoginButton";

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

export function SignupForm({ onSwitchToLogin, onClose }: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Email/password sign-up
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
          data: { display_name: displayName },
        },
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
      }

      toast.success(
        "Signup successful! Check your email to confirm your account (or Magic Link)."
      );
      onClose();
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      toast.error("Enter your email to receive a magic link.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Magic link sent! Check your inbox.");
      }
    } catch (err) {
      console.error("Magic link error:", err);
      toast.error("Failed to send magic link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-accent to-accent/70 mb-4">
          <BarChart3 className="h-6 w-6 text-accent-foreground" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Create Account
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Start your free trial today
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="displayName"
              type="text"
              placeholder="Enter your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              minLength={6}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Must be at least 6 characters
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="mt-4 flex flex-col gap-2">
        <Button
          variant="outline"
          onClick={handleMagicLink}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending magic link...
            </>
          ) : (
            "Send Magic Link"
          )}
        </Button>

        <SocialLoginButtons />
      </div>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-accent hover:underline font-medium"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}