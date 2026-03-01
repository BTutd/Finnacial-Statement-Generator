"use client";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthModal } from "@/components/auth/AuthModal"
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  FileText,
  Moon,
  PieChart,
  Shield,
  Sparkle,
  Sparkles,
  Sun,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Animation Configs
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.15 } },
};

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const features = [
  {
    icon: FileText,
    title: "Financial Statement",
    description:
      "Generate professional income statements, balance sheets, and cash flow statements instantly.",
  },
  {
    icon: PieChart,
    title: "Visual Analytics",
    description:
      "Beautiful charts and graphs to visualize your financial data at a glance.",
  },
  {
    icon: Sparkles,
    title: "AI Prediction",
    description:
      "Leverage AI to predict future financial performance and optimize decisions.",
  },
  {
    icon: TrendingUp,
    title: "Smart Forecasting",
    description:
      "Advanced forecasting tools to plan ahead with confidence and precision.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your financial data is encrypted and protected with enterprise-grade security.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Generate reports in seconds, not hours. Save time and boost productivity.",
  },
];

export default function LandingPage() {
  const router = useRouter()
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

 useEffect(()=>{
  const {data: {subscription},} =supabase.auth.onAuthStateChange((event,session)=>{
    if(session){
      router.push('/dashboard')
    }
  });
  supabase.auth.getSession().then(({data: {session}})=>{
    if(session){
      router.push('/')
    }
  })
  return () =>subscription.unsubscribe();
 },[router])

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const openLogin = () => {
    setAuthMode("login");
    setIsAuthOpen(true);
  };
  const openSignup = () => {
    setAuthMode("signup");
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-background  overflow-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="h-10 w-10 rounded-xl bg-linear-to-br from-accent to-accent/70 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-accent-foreground" />
            </div>
            <span className="font-display text-xl font-bold">FinanceFlow</span>
          </motion.div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Moved Here */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" onClick={openLogin}>
              Log in
            </Button>
            <Button
              className="gap-2 bg-primary text-primary-foreground"
              onClick={openSignup}
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-4xl mx-auto"
          >
            {/* Badge Fix */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6 border border-accent/20"
            >
              <Sparkle className="h-4 w-4" />
              <span className="text-sm font-medium">
                AI-Powered Financial Intelligence
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-7xl font-bold  leading-tight"
            >
              Transform Your <br />
              <span className="text-emerald-500">
                Financial Data
              </span> <br /> Into Insights
            </motion.h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Generate professional financial statements, analyze trends with
              AI, and forecast your business future.
            </p>

            <div className="flex justify-center gap-4">
              <Button
                size="xl"
                onClick={openSignup}
                className="bg-primary text-primary-foreground"
              >
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="xl" variant="outline" onClick={openLogin}>
                Sign In
              </Button>
            </div>
          </motion.div>

          {/* Floating Dashboard */}
          <motion.div
            className="mt-20 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              className="rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
              {...floatingAnimation}
            >
              <div className="p-6 border-b border-border bg-muted/50 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
              </div>
              <div className="p-8 bg-linear-to-b from-card to-background">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  <div className="p-6 rounded-xl bg-background border border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <TrendingUp className="h-5 w-5 text-accent" />
                      </div>
                      <span className="font-medium">Revenue</span>
                    </div>
                    <p className="text-3xl font-bold">$2.4M</p>
                    <p className="text-sm mt-1 text-accent">
                      +12.5% vs last month
                    </p>
                  </div>
                  {/* Card 2 */}
                  <div className="p-6 rounded-xl bg-background border border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">Net Income</span>
                    </div>
                    <p className="text-3xl font-bold">$890k</p>
                    <p className="text-sm mt-1 text-accent">
                      +8.3% vs last month
                    </p>
                  </div>
                  {/* Card 3 */}
                  <div className="p-6 rounded-xl bg-background border border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-warning/10">
                        <PieChart className="h-5 w-5 text-accent" />
                      </div>
                      <span className="font-medium">Profit Margin</span>
                    </div>
                    <p className="text-3xl font-bold">37.1%</p>
                    <p className="text-sm mt-1 text-accent">Above average</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful tools to analyze, predict, and optimize your financial
              performance
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-card border border-border hover:border-accent/50 transition-colors shadow-sm"
              >
                <div className="p-3 rounded-lg bg-accent/10 w-fit mb-6">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-accent/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Transform Your Finances?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Join thousands of businesses making smarter financial decisions
              with FinanceFlow.
            </p>
            <Button size="xl" onClick={openSignup} className="gap-2">
              Get Started for Free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
      <footer className="py-12 border-t border-border bg-card">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 FinanceFlow. All Rights Reserved.</p>
        </div>
      </footer>
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultMode={authMode}
      />
    </div>
  );
}
