import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

import LoadingPage from "./loading";

import Footer from "@/components/footer";
import Header from "@/components/header";
import Review from "@/components/review";
import Button from "@/components/ui/button";

import { PencilLine } from "lucide-react";

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

interface ReviewType {
  date: string;
  animalType: string;
  department: string;
  revisit: string;
  content: string;
}

const reviews: ReviewType[] = [
  {
    date: "2025.11.10",
    animalType: "개 (말티즈)",
    department: "예방접종",
    revisit: "있음",
    content: "리뷰리뷰",
  },
  {
    date: "2025.11.09",
    animalType: "개 (포메라니안)",
    department: "건강검진",
    revisit: "없음",
    content: "리뷰".repeat(100),
  },
  {
    date: "2025.11.08",
    animalType: "고양이 (코숏)",
    department: "예방접종",
    revisit: "있음",
    content: "리뷰리뷰리뷰리뷰",
  },
];

function Hospital() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo | null>(null);
  const [hasReview] = useState(true);

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

  const handleGoReview = () => navigate(`/hospital/${id}/review`);

  if (!hospitalInfo) {
    return <LoadingPage message="로딩중..." />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-10 bg-white">
        <Header label={hospitalInfo.name} />
        <div>
          <img
            src={hospitalInfo.image}
            alt={hospitalInfo.alt || "병원 이미지"}
            className="w-full min-h-40 h-[15vh] max-h-60 bg-gray-4 object-cover"
          />
          <section className="flex justify-between mt-4 mx-4 pb-4 border-b border-b-gray-2">
            <div>
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
            <Button label="예약하기" />
          </section>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto scrollbar-hide flex items-center justify-center">
        {hasReview ? (
          <div className="w-full">
            <Review reviews={reviews} />
          </div>
        ) : (
          <Button
            variant="outline"
            label="리뷰를 남겨주세요!"
            className="text-gray-6 border-gray-6 flex gap-2 items-center w-82"
            icon={PencilLine}
            onClick={handleGoReview}
          />
        )}
      </main>

      <div className="sticky bottom-0 z-10 bg-white">
        {hasReview ? (
          <div className="flex flex-col items-center w-full">
            <Button
              variant="outline"
              label="리뷰를 남겨주세요!"
              className="text-gray-6 border-gray-6 flex gap-2 items-center w-82 m-6"
              icon={PencilLine}
              onClick={handleGoReview}
            />
          </div>
        ) : (
          <div />
        )}
        <Footer />
      </div>
    </div>
  );
}

export default Hospital;
