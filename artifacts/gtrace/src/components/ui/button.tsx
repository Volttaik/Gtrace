import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "glass";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0": variant === "default",
            "border border-border bg-background hover:bg-secondary hover:text-secondary-foreground": variant === "outline",
            "hover:bg-secondary hover:text-secondary-foreground": variant === "ghost",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20": variant === "destructive",
            "bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 text-white": variant === "glass",
            
            "h-11 px-6 py-2": size === "default",
            "h-9 rounded-lg px-3": size === "sm",
            "h-14 rounded-2xl px-8 text-base": size === "lg",
            "h-11 w-11": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
