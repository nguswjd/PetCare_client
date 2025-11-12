import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import { Check, ChevronDown, ChevronUp } from "lucide-react";
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
  expandable?: boolean;
  children?: React.ReactNode;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      className,
      label,
      variant,
      checked: controlledChecked,
      onCheckedChange,
      expandable,
      children,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(
      controlledChecked ?? props.defaultChecked ?? false
    );
    const [expanded, setExpanded] = React.useState(false);

    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : internalChecked;

    const handleCheckedChange = (newChecked: boolean) => {
      if (!isControlled) setInternalChecked(newChecked);
      onCheckedChange?.(newChecked);
    };

    return (
      <div>
        <label
          className={cn(
            "flex items-center justify-between cursor-pointer select-none w-full",
            variant === "secondary" ? "gap-4" : "gap-2"
          )}
        >
          <div className="flex items-center gap-2 flex-1">
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
          </div>

          {expandable && variant === "primary" && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setExpanded((prev) => !prev);
              }}
              className="ml-2 flex items-center justify-center"
            >
              {expanded ? (
                <ChevronUp className="w-6 h-6 text-gray-6" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-6" />
              )}
            </button>
          )}
        </label>

        {expanded && children && variant === "primary" && (
          <div className="mt-2 ml-7 text-sm text-gray-6">{children}</div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants };
