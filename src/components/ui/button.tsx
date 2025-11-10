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
        user: "border-b border-b-main-1 text-main-1 disabled:text-gray-6 disabled:border-b-gray-3 rounded-none w-40 p-3",
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
  toggleable = false,
  active: activeProp,
  ...props
}: ButtonProps) {
  const [isActive, setIsActive] = React.useState(activeProp ?? false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (toggleable) setIsActive((prev) => !prev);
    props.onClick?.(e);
  };

  React.useEffect(() => {
    if (activeProp !== undefined) setIsActive(activeProp);
  }, [activeProp]);

  return (
    <button
      className={cn(
        "group",
        buttonVariants({ variant, active: isActive }),
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {Icon && <Icon className="w-6 h-6" />}
      {variant !== "icon" && label}
    </button>
  );
}

export default Button;
