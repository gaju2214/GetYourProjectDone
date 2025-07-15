import React from "react";
import { badgeVariants } from "../../variants/badge-variants"; // Adjust path as needed
import { cn } from "../../lib/utils"; // Adjust if outside `ui/`

function Badge({ className, variant = "default", ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge };
