import React from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface MultiSelectBoxProps {
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  onChange?: (value: string) => void;
  label?: string;
  selectedValues?: string[];
}

export const MultiSelectBox = ({
  placeholder = "select",
  options,
  disabled = false,
  onChange,
  label,
  selectedValues = [],
}: MultiSelectBoxProps) => {
  const [open, setOpen] = React.useState(false);

  const handleToggle = (value: string) => {
    if (onChange) {
      onChange(value);
    }
  };

  const isSelected = (value: string) => selectedValues.includes(value);

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) {
      const selected = options.find((opt) => opt.value === selectedValues[0]);
      return selected?.label || placeholder;
    }
    return placeholder;
  };

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-black">{label}</label>
      )}
      <div className="relative w-full">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={cn(
            "flex justify-between text-sm h-10 items-center w-full px-4 py-3 border rounded-md border-gray-3 focus:outline-none",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span
            className={cn(
              "truncate",
              selectedValues.length === 0 && "text-gray-400"
            )}
          >
            {getDisplayText()}
          </span>
          {open ? (
            <ChevronUp className="h-5 w-5 text-gray-3 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-3 flex-shrink-0" />
          )}
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <div className="absolute z-50 w-full mt-1 shadow-md border bg-white rounded-md">
              <div className="p-1 max-h-40 overflow-auto">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleToggle(option.value)}
                    className="w-full items-center flex relative justify-between outline-none px-2 py-1.5 hover:bg-gray-1 rounded transition-colors"
                  >
                    <span className="text-sm">{option.label}</span>
                    {isSelected(option.value) && (
                      <span className="flex items-center justify-center">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
