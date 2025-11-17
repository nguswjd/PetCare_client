import { useState } from "react";
import { useNavigate } from "react-router";

import TermsSection from "./terms-section";
import UserForm from "./user-form";

import Button from "@/components/ui/button";

function Join() {
  const [step, setStep] = useState(1);
  const [canProceedTerms, setCanProceedTerms] = useState(false);
  const [canProceedForm, setCanProceedForm] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: "",
    username: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    species: "",
    breed: "",
  });

  const navigate = useNavigate();

  const handleNext = () => setStep(2);
  const handleGoLogin = () => navigate("/login");
  const handleLogoClick = () => navigate("/");

  const handleSignup = async () => {
    const payload = {
      name: userFormData.name,
      username: userFormData.username,
      password: userFormData.password,
      phoneNumber: userFormData.phone,
      species: userFormData.species,
      breed: userFormData.breed,
      marketingConsent,
    };

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("회원가입 실패");
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white max-w-120 mx-auto flex flex-col h-dvh">
      <header
        className="mt-[10vh] flex justify-center cursor-pointer"
        onClick={handleLogoClick}
      >
        <img src="/PetCare_logo.svg" alt="로고" className="w-[20vw] max-w-28" />
      </header>

      <main className="flex-1 flex flex-col justify-center items-center px-6 w-full">
        {step === 1 && (
          <TermsSection
            onCanProceedChange={(canProceed, marketing) => {
              setCanProceedTerms(canProceed);
              setMarketingConsent(marketing);
            }}
          />
        )}
        {step === 2 && (
          <UserForm
            onFormChange={(isValid, formData) => {
              setCanProceedForm(isValid);
              setUserFormData(formData);
            }}
          />
        )}
      </main>

      <footer className="flex flex-col gap-2 px-6 mb-6">
        {step === 1 && (
          <Button
            className="w-full"
            label="다음"
            disabled={!canProceedTerms}
            onClick={handleNext}
          />
        )}
        {step === 2 && (
          <Button
            className="w-full"
            label="회원가입"
            disabled={!canProceedForm}
            onClick={handleSignup}
          />
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
