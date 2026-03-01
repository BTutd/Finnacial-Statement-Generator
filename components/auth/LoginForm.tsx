"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Loader2, Mail, Lock, BarChart3 } from "lucide-react";
import { SocialLoginButtons } from "./SocialLoginButton";

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
  onClose: () => void;
}

export function LoginForm({onSwitchToSignup,onSwitchToForgotPassword,onClose,}: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome back!");
        onClose(); // close modal first
        router.push("/dashboard"); // then navigate
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-accent to-accent/70 mb-4">
          <BarChart3 className="h-6 w-6 text-accent-foreground" />
        </div>

        <h2 className="font-display text-2xl font-bold text-foreground">
          Welcome Back
        </h2>

        <p className="text-sm text-muted-foreground mt-1">
          Sign in to your account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>

            <button
              type="button"
              onClick={onSwitchToForgotPassword}
              className="text-xs text-accent hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {/* Social Login */}
      <div className="mt-4">
        <SocialLoginButtons />
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">
          Don't have an account?{" "}
        </span>

        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-accent hover:underline font-medium"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}