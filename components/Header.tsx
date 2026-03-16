"use client";

import { FileText, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import UserMenu from "./UserMenu";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <header className="no-print border-b border-border bg-card">
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center justify-between">
          {/* logo and title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700">
              <FileText className="h-5 w-5 text-gray-200" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">FinanceFlow</h1>
              <p className="hidden text-sm text-muted-foreground sm:block">
                Professional Financial Statement Generator
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
