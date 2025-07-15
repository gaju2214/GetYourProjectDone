// lib/utils.ts or wherever you define utilities
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "font-bold py-2 px-8 rounded transition-colors focus:outline-none", // common base classes
  {
    variants: {
      variant: {
        primary: "bg-blue-500 hover:bg-blue-700 text-white",
        secondary: "bg-gray-500 hover:bg-gray-700 text-white",
        outline:
          "bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg px-8 py-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);
