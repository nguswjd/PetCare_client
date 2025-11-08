import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva("p-3 bg-main-2 text-white rounded-md m-4", {
  variants: {
    variant: {
      default: "",
      active: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface ButtonProps
  extends Omit<React.ComponentProps<"button">, "children">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ElementType;
  label: string;
}

function Button({
  className,
  label,
  icon: Icon,
  variant,
  asChild = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn("group", buttonVariants({ variant, className }))}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
}

export { Button, buttonVariants };
