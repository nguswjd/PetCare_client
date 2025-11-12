import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface TermsSectionProps {
  onCanProceedChange: (canProceed: boolean) => void;
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
    setCheckedAll(checked);
    setCheckedTerms({
      service: checked,
      privacy: checked,
      location: checked,
      marketing: checked,
    });
    onCanProceedChange(checked);
  };

  const toggleOne = (key: keyof typeof checkedTerms, checked: boolean) => {
    const updated = { ...checkedTerms, [key]: checked };
    setCheckedTerms(updated);
    setCheckedAll(Object.values(updated).every(Boolean));

    const canProceed = updated.service && updated.privacy && updated.location;
    onCanProceedChange(canProceed);
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
            expanded={expandedKey === "service"}
            onCheckedChange={(v) => toggleOne("service", v)}
            onExpandChange={() => toggleExpand("service")}
          >
            서비스 이용약관 동의
            <br />
            - 회원 가입 및 관리
            <br />
            - 서비스 제공 및 이용자 식별
            <br />
            - 이용자 책임과 권리 안내
            <br />- 서비스 이용 제한 및 탈퇴 안내
          </Checkbox>

          <Checkbox
            label="(필수) 개인정보 수집 및 이용 동의"
            expandable
            variant="primary"
            checked={checkedTerms.privacy}
            expanded={expandedKey === "privacy"}
            onCheckedChange={(v) => toggleOne("privacy", v)}
            onExpandChange={() => toggleExpand("privacy")}
          >
            개인정보 수집 및 이용 동의
            <br />
            - 수집 항목: 이름, 이메일, 비밀번호, 연락처
            <br />
            - 이용 목적: 회원가입, 서비스 제공, 고객 상담
            <br />- 보유 기간: 회원 탈퇴 시 파기
          </Checkbox>

          <Checkbox
            label="(필수) 위치 서비스 활용 동의"
            expandable
            variant="primary"
            checked={checkedTerms.location}
            expanded={expandedKey === "location"}
            onCheckedChange={(v) => toggleOne("location", v)}
            onExpandChange={() => toggleExpand("location")}
          >
            위치 서비스 활용 동의
            <br />
            - 위치 정보 수집 및 이용
            <br />
            - 서비스 제공 및 맞춤형 안내
            <br />- 동의 거부 시 일부 서비스 제한 가능
          </Checkbox>

          <Checkbox
            label="(선택) 마케팅 활용 및 광고성 정보 수신 동의"
            expandable={false}
            checked={checkedTerms.marketing}
            onCheckedChange={(v) => toggleOne("marketing", v)}
          />
        </div>
      </div>
    </div>
  );
}

export default TermsSection;
