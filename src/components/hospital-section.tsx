import { useState } from "react";
import Button from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface HospitalInfoSectionProps {
  image: string;
  alt: string;
  name: string;
  address: string;
  businessStatus: string;
  distance?: string;
  hasParking: boolean;
  breeds: string[];
  reviewCount: number;
  departments: string[];
  hospitalNumber?: string;
  showButton?: boolean;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

function HospitalInfoSection({
  image,
  alt,
  name,
  address,
  businessStatus,
  hasParking,
  breeds,
  reviewCount,
  departments,
  hospitalNumber,
  showButton = false,
  buttonLabel = "예약하기",
  onButtonClick,
}: HospitalInfoSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img
        src={image}
        alt={alt || "병원 이미지"}
        className="w-full min-h-40 h-[15vh] max-h-60 bg-gray-4 object-cover"
      />
      <section className="flex flex-col justify-between">
        <h2 className="hidden">병원정보</h2>
        <div className="mt-4 px-4 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-xl">{name}</h3>
                <p className="flex gap-2 text-gray-6 font-medium text-xs">
                  {address.split(" ").slice(1, 3).join(" ")}
                </p>
              </div>
              <p className="text-gray-6 text-sm">{businessStatus}</p>
            </div>
            {showButton && (
              <div className="mt-3">
                <Button
                  label={buttonLabel}
                  onClick={onButtonClick}
                  className="w-full"
                />
              </div>
            )}
          </div>
          <div className="text-sm text-gray-6 py-2 flex justify-between font-medium">
            <div className="flex flex-col">
              <p>주차장 {hasParking ? "있음" : "없음"}</p>
              <p className="overflow-hidden w-50 text-ellipsis whitespace-nowrap">
                {breeds.join(", ")}
              </p>
            </div>
            <p className="ml-auto text-right">
              총 리뷰 {reviewCount.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="border-y px-4 border-y-gray-2 py-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm text-black font-semibold">병원 정보</h3>
            <Button
              variant="icon"
              icon={isOpen ? ChevronUp : ChevronDown}
              onClick={() => setIsOpen((prev) => !prev)}
            />
          </div>
          {isOpen && (
            <div className="mt-4 text-xs flex flex-col gap-3 text-black">
              {hospitalNumber && (
                <a
                  href={`tel:${hospitalNumber}`}
                  className="hover:text-main-1 hover:font-bold cursor-pointer"
                >
                  📞 : {hospitalNumber}
                </a>
              )}
              <p>진료과목 : {departments.join(", ")}</p>
              <p>진료동물 : {breeds.join(", ")}</p>
              <p>
                오시는 길: <br />
                {address}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default HospitalInfoSection;
