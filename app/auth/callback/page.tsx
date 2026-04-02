"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // Only run on client
      if (typeof window === "undefined") return;

      try {
        // Supabase OAuth flow automatically updates session from URL
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          toast.success("Successfully signed in");
          router.replace("/dashboard");
        } else {
          router.replace("/");
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        toast.error("Authentication failed");
        router.replace("/");
      }
    };

    handleAuth();
  }, [router]);

  return null;
}