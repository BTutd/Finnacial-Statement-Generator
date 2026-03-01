"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft, BarChart3 } from "lucide-react";

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

export function ForgetPasswordForm({ onSwitchToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setEmailSent(true);
        toast.success("Password reset email sent!");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-accent to-accent/70 mb-4">
            <Mail className="h-6 w-6 text-accent-foreground" />
          </div>

          <h2 className="text-2xl font-bold text-foreground">
            Check Your Email
          </h2>

          <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
            We've sent a reset link to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={onSwitchToLogin}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Button>
      </div>
    );
  }

  // ===== DEFAULT VIEW =====
  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-accent to-accent/70 mb-4">
          <BarChart3 className="h-6 w-6 text-accent-foreground" />
        </div>

        <h2 className="text-2xl font-bold text-foreground">
          Reset Password
        </h2>

        <p className="text-sm text-muted-foreground mt-1">
          Enter your email to receive a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sm text-accent hover:underline font-medium inline-flex items-center gap-1"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Sign In
        </button>
      </div>
    </div>
  );
}