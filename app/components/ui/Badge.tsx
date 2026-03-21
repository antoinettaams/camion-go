import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'status';
  status?: string;
  children?: React.ReactNode;
}

function Badge({ className, variant = "default", status, children, ...props }: BadgeProps) {
  let statusClasses = "";
  
  if (variant === 'status' && status) {
    switch (status) {
      case 'En attente':
        statusClasses = "bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300";
        break;
      case 'Devis reçus':
        statusClasses = "bg-blue-200 dark:bg-blue-500/30 text-blue-900 dark:text-blue-200";
        break;
      case 'Confirmée':
        statusClasses = "bg-blue-600 text-white";
        break;
      case 'En cours':
        statusClasses = "bg-blue-800 dark:bg-blue-700 text-white";
        break;
      case 'Livrée':
        statusClasses = "bg-slate-800 dark:bg-slate-700 text-white";
        break;
      case 'Annulée':
        statusClasses = "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300";
        break;
      default:
        statusClasses = "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200";
    }
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-slate-900 dark:bg-slate-800 text-slate-50 hover:bg-slate-900/80 dark:hover:bg-slate-700": variant === "default",
          "border-transparent bg-blue-700 text-white hover:bg-blue-700/80": variant === "primary",
          "border-transparent bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-500/30": variant === "secondary",
          "text-slate-950 dark:text-slate-200 border-slate-200 dark:border-slate-700": variant === "outline",
        },
        variant === 'status' ? `border-transparent ${statusClasses}` : "",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Badge }