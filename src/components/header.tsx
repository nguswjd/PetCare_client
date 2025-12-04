import Button from "./ui/button";
import { ChevronLeft } from "lucide-react";

type HeaderProps = {
  label?: string;
  showBackButton?: boolean;
};

function Header({ label, showBackButton = true }: HeaderProps) {
  return (
    <header className="relative flex w-full h-14 items-center px-4">
      {showBackButton && (
        <Button
          variant="icon"
          icon={ChevronLeft}
          onClick={() => window.history.back()}
        />
      )}
      <h2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-base text-black">
        {label}
      </h2>
    </header>
  );
}

export default Header;
