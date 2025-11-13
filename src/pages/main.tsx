import { useState, useEffect, useRef } from "react";
import Card from "../components/ui/card";
import Input from "../components/ui/input";
import Footer from "../components/footer";

import { MapPin } from "lucide-react";

function MainPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  const ads = [
    { id: 1, alt: "광고1" },
    { id: 2, alt: "광고2" },
    { id: 3, alt: "광고3" },
    { id: 4, alt: "광고4" },
    { id: 5, alt: "광고5" },
    { id: 6, alt: "광고6" },
  ];

  const recentHospitals = [
    {
      id: 1,
      image: "",
      alt: "병원1",
      name: "A hospital",
      address: "제주시 외도동",
      businessStatus: "24시간 영업",
      distance: "30km",
    },
    {
      id: 2,
      image: "",
      alt: "병원2",
      name: "B hospital",
      address: "제주시 아라동",
      businessStatus: "영업중",
      distance: "30km",
    },
    {
      id: 3,
      image: "",
      alt: "병원3",
      name: "C hospital",
      address: "제주시 이도동",
      businessStatus: "영업종료",
      distance: "30km",
    },
    {
      id: 4,
      image: "",
      alt: "병원4",
      name: "D hospital",
      address: "제주시 외도동",
      businessStatus: "24시간 영업",
      distance: "30km",
    },
  ];

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
    }
  };

  const startAutoScroll = () => {
    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % ads.length;
        scrollToIndex(next);
        return next;
      });
    }, 3000);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="bg-white flex flex-col h-dvh">
      <header>
        <Input
          leftIcon={MapPin}
          placeholder="검색어를 입력해주세요."
          variant="Search"
          className="m-4"
        />
      </header>
      <main className="pt-6 flex flex-col gap-8 flex-1 overflow-auto">
        <div className="px-6 relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onTouchStart={stopAutoScroll}
            onTouchEnd={startAutoScroll}
            onMouseDown={stopAutoScroll}
            onMouseUp={startAutoScroll}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {ads.map((ad) => (
              <div key={ad.id} className="w-full flex-shrink-0 snap-center">
                <Card size="lg" image="" alt={ad.alt} />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-1.5 mt-3">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  scrollToIndex(index);
                  stopAutoScroll();
                  setTimeout(startAutoScroll, 3000);
                }}
                className={`h-1 w-1 rounded-full transition-all ${
                  index === currentIndex ? "bg-black" : "bg-gray-4"
                }`}
              />
            ))}
          </div>
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="text-base px-6  font-bold">최근 검색한 병원</h2>
          <div className="flex px-6 gap-2 overflow-x-auto scrollbar-hide ">
            {recentHospitals.map((hospital) => (
              <Card
                key={hospital.id}
                size="md"
                image={hospital.image}
                alt={hospital.alt}
                name={hospital.name}
                address={hospital.address}
                businessStatus={hospital.businessStatus}
                distance={hospital.distance}
              />
            ))}
          </div>
        </section>

        <div className="grid px-6  mb-5 gap-3 grid-cols-2">
          <section className="flex flex-col gap-2">
            <h2 className="text-base font-bold">가까운 병원</h2>
            <Card
              image=""
              name="C hospital  "
              address="제주시 이도동"
              businessStatus="영업종료"
              distance="30km"
              size="lg"
              alt="가까운 병원"
            />
          </section>
          <section className="flex flex-col gap-2">
            <h2 className="text-base font-bold">이달의 리뷰왕</h2>
            <Card
              image=""
              name="C hospital  "
              address="제주시 이도동"
              businessStatus="영업종료"
              distance="30km"
              size="lg"
              alt="이달의 리뷰왕"
            />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MainPage;
