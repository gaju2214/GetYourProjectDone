import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";
import { buttonVariants } from "../../variants/buttonVariants";

const Button = React.forwardRef((props, ref) => {
  const {
    className,
    variant = "default",
    size = "default",
    asChild = false,
    ...restProps
  } = props;

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      {...restProps}
    />
  );
});

Button.displayName = "Button";

export { Button };
