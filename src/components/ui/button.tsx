import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/src/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0A96D] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#E0A96D] text-[#0D0B0A] hover:bg-[#E8B781] shadow-md shadow-[#E0A96D]/10 hover:shadow-[#E0A96D]/20",
        gold:
          "bg-gradient-to-r from-[#D48D48] via-[#E0A96D] to-[#E9BC84] text-[#0D0B0A] font-bold hover:brightness-110",
        destructive:
          "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30",
        outline:
          "border border-[#342921] bg-transparent text-[#F3E8E2] hover:bg-[#1A1410] hover:text-[#E0A96D] hover:border-[#E0A96D]/40",
        secondary:
          "bg-[#1E1814] text-[#F3E8E2] hover:bg-[#28201B] border border-[#342921]",
        ghost:
          "text-[#A8988B] hover:text-[#F3E8E2] hover:bg-[#1C1612]",
        link: "text-[#E0A96D] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-7 text-base font-bold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
