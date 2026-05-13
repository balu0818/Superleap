import * as React from "react"
import { cn } from "../../lib/utils"

export type BadgeProps = {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-gray-900 border-transparent text-white hover:bg-gray-900/80",
    secondary: "bg-gray-100 border-transparent text-gray-900 hover:bg-gray-100/80",
    destructive: "bg-red-100 border-transparent text-red-900",
    success: "bg-emerald-100 border-transparent text-emerald-900",
    warning: "bg-amber-100 border-transparent text-amber-900",
    info: "bg-blue-100 border-transparent text-blue-900",
    outline: "text-gray-950",
  }
  
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
