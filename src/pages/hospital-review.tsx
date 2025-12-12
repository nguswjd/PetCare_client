import { useLocation } from "react-router";

import Button from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Review from "@/components/review";

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

function HospitalReview() {
  const location = useLocation();
  const { hospitalData } = location.state || {};

  return (
    <div className="h-dvh flex flex-col">
      <Header label="병원 리뷰" variant="label" showBackButton={true} />

      <section className="p-4 border-b border-t border-y-gray-3">
        <h2 className="hidden">내 병원 정보</h2>
        <Header
          variant="hospital"
          hospitalData={hospitalData}
          showBackButton={false}
        />
      </section>

      <main className="flex flex-1 flex-col md:flex-row md:gap-4 overflow-auto">
        <section className="md:basis-1/2">
          {hospitalData.imageUrl && (
            <img
              src={hospitalData.imageUrl}
              alt={hospitalData.name}
              className="w-full h-73 object-cover"
            />
          )}
          <div className="flex gap-2 px-6 py-4 items-center">
            <p className="text-black font-semibold text-xl">
              {hospitalData.name}
            </p>
            <p className="text-sm text-gray-6">
              {hospitalData.address.split(" ").slice(1, 3).join(" ")}
            </p>
          </div>

          <div className="px-6 text-xs flex flex-col gap-2">
            <p className="font-bold text-sm">병원 정보</p>
            <div className="ml-2">
              <p>진료 과목: {hospitalData.departments.join(", ")}</p>
              <p>진료동물: {hospitalData.breeds.join(", ")}</p>
              <p>
                오시는 길 :<br />
                {hospitalData.address}
              </p>
            </div>
          </div>
        </section>

        <section className="md:basis-1/2 px-6 my-4 flex flex-col gap-4">
          <h2 className="font-bold">최근 방문 리뷰</h2>
          <div className="h-full min-h-100 overflow-y-auto scrollbar-thin">
            <Review reviews={reviews} />
          </div>
        </section>
      </main>

      <Footer variant="hospital" />

      <div className="absolute top-2 right-6 z-10">
        <Button
          label="로그아웃"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        />
      </div>
    </div>
  );
}

export default HospitalReview;
