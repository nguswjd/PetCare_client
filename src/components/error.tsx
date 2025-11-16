import React from "react";
import Button from "@/components/ui/button";

interface ErrorPageProps {
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  message = "404 NotFound",
  onRetry,
  showRetry = true,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <img src="/PetCare_logo.svg" className="w-32 h-32" alt="PetCare 로고" />
      <p className="text-main-1 font-bold text-lg">{message}</p>
      {showRetry && onRetry && <Button label="뒤로가기" onClick={onRetry} />}
    </div>
  );
};

export default ErrorPage;
