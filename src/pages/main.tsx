import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import Card from "../components/ui/card";
import Input from "../components/ui/input";
import Footer from "../components/footer";
import { getRecentHospitalsUnified } from "@/utils/recentHospitals";
import { MapPin } from "lucide-react";

import Ad1 from "@/assets/ads/ad1_petcare.png";
import Ad2 from "@/assets/ads/ad2_cites.png";
import Ad3 from "@/assets/ads/ad3_animalfood.jpg";
import Ad4 from "@/assets/ads/ad1_petcare.png";
import Ad5 from "@/assets/ads/ad2_cites.png";
import Ad6 from "@/assets/ads/ad3_animalfood.jpg";

interface HospitalType {
  id: number;
  image: string;
  alt: string;
  name: string;
  address: string;
  businessStatus: string;
  distance?: string;
}

function MainPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const [recentHospitals, setRecentHospitals] = useState<HospitalType[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  const ads = [
    { id: 1, image: Ad1, alt: "petcare 홍보물" },
    { id: 2, image: Ad2, alt: "사이테스 관련 안내문" },
    { id: 3, image: Ad3, alt: "동물 사료 홍보물" },
    { id: 4, image: Ad4, alt: "광고4" },
    { id: 5, image: Ad5, alt: "광고5" },
    { id: 6, image: Ad6, alt: "광고6" },
  ];

  const closestHospital = {
    id: 5,
    image: "",
    alt: "가까운 병원",
    name: "C hospital",
    address: "제주시 이도동",
    businessStatus: "영업종료",
    distance: "30km",
  };

  const reviewKingHospital = {
    id: 6,
    image: "",
    alt: "이달의 추천",
    name: "D hospital",
    address: "제주시 이도동",
    businessStatus: "영업종료",
    distance: "30km",
  };

  useEffect(() => {
    const loadRecentHospitals = async () => {
      setLoadingRecent(true);
      try {
        const hospitals = await getRecentHospitalsUnified();

        const formatted = hospitals.map((h) => ({
          id: h.id,
          image: h.imageUrl || "",
          alt: h.name,
          name: h.name,
          address: h.address.split(" ").slice(0, 2).join(" "),
          businessStatus: h.operatingStatus,
        }));

        setRecentHospitals(formatted);
      } catch (e) {
        console.error(e);
        setRecentHospitals([]);
      } finally {
        setLoadingRecent(false);
      }
    };

    loadRecentHospitals();
  }, []);

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
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth;
      setCurrentIndex(Math.round(scrollLeft / cardWidth));
    }
  };

  return (
    <div className="bg-white flex flex-col h-dvh">
      <header onClick={() => navigate("/search")}>
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
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {ads.map((ad) => (
              <div key={ad.id} className="w-full flex-shrink-0 snap-center">
                <Card size="lg" image={ad.image} alt={ad.alt} />
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

        {!loadingRecent && (
          <section className="flex flex-col gap-2">
            <h2 className="text-base px-6 font-bold">최근 검색한 병원</h2>
            {recentHospitals.length === 0 ? (
              <p className="text-center text-gray-5 py-20">
                최근 본 병원이 없습니다
              </p>
            ) : (
              <div className="flex px-6 gap-2 overflow-x-auto scrollbar-hide">
                {recentHospitals.map((hospital) => (
                  <Card
                    key={hospital.id}
                    size="md"
                    image={hospital.image}
                    alt={hospital.alt}
                    name={hospital.name}
                    address={hospital.address}
                    businessStatus={hospital.businessStatus}
                    onClick={() => navigate(`/hospital/${hospital.id}`)}
                    className="cursor-pointer"
                  />
                ))}
              </div>
            )}
          </section>
        )}

        <div className="grid px-6 mb-5 gap-3 grid-cols-2">
          <section className="flex flex-col gap-2">
            <h2 className="text-base font-bold">가까운 병원</h2>
            <Card
              size="lg"
              image={closestHospital.image}
              alt={closestHospital.alt}
              name={closestHospital.name}
              address={closestHospital.address}
              businessStatus={closestHospital.businessStatus}
              distance={closestHospital.distance}
              onClick={() => navigate(`/hospital/${closestHospital.id}`)}
              className="cursor-pointer"
            />
          </section>
          <section className="flex flex-col gap-2">
            <h2 className="text-base font-bold">이달의 추천</h2>
            <Card
              size="lg"
              image={reviewKingHospital.image}
              alt={reviewKingHospital.alt}
              name={reviewKingHospital.name}
              address={reviewKingHospital.address}
              businessStatus={reviewKingHospital.businessStatus}
              distance={reviewKingHospital.distance}
              onClick={() => navigate(`/hospital/${reviewKingHospital.id}`)}
              className="cursor-pointer"
            />
          </section>
        </div>
      </main>
      <div className="sticky bottom-0 z-10 bg-white">
        <Footer />
      </div>
    </div>
  );
}

export default MainPage;
