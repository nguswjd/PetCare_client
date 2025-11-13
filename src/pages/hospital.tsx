import Button from "@/components/ui/button";
import Footer from "@/components/footer";
import Review from "@/components/review";

import { ChevronLeft, PencilLine } from "lucide-react";

function Hospital() {
  const hospitalInfo = {
    id: 6,
    image: "",
    alt: "이달의 리뷰왕",
    name: "D hospital",
    address: "제주시 이도동",
    businessStatus: "영업종료",
    distance: "30km",
  };

  const reviews = [
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

  const hasReview = true;
  // const hasReview = false;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-10 bg-white">
        <header className="relative flex w-full h-14 items-center px-4">
          <Button variant="icon" icon={ChevronLeft} />
          <h2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-base text-black">
            {hospitalInfo.name}
          </h2>
        </header>

        <div>
          <img
            src={hospitalInfo.image}
            alt={hospitalInfo.alt}
            className="w-full min-h-40 h-[15vh] max-h-60 bg-gray-4 object-cover"
          />
          <section className="flex justify-between mt-4 mx-4 pb-4 border-b border-b-gray-2">
            <div>
              <h3 className="font-semibold text-xl">{hospitalInfo.name}</h3>
              <div className="flex gap-2 text-gray-6 font-medium text-sm">
                <p>{hospitalInfo.businessStatus}</p>
                <p>{hospitalInfo.distance}</p>
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
