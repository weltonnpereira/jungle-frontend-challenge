import * as React from "react"
import { cn } from "@/src/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-[#2D231B] bg-[#16120F] px-4 py-2 text-sm text-[#F3E8E2] placeholder:text-[#8C7C6F] transition-colors focus-visible:outline-none focus-visible:border-[#E0A96D] focus-visible:ring-1 focus-visible:ring-[#E0A96D] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
