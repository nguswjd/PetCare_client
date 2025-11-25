import { useSignupForm } from "../hooks/useSignupForm";
import Button from "@/components/ui/button";
import type { Dispatch, SetStateAction } from "react";

interface AdminExtraFormProps {
  signupForm: ReturnType<typeof useSignupForm>;
  isUser: boolean;
  setIsUser: Dispatch<SetStateAction<boolean>>;
}

function HospitalTermsSection({ isUser, setIsUser }: AdminExtraFormProps) {
  return (
    <div className="w-full flex flex-col">
      <div>
        <Button
          variant="user"
          className="w-[50%]"
          active={isUser}
          onClick={() => setIsUser(true)}
          label="사용자"
        />
        <Button
          variant="user"
          className="w-[50%]"
          active={!isUser}
          onClick={() => setIsUser(false)}
          label="관리자"
        />
      </div>
      <div className="py-5">병원 세부 정보 입력</div>
    </div>
  );
}

export default HospitalTermsSection;
