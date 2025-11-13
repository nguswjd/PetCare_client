import { useState } from "react";
import { useNavigate } from "react-router";

import TermsSection from "./terms-section";
import UserForm from "./user-form";

import Button from "@/components/ui/button";

function Join() {
  const [step, setStep] = useState(1);
  const [canProceed, setCanProceed] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => setStep((prev) => prev + 1);
  const handleGoLogin = () => navigate("/login");
  const handleLogoClick = () => navigate("/");

  return (
    <div className="bg-white max-w-120 mx-auto flex flex-col h-dvh">
      <header
        className="mt-[10vh] flex justify-center cursor-pointer"
        onClick={handleLogoClick}
      >
        <img src="/PetCare_logo.svg" alt="로고" className="w-[20vw] max-w-28" />
      </header>

      <main className="flex-1 flex flex-col justify-center items-center px-6">
        {step === 1 && <TermsSection onCanProceedChange={setCanProceed} />}
        {step === 2 && <UserForm onFormChange={setCanProceed} />}
      </main>

      <footer className="flex flex-col gap-2 px-6 mb-6">
        {step === 1 && (
          <Button
            className="w-full"
            label="다음"
            disabled={!canProceed}
            onClick={handleNext}
          />
        )}
        {step === 2 && (
          <Button className="w-full" label="회원가입" disabled={!canProceed} />
        )}
        <Button
          className="w-full"
          label="로그인"
          variant="outline"
          onClick={handleGoLogin}
        />
      </footer>
    </div>
  );
}

export default Join;
