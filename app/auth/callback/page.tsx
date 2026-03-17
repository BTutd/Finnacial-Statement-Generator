"use client";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // Check if this is an auth callback (has auth params) or direct navigation
      const urlParams = new URLSearchParams(window.location.search);
      const hasAuthParams =
        urlParams.has("code") ||
        urlParams.has("state") ||
        urlParams.has("error");

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        toast.error("Authentication failed");
        router.replace("/");
        return;
      }

      if (session) {
        // If this is a direct navigation (back button), check if user is already on dashboard
        if (!hasAuthParams && window.location.pathname === "/auth/callback") {
          // User pressed back button, redirect to dashboard without adding to history
          window.location.href = "/dashboard";
          return;
        }
        toast.success("Successfully signed in");
        router.replace("/dashboard");
      } else {
        router.replace("/");
      }
    };
    handleAuth();
  }, [router]);

  return <></>;
}
