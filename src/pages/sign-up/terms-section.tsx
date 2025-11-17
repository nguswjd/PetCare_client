import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface TermsSectionProps {
  onCanProceedChange: (canProceed: boolean, marketing: boolean) => void;
}

function TermsSection({ onCanProceedChange }: TermsSectionProps) {
  const [checkedAll, setCheckedAll] = useState(false);
  const [checkedTerms, setCheckedTerms] = useState({
    service: false,
    privacy: false,
    location: false,
    marketing: false,
  });

  const [expandedKey, setExpandedKey] = useState<
    keyof typeof checkedTerms | null
  >(null);

  const toggleAll = (checked: boolean) => {
    const updated = {
      service: checked,
      privacy: checked,
      location: checked,
      marketing: checked,
    };
    setCheckedAll(checked);
    setCheckedTerms(updated);
    const canProceed = updated.service && updated.privacy && updated.location;
    onCanProceedChange(canProceed, updated.marketing);
  };

  const toggleOne = (key: keyof typeof checkedTerms, checked: boolean) => {
    const updated = { ...checkedTerms, [key]: checked };
    setCheckedTerms(updated);
    setCheckedAll(Object.values(updated).every(Boolean));

    const canProceed = updated.service && updated.privacy && updated.location;
    onCanProceedChange(canProceed, updated.marketing);
  };

  const toggleExpand = (key: keyof typeof checkedTerms) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <h2 className="text-base text-main-1 font-bold">약관 동의</h2>
      <div className="flex flex-col gap-3">
        <Checkbox
          label="모든 약관에 동의합니다."
          checked={checkedAll}
          onCheckedChange={(v: boolean) => toggleAll(v)}
        />
        <div className="border-b border-gray-4"></div>
        <div className="flex flex-col gap-4">
          <Checkbox
            label="(필수) 서비스 이용약관"
            expandable
            variant="primary"
            checked={checkedTerms.service}
            children={`제1조 (목적) \n 본 약관은 [회사명]이 제공하는 [서비스명]의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.\n\n 제2조 (서비스의 제공 및 변경)
            회사는 다음과 같은 서비스를 제공합니다. \n [서비스 내용 예시: 동물 정보 관리, 병원 예약, 커뮤니티 등] \n 회사는 서비스 제공을 위해 필요한 경우 서비스의 내용을 변경할 수 있습니다.\n\n 제3조 (이용자의 의무) \n 이용자는 서비스 이용 시 관계 법령, 본 약관, 회사가 정한 정책을 준수해야 합니다. \n 이용자는 계정 정보를 안전하게 관리해야 하며, 타인의 계정을 이용해서는 안 됩니다.\n\n 제4조 (서비스 이용 제한) \n 회사는 이용자가 다음에 해당하는 경우 서비스 이용을 제한할 수 있습니다. \n 타인의 권리 침해 또는 불법 행위 \n 서비스 운영을 방해하는 행위\n\n 제5조 (약관의 변경) \n 회사는 필요 시 약관을 변경할 수 있으며, 변경된 약관은 적용일자를 명시하여 공지합니다.`}
            expanded={expandedKey === "service"}
            onCheckedChange={(v) => toggleOne("service", v)}
            onExpandChange={() => toggleExpand("service")}
          />
          <Checkbox
            label="(필수) 개인정보 수집 및 이용 동의"
            expandable
            variant="primary"
            checked={checkedTerms.privacy}
            children={`1. 수집하는 개인정보 항목\n 필수: 이름, 휴대폰 번호, 계정 정보\n 선택: 반려동물 정보 \n\n 2. 개인정보의 수집 및 이용 목적 \n회원 관리 및 서비스 제공\n 이벤트, 공지사항 안내\n 서비스 개선 및 맞춤형 정보 제공\n\n 3. 개인정보의 보유 및 이용 기간\n 회원 탈퇴 시까지 보유하며, 관계 법령에 따라 일정 기간 보관 후 삭제합니다.\n\n 4. 동의 거부 권리\n이용자는 개인정보 제공에 동의하지 않을 권리가 있으며, 동의하지 않을 경우 일부 서비스 이용이 제한될 수 있습니다.`}
            expanded={expandedKey === "privacy"}
            onCheckedChange={(v) => toggleOne("privacy", v)}
            onExpandChange={() => toggleExpand("privacy")}
          />
          <Checkbox
            label="(필수) 위치 서비스 활용 동의"
            variant="primary"
            expandable={false}
            checked={checkedTerms.location}
            onCheckedChange={(v) => toggleOne("location", v)}
          />
          <Checkbox
            label="(선택) 마케팅 활용 및 광고성 정보 수신 동의"
            expandable={false}
            variant="primary"
            checked={checkedTerms.marketing}
            onCheckedChange={(v) => toggleOne("marketing", v)}
          />
        </div>
      </div>
    </div>
  );
}

export default TermsSection;
