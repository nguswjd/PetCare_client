import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { useTerms } from "./hooks/useTerms";
import { useSignupForm } from "./hooks/useSignupForm";

import TermsSection from "./components/terms-section";
import UserForm from "./components/user-form";
import HospitalTermsSection from "./components/hospital-terms-section";
import Button from "@/components/ui/button";

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
        const normalize = (v: string) => (v === "" ? null : v);

        const payload = {
          name: signupForm.form.name,
          username: signupForm.form.username,
          password: signupForm.form.password,
          phoneNumber: signupForm.form.phone,
          species: normalize(signupForm.form.species),
          breed: normalize(signupForm.form.breed),
          marketingConsent: terms.marketingConsent,
        };

        const response = await fetch(`${API_URL}/api/v1/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(
            "응답 상태:",
            response.status,
            "응답 데이터:",
            errorData
          );
          throw new Error(errorData.message || "회원가입 실패");
        }

        navigate("/login", {
          state: {
            showSuccessPopup: true,
            message: "환영합니다!\n병원을 찾아 쉽게 예약하세요.",
          },
        });
      } else {
        const formData = new FormData();

        formData.append("representativeName", signupForm.form.name);
        formData.append("username", signupForm.form.username);
        formData.append("password", signupForm.form.password);
        formData.append("name", signupForm.form.businessName);
        formData.append("hospitalNumber", signupForm.form.phone);
        formData.append(
          "businessRegistrationNumber",
          signupForm.form.businessNumber
        );

        const fullAddress =
          signupForm.form.address +
          (signupForm.form.detailAddress
            ? ` ${signupForm.form.detailAddress}`
            : "");
        formData.append("address", fullAddress);

        if (signupForm.form.hasParking) {
          formData.append("hasParking", signupForm.form.hasParking);
        }

        if (
          signupForm.form.departments &&
          signupForm.form.departments !== "" &&
          signupForm.form.departments !== "[]"
        ) {
          formData.append("departments", signupForm.form.departments);
        }

        if (
          signupForm.form.animalTypes &&
          signupForm.form.animalTypes !== "" &&
          signupForm.form.animalTypes !== "[]"
        ) {
          formData.append("animalTypes", signupForm.form.animalTypes);
        }

        if (
          signupForm.form.breeds &&
          signupForm.form.breeds !== "" &&
          signupForm.form.breeds !== "[]"
        ) {
          formData.append("breeds", signupForm.form.breeds);
        }

        if (
          signupForm.form.holidays &&
          signupForm.form.holidays !== "" &&
          signupForm.form.holidays !== "[]"
        ) {
          formData.append("holidays", signupForm.form.holidays);
        }

        if (signupForm.form.operatingStartTime) {
          formData.append(
            "operatingStartTime",
            signupForm.form.operatingStartTime
          );
        }

        if (signupForm.form.operatingEndTime) {
          formData.append("operatingEndTime", signupForm.form.operatingEndTime);
        }

        if (
          signupForm.form.breakTimes &&
          signupForm.form.breakTimes !== "" &&
          signupForm.form.breakTimes !== "[]"
        ) {
          formData.append("breakTimes", signupForm.form.breakTimes);
        }

        if (signupForm.form.description) {
          formData.append("description", signupForm.form.description);
        }

        if (signupForm.imageFile) {
          formData.append("imageFile", signupForm.imageFile);
        }

        const response = await fetch(`${API_URL}/api/v1/hospital/auth/signup`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("응답 상태:", response.status);
          console.error("응답 데이터:", errorData);
          throw new Error(errorData.message || "회원가입 실패");
        }

        navigate("/login", {
          state: {
            showSuccessPopup: true,
            message: "환영합니다!\n리뷰와 예약을 쉽게 확인하세요.",
          },
        });
      }
    } catch (err) {
      console.error("회원가입 에러:", err);
      alert(
        err instanceof Error ? err.message : "회원가입 중 오류가 발생했습니다."
      );
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
