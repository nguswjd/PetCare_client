import React from "react";

interface LoadingPageProps {
  message?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
  message = "로딩 중...",
}) => {
  return (
    <div className="flex flex-col gap-3 items-center justify-center min-h-screen">
      <img src="/PetCare_logo.svg" className="w-30 h-30" alt="설명" />
      <p className="text-main-1 font-bold text-lg">{message}</p>
    </div>
  );
};

export default LoadingPage;
