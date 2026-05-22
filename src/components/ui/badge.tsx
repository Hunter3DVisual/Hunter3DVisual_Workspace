import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/20 text-primary hover:bg-primary/30",
        secondary:
          "border-transparent bg-hunter-elevated text-muted-foreground",
        destructive:
          "border-transparent bg-destructive/20 text-red-400",
        outline: "text-foreground border-hunter-border",
        gold: "border-transparent bg-gold/20 text-gold",
        success: "border-transparent bg-emerald-500/20 text-emerald-400",
        warning: "border-transparent bg-amber-500/20 text-amber-400",
        info: "border-transparent bg-blue-500/20 text-blue-400",
        // Project status
        brief: "border-transparent bg-slate-500/20 text-slate-400",
        concept: "border-transparent bg-violet-500/20 text-violet-400",
        modeling: "border-transparent bg-blue-500/20 text-blue-400",
        lighting: "border-transparent bg-amber-500/20 text-amber-400",
        rendering: "border-transparent bg-orange-500/20 text-orange-400",
        post: "border-transparent bg-pink-500/20 text-pink-400",
        review: "border-transparent bg-purple-500/20 text-purple-400",
        delivered: "border-transparent bg-emerald-500/20 text-emerald-400",
        archived: "border-transparent bg-gray-500/20 text-gray-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
