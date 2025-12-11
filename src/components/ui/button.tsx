import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "text-center rounded-md px-4 py-2 text-sm font-semibold cursor-pointer transition-colors disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-main-1 text-white border disabled:bg-main-2",
        secondary:
          "bg-white border-main-1 border text-main-1 w-18 disabled:bg-main-2 disabled:bg-white disabled:text-gray-3 disabled:border-gray-3",
        outline: "bg-white border text-main-1 border-gray-3",
        user: "rounded-none w-40 p-3 border-b",
        icon: "px-0 py-0",
      },
      active: {
        true: "bg-main-1 text-white",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      active: false,
    },
  }
);

interface ButtonProps
  extends Omit<React.ComponentProps<"button">, "children">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ElementType;
  label?: string;
  toggleable?: boolean;
  active?: boolean;
}

function Button({
  className,
  label,
  icon: Icon,
  variant,
  active = false,
  toggleable,
  disabled,
  ...props
}: ButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      props.onClick?.(e);
    }
  };

  return (
    <button
      className={cn(
        "group",
        buttonVariants({ variant, active }),
        variant === "user" &&
          (active
            ? "border-b-main-1 bg-white text-main-1"
            : "border-b-gray-3 text-gray-6"),
        className
      )}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {Icon && (
        <Icon className={cn(variant === "icon" ? "w-6 h-6" : "w-4 h-4")} />
      )}
      {variant !== "icon" && label}
    </button>
  );
}

export default Button;
