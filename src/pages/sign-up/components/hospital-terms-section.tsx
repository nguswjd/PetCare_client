import { useSignupForm } from "../hooks/useSignupForm";

interface AdminExtraFormProps {
  signupForm: ReturnType<typeof useSignupForm>;
}

function HospitalTermsSection({}: AdminExtraFormProps) {
  return <div className="w-full flex flex-col">병원 세부 정보 입력</div>;
}

export default HospitalTermsSection;
