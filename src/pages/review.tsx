import { useEffect, useState } from "react";
import { useParams } from "react-router";

import LoadingPage from "./loading";
import Header from "@/components/header";

import { SelectBox } from "@/components/ui/selectbox";
import Button from "@/components/ui/button";
import Field from "@/components/ui/field";
import ReviewTextarea from "@/components/review-textarea";
import { Radio } from "@/components/ui/radio";

interface HospitalInfo {
  id: number;
  name: string;
  address: string;
  businessStatus: string;
  image: string;
  alt: string;
  distance?: string;
  hasParking: boolean;
}

function Review() {
  const { id } = useParams<{ id: string }>();
  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo | null>(null);
  const [visitIntent, setVisitIntent] = useState("yes");

  useEffect(() => {
    if (!id) return;
    
    const API =
      import.meta.env.MODE === "development"
        ? ""
        : import.meta.env.VITE_API_URL;

    fetch(`${API}/api/v1/hospital/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setHospitalInfo({
          id: Number(id),
          name: data.name,
          address: data.address,
          businessStatus: data.status,
          image: data.imageUrl,
          alt: data.description,
          hasParking: data.hasParking,
        });
      })
      .catch((err) => {
        console.error("병원 정보 불러오기 실패:", err);
        setHospitalInfo({
          id: Number(id),
          name: "A hospital",
          address: "제주시 외도동",
          businessStatus: "24시간 영업",
          image: "",
          alt: "병원1",
          hasParking: false,
        });
      });
  }, [id]);

  const department = [
    { value: "VACCINATION", label: "예방접종" },
    { value: "INTERNAL_SURGERY", label: "내과/외과" },
    { value: "DENT_SKIN_EYE", label: "치과/피부과/안과" },
    { value: "NEUTERING", label: "중성화수술" },
    { value: "CHECKUP", label: "건강검진" },
    { value: "EMERGENCY", label: "응급진료" },
    { value: "ORTHO_NEURO_CENTER", label: "정형외과/신잠내과/중앙클리닉" },
    { value: "OTHER", label: "기타" },
  ];

  const review = {
    reservationId: "1",
    visitdate: "2025.11.10",
    animalType: "육지동물",
    breed: "대형견",
  };

  if (!hospitalInfo) {
    return <LoadingPage message="로딩중..." />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header label="리뷰 등록하기" />

      <div className="p-4 border-b border-t border-b-gray-3 border-t-gray-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-xl">{hospitalInfo.name}</h3>
          <p className="flex gap-2 text-gray-6 font-medium text-sm">
            {hospitalInfo.address.split(" ").slice(0, 3).join(" ")}
          </p>
        </div>
        <div className="flex gap-2 text-gray-6 font-medium text-sm">
          <p>{hospitalInfo.businessStatus}</p>
          {hospitalInfo.distance && <p>{hospitalInfo.distance}</p>}
        </div>
      </div>

      <main className="px-6 flex flex-col gap-3 py-4">
        <Field label="방문날짜" placeholder={review.visitdate} />

        <Field label="진료대상 동물" placeholder={review.animalType} />

        <Field label="품종" placeholder={review.breed} />

        <SelectBox
          label="진료항목"
          placeholder="진료 항목을 선택해주세요."
          options={department}
        />

        <div className="flex flex-col gap-1 mb-4">
          <h3 className="text-sm font-medium text-black">재방문 의사</h3>
          <Radio
            value={visitIntent}
            onChange={setVisitIntent}
            options={[
              { value: "yes", label: "있음" },
              { value: "no", label: "없음" },
            ]}
          />
        </div>

        <ReviewTextarea />
      </main>

      <footer className="px-6 pb-6">
        <Button variant="primary" className="w-full" label="등록하기" />
      </footer>
    </div>
  );
}

export default Review;
