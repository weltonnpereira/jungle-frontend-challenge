import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/src/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold tracking-wider uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-[#E0A96D]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#E0A96D] text-[#0D0B0A]",
        secondary:
          "border-[#342921] bg-[#1E1814] text-[#E0A96D]",
        destructive:
          "border-transparent bg-red-600/30 text-red-300",
        outline:
          "border-[#342921] text-[#A8988B]",
        rare:
          "border-[#D48D48]/40 bg-[#D48D48] text-[#0D0B0A] font-bold shadow-sm",
        wallet:
          "border-[#2E241D] bg-[#1A1410] text-[#A8988B] text-[10px] tracking-widest font-mono",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
