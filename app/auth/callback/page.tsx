"use client"

import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner";

export default function AuthCallback() {
    const router = useRouter();

    useEffect(()=>{
        const handleAuth = async ()=>{
            const { data, error } = await supabase.auth.getSession();
            if(error){
                toast.error("AuthenticatioN failed")
                router.push("/")
                return;
            }
            if(data.session){
                toast.success("Successfully signed in");
                router.push("/dashboard");
            }
        };
        handleAuth()
    },[router])
    
    return(
        <></>
    )
}