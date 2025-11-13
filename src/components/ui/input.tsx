import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";
import Button from "./button";
import { SearchIcon, ChevronLeft, type LucideIcon } from "lucide-react";

const inputVariants = cva(
  "rounded-lg px-4 py-2 focus:outline-none text-sm w-full",
  {
    variants: {
      variant: {
        primary:
          "border border-gray-3 bg-white text-black focus:border-gray-5 placeholder-gray-6",
        Search: "placeholder-gray-4 px-4 py-4 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  leftIcon?: LucideIcon;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, leftIcon, ...props }, ref) => {
    if (variant === "Search") {
      const LeftIcon = leftIcon || ChevronLeft;

      return (
        <div className="h-14 flex px-4">
          <Button icon={LeftIcon} variant="icon" />
          <input
            className={cn(inputVariants({ variant }), className)}
            ref={ref}
            {...props}
          />
          <Button icon={SearchIcon} variant="icon" />
        </div>
      );
    }

    return (
      <input
        className={cn(inputVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;
