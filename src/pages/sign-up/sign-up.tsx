import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import TermsSection from "./components/terms-section";
import UserForm from "./components/user-form";
import HospitalTermsSection from "./components/hospital-terms-section";
import Button from "@/components/ui/button";
import { useTerms } from "./hooks/useTerms";
import { useSignupForm } from "./hooks/useSignupForm";

function SignUp() {
  const [step, setStep] = useState(1);
  const terms = useTerms();
  const signupForm = useSignupForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (step > 1) {
      if (signupForm.isUser) {
        setStep(2);
      } else {
        if (step === 3) {
          setStep(3);
        } else {
          setStep(2);
        }
      }
    }
  }, [signupForm.isUser]);

  const handleNext = () => setStep(2);
  const handleGoLogin = () => navigate("/login");
  const handleLogoClick = () => navigate("/");

  const handleSignup = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;

      if (signupForm.isUser) {
        const payload = {
          name: signupForm.form.name,
          username: signupForm.form.username,
          password: signupForm.form.password,
          phoneNumber: signupForm.form.phone,
          species: signupForm.form.species,
          breed: signupForm.form.breed,
          marketingConsent: terms.marketingConsent,
        };

        const response = await fetch(`${API_URL}/api/v1/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("회원가입 실패");
        navigate("/login");
      } else {
        const payload = {
          representativeName: signupForm.form.name,
          username: signupForm.form.username,
          password: signupForm.form.password,
          name: signupForm.form.businessName,
          hospitalNumber: signupForm.form.phone,
          businessRegistrationNumber: signupForm.form.businessNumber,
          address: signupForm.form.address,
          hasParking: false,
          departments: [],
          animalTypes: [],
          breeds: [],
          holidays: [],
          operatingHours: [],
          imageUrl: "",
          description: "",
        };

        const response = await fetch(`${API_URL}/api/v1/hospital/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("회원가입 실패");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormNext = () => {
    if (signupForm.isUser) {
      handleSignup();
    } else {
      setStep(3);
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
        {step === 1 && <TermsSection terms={terms} />}
        {step === 2 && <UserForm signupForm={signupForm} />}
        {step === 3 && !signupForm.isUser && (
          <HospitalTermsSection signupForm={signupForm} />
        )}
      </main>

      <footer className="flex flex-col gap-2 px-6 mb-6">
        {step === 1 && (
          <Button
            className="w-full"
            label="다음"
            disabled={!terms.canProceed}
            onClick={handleNext}
          />
        )}
        {step === 2 && (
          <Button
            className="w-full"
            label={signupForm.isUser ? "회원가입" : "다음"}
            disabled={!signupForm.isValid}
            onClick={handleFormNext}
          />
        )}
        {step === 3 && !signupForm.isUser && (
          <Button
            className="w-full"
            label="병원 등록 요청하기"
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

export default SignUp;
