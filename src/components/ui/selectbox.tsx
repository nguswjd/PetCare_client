import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectBasicProps {
  placeholder?: string;
  options: SelectOption[];
  defaultValue?: string;
  disabled?: boolean;
  width?: string;
  onChange?: (value: string) => void;
  label?: string;
}

export const SelectBox = ({
  placeholder = "select",
  options,
  defaultValue,
  disabled = false,
  onChange,
  label,
}: SelectBasicProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <Select
        defaultValue={defaultValue}
        onValueChange={onChange}
        open={open}
        onOpenChange={setOpen}
      >
        <SelectTrigger disabled={disabled} isOpen={open}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
