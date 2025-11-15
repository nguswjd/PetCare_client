import React from "react";

interface LoadingPageProps {
  message?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
  message = "로딩 중...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <img src="/PetCare_logo.svg" className="w-32 h-32" alt="설명" />
      <p className="text-main-1 font-bold text-lg mt-4">{message}</p>
    </div>
  );
};

export default LoadingPage;
