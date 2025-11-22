import { useState } from "react";

export const useTerms = () => {
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

  const canProceed =
    checkedTerms.service && checkedTerms.privacy && checkedTerms.location;

  const toggleAll = (checked: boolean) => {
    const updated = {
      service: checked,
      privacy: checked,
      location: checked,
      marketing: checked,
    };
    setCheckedAll(checked);
    setCheckedTerms(updated);
  };

  const toggleOne = (key: keyof typeof checkedTerms, checked: boolean) => {
    const updated = { ...checkedTerms, [key]: checked };
    setCheckedTerms(updated);
    setCheckedAll(Object.values(updated).every(Boolean));
  };

  const toggleExpand = (key: keyof typeof checkedTerms) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  };

  return {
    checkedAll,
    checkedTerms,
    expandedKey,
    canProceed,
    marketingConsent: checkedTerms.marketing,
    toggleAll,
    toggleOne,
    toggleExpand,
  };
};
