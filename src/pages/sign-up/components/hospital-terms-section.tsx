import { useSignupForm } from "../hooks/useSignupForm";
import Button from "@/components/ui/button";
import HospitalInfo from "@/components/hospital-detail-info";

interface HospitalTermsSectionProps {
  signupForm: ReturnType<typeof useSignupForm>;
}

function HospitalTermsSection({ signupForm }: HospitalTermsSectionProps) {
  return (
    <div className="w-full flex flex-col">
      <div>
        <Button
          variant="user"
          className="w-[50%]"
          active={signupForm.isUser}
          onClick={() => signupForm.setUserType(true)}
          label="사용자"
        />
        <Button
          variant="user"
          className="w-[50%]"
          active={!signupForm.isUser}
          onClick={() => signupForm.setUserType(false)}
          label="관리자"
        />
      </div>
      <div className="py-5">
        <HospitalInfo />
      </div>
    </div>
  );
}

export default HospitalTermsSection;
