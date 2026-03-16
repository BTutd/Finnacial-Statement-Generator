"use client"
import { DollarSign } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface CurrencyInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (Value: number) => void;
}

export function CurrencyInput({ id, label, value, onChange }: CurrencyInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 h-4 w-4  -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          type="number"
          value={value || ""}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="pl-9 bg-background border-input focus:ring-accent"
        />
      </div>
    </div>
  );
}
