import { useCallback } from "react";
import { useSignupForm } from "../hooks/useSignupForm";
import Button from "@/components/ui/button";
import HospitalInfo, {
  type HospitalFormData,
} from "@/components/hospital-detail-info";

interface HospitalTermsSectionProps {
  signupForm: ReturnType<typeof useSignupForm>;
}

function HospitalTermsSection({ signupForm }: HospitalTermsSectionProps) {
  const handleHospitalDataChange = useCallback(
    (data: HospitalFormData) => {
      signupForm.handleChange("hasParking", String(data.hasParking));
      signupForm.handleChange("departments", JSON.stringify(data.departments));
      signupForm.handleChange("animalTypes", JSON.stringify(data.animalTypes));
      signupForm.handleChange("breeds", JSON.stringify(data.breeds));
      signupForm.handleChange("holidays", JSON.stringify(data.holidays));
      signupForm.handleChange(
        "operatingStartTime",
        data.operatingStartTime || ""
      );
      signupForm.handleChange("operatingEndTime", data.operatingEndTime || "");
      signupForm.handleChange("breakTimes", JSON.stringify(data.breakTimes));
      if (data.imageFile) {
        signupForm.setImageFile(data.imageFile);
      }
    },
    [signupForm]
  );

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
        <HospitalInfo onDataChange={handleHospitalDataChange} />
      </div>
    </div>
  );
}

export default HospitalTermsSection;
