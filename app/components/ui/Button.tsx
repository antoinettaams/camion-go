import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref} 
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-blue-700 dark:bg-blue-600 text-white hover:bg-blue-800 dark:hover:bg-blue-700": variant === "primary",
            "bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-500/30": variant === "secondary",
            "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white": variant === "outline",
            "hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white": variant === "ghost",
            "text-blue-700 dark:text-blue-400 underline-offset-4 hover:underline": variant === "link",
            "bg-slate-900 dark:bg-slate-800 text-slate-50 hover:bg-slate-900/90 dark:hover:bg-slate-700": variant === "default",
            
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
            "h-10 w-10": size === "icon",
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