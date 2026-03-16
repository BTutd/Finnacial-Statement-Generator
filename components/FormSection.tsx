"use client"
import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}
export function FormSection({ title, icon, children }: FormSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <span className="text-accent">{icon}</span>
        <h3 className="font-display font-semibold text-foreground">{title}</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}
