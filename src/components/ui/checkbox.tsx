import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import { Check } from "lucide-react";
import { CircleSmall } from "lucide-react";

const checkboxVariants = cva(
  "h-6 w-6 border rounded-full flex items-center justify-center transition-colors",
  {
    variants: {
      variant: {
        primary:
          "border-gray-4 border-1 w-5 h-5 text-gray-4 data-[state=checked]:border-main-1",
        secondary:
          "border-gray-6 border-1 text-gray-6 data-[state=checked]:border-main-1 w-4 h-4",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

interface CheckboxProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
      "checked" | "onCheckedChange"
    >,
    VariantProps<typeof checkboxVariants> {
  label?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      className,
      label,
      variant,
      checked: controlledChecked,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(
      controlledChecked ?? props.defaultChecked ?? false
    );

    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : internalChecked;

    const handleCheckedChange = (newChecked: boolean) => {
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      onCheckedChange?.(newChecked);
    };

    return (
      <label
        className={cn(
          "flex items-center cursor-pointer select-none",
          variant === "secondary" ? "gap-4" : "gap-2"
        )}
      >
        <CheckboxPrimitive.Root
          ref={ref}
          className={cn(checkboxVariants({ variant }), className)}
          {...props}
          checked={checked}
          onCheckedChange={handleCheckedChange}
        >
          {variant === "secondary" ? (
            <CircleSmall
              className={cn(
                "transition-colors",
                checked ? "text-main-1" : "text-gray-6"
              )}
              fill={checked ? "currentColor" : "transparent"}
              stroke="currentColor"
            />
          ) : (
            <Check
              className={cn(
                "h-3 w-3 transition-colors",
                checked ? "text-main-1" : "text-gray-4"
              )}
            />
          )}
        </CheckboxPrimitive.Root>

        {label && (
          <span
            className={cn(
              "text-sm transition-colors font-medium",
              checked ? "text-main-1" : "text-gray-6"
            )}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants };
