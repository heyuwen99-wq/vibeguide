import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-lg border border-primary/30 bg-card/30 backdrop-blur-sm px-4 py-3 text-base shadow-sm transition-all duration-300 outline-none placeholder:text-muted-foreground/60 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:shadow-lg focus-visible:shadow-primary/20 hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm font-rajdhani leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
