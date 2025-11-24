import { useState } from "react";
import { useNavigate } from "react-router";
import TermsSection from "./components/terms-section";
import UserForm from "./components/user-form";
import HospitalTermsSection from "./components/hospital-terms-section";
import Button from "@/components/ui/button";
import { useTerms } from "./hooks/useTerms";
import { useSignupForm } from "./hooks/useSignupForm";

function SignUp() {
  const [step, setStep] = useState(1);
  const [isUser, setIsUser] = useState(true);
  const terms = useTerms();
  const signupForm = useSignupForm();
  const navigate = useNavigate();

  const handleNext = () => setStep(2);
  const handleGoLogin = () => navigate("/login");
  const handleLogoClick = () => navigate("/");

  const handleAdminNext = () => setStep(3);

  // 기본 정보 유효성 검사 (step 2)
  const isStep2Valid =
    signupForm.form.name &&
    signupForm.form.username &&
    signupForm.verified.username &&
    signupForm.form.password &&
    signupForm.form.passwordConfirm &&
    signupForm.form.password === signupForm.form.passwordConfirm &&
    signupForm.form.phone &&
    signupForm.verified.phone;

  // 사용자 추가 정보 유효성 검사
  const isUserExtraValid = signupForm.form.species && signupForm.form.breed;

  // 관리자 추가 정보 유효성 검사 (step 3)
  const isAdminExtraValid =
    signupForm.form.businessName &&
    signupForm.form.businessNumber &&
    signupForm.form.licenseNumber;

  const handleSignup = async () => {
    const payload = {
      name: signupForm.form.name,
      username: signupForm.form.username,
      password: signupForm.form.password,
      phoneNumber: signupForm.form.phone,
      userType: isUser ? "user" : "admin",
      ...(isUser
        ? {
            species: signupForm.form.species,
            breed: signupForm.form.breed,
          }
        : {
            businessName: signupForm.form.businessName,
            businessNumber: signupForm.form.businessNumber,
            licenseNumber: signupForm.form.licenseNumber,
          }),
      marketingConsent: terms.marketingConsent,
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
        {step === 1 && <TermsSection terms={terms} />}
        {step === 2 && (
          <UserForm
            signupForm={signupForm}
            isUser={isUser}
            setIsUser={setIsUser}
          />
        )}
        {step === 3 && !isUser && (
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

        {step === 2 && isUser && (
          <Button
            className="w-full"
            label="회원가입"
            disabled={!isStep2Valid || !isUserExtraValid}
            onClick={handleSignup}
          />
        )}

        {step === 2 && !isUser && (
          <Button
            className="w-full"
            label="다음"
            disabled={!isStep2Valid}
            onClick={handleAdminNext}
          />
        )}

        {step === 3 && !isUser && (
          <Button
            className="w-full"
            label="회원가입"
            disabled={!isAdminExtraValid}
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
