import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CircleSmall } from "lucide-react";

const radioVariants = cva(
  "h-6 w-6 border rounded-full flex items-center justify-center transition-colors",
  {
    variants: {
      variant: {
        secondary:
          "border-gray-6 border-1 text-gray-6 w-4 h-4 flex items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
);

interface SingleRadioProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
      "value"
    >,
    VariantProps<typeof radioVariants> {
  label?: string;
  value: string;
  rootValue: string;
}

const SingleRadio = React.forwardRef<HTMLButtonElement, SingleRadioProps>(
  (
    { className, label, variant, value: itemValue, rootValue, ...props },
    ref
  ) => {
    const isChecked = rootValue === itemValue;

    return (
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <RadioGroupPrimitive.Item
          ref={ref}
          className={cn(
            radioVariants({ variant }),
            className,
            "cursor-pointer"
          )}
          value={itemValue}
          {...props}
        >
          <CircleSmall
            className={cn(
              "transition-colors",
              isChecked ? "text-main-1" : "text-gray-6"
            )}
            fill={isChecked ? "currentColor" : "transparent"}
            stroke="currentColor"
          />
        </RadioGroupPrimitive.Item>
        {label && (
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              isChecked ? "text-main-1" : "text-gray-6"
            )}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

SingleRadio.displayName = "SingleRadio";

interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

const Radio = ({ value, onChange, options }: RadioGroupProps) => (
  <RadioGroupPrimitive.Root
    value={value}
    onValueChange={onChange}
    className="grid grid-cols-2 gap-2"
  >
    {options.map((opt) => (
      <SingleRadio
        key={opt.value}
        value={opt.value}
        label={opt.label}
        rootValue={value}
      />
    ))}
  </RadioGroupPrimitive.Root>
);

export { Radio, radioVariants };
