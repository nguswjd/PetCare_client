import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Button from "./button";

import { type LucideIcon } from "lucide-react";

const fieldVariants = cva(
  "flex justify-between items-center w-full px-4 py-3 rounded-md border-gray-3",
  {
    variants: {
      variant: {
        default: "text-sm h-10 border",
        search: "text-base h-10 border-b border-gray-2 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const labelVariants = cva("font-medium text-black", {
  variants: {
    variant: {
      default: "text-sm",
      search: "text-base",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface FieldProps extends VariantProps<typeof fieldVariants> {
  label?: string;
  placeholder?: string;
  value?: string;
  rightIcon?: LucideIcon;
  onRightIconClick?: () => void;
  onClick?: () => void;
  className?: string;
}

function Field({
  label,
  placeholder,
  value,
  rightIcon,
  onRightIconClick,
  onClick,
  variant,
  className,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <h3 className={cn(labelVariants({ variant }))}>{label}</h3>}
      <div
        className={cn(
          fieldVariants({ variant }),
          className,
          onClick && "cursor-pointer"
        )}
        onClick={onClick}
      >
        <span className={cn("text-gray-6", value && "text-black")}>
          {value || placeholder}
        </span>
        {rightIcon && (
          <Button
            icon={rightIcon}
            variant="icon"
            className="text-gray-3"
            onClick={(e) => {
              e.stopPropagation();
              if (onRightIconClick) onRightIconClick();
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Field;
