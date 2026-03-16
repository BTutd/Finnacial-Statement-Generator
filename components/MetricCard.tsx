import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'accent';
}

export function MetricCard({ label, value, icon, variant = 'default' }: MetricCardProps) {
  return (
    <div className={cn(
      "rounded-lg p-4 shadow-soft transition-all duration-200 hover:shadow-elevated",
      variant === 'default' && "bg-card border border-border",
      variant === 'success' && "bg-success/10 border border-success/20",
      variant === 'warning' && "bg-warning/10 border border-warning/20",
      variant === 'accent' && "bg-accent/10 border border-accent/20"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          variant === 'default' && "bg-secondary text-foreground",
          variant === 'success' && "bg-success/20 text-success",
          variant === 'warning' && "bg-warning/20 text-warning",
          variant === 'accent' && "bg-accent/20 text-accent"
        )}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className={cn(
            "font-display text-lg font-bold",
            variant === 'success' && "text-success",
            variant === 'warning' && "text-warning",
            variant === 'accent' && "text-accent"
          )}>{value}</p>
        </div>
      </div>
    </div>
  );
}
