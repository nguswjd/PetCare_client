import { cva, type VariantProps } from "class-variance-authority";

import Button from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

type HospitalData = {
  name: string;
  address: string;
};

const headerVariants = cva("relative flex w-full px-4 items-center", {
  variants: {
    variant: {
      label: "h-14",
      hospital: "",
    },
    showBackButton: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    variant: "label",
    showBackButton: true,
  },
});

interface HeaderProps extends VariantProps<typeof headerVariants> {
  label?: string;
  hospitalData?: HospitalData;
}

function Header({
  variant,
  showBackButton = true,
  label,
  hospitalData,
}: HeaderProps) {
  return (
    <header className={headerVariants({ variant, showBackButton })}>
      {showBackButton && variant === "label" && (
        <Button
          variant="icon"
          icon={ChevronLeft}
          onClick={() => window.history.back()}
        />
      )}

      {variant === "hospital" && hospitalData ? (
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-xl">{hospitalData.name}</h3>
          <p className="text-gray-6 font-medium text-sm">
            {hospitalData.address}
          </p>
        </div>
      ) : (
        <h2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-base text-black">
          {label}
        </h2>
      )}
    </header>
  );
}

export default Header;
