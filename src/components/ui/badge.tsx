import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-smooth focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 animate-fade-in",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-primary",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground hover:bg-accent",
        success: "border-transparent gradient-success text-success-foreground hover:shadow-success",
        warning: "border-transparent gradient-warning text-warning-foreground hover:shadow-warning",
        info: "border-transparent gradient-info text-info-foreground hover:shadow-info",
        purple: "border-transparent gradient-purple text-purple-foreground hover:shadow-purple",
        pink: "border-transparent gradient-pink text-pink-foreground hover:shadow-primary",
        orange: "border-transparent gradient-orange text-orange-foreground hover:shadow-warning",
        glass: "glass text-foreground border-white/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
