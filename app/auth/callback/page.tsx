"use client"
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        toast.error("AuthenticatioN failed");
        router.replace("/");
        return;
      }
      if (session) {
        toast.success("Successfully signed in");
        router.replace("/dashboard");
      }
    };
    handleAuth();
  }, [router]);

  return <></>;
}
