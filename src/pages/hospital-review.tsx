import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import Button from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Review from "@/components/review";
import LoadingPage from "@/components/loading";
import { SelectBox, type SelectOption } from "@/components/ui/selectbox";

import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";

interface ReviewType {
  date: string;
  animalType: string;
  department: string;
  revisit: string;
  content: string;
}

interface ApiReviewType {
  reviewId: number;
  hospitalName: string;
  username: string;
  department: string;
  content: string;
  visitDate: string;
  createdDate: string;
  revisitIntention: boolean;
}

function HospitalReview() {
  const location = useLocation();
  const { hospitalData } = location.state || {};
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/api/v1/reviews/hospital/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("리뷰 조회 실패");
        }

        const data: ApiReviewType[] = await res.json();

        const formattedReviews: ReviewType[] = data.map((review) => ({
          date: review.createdDate.replace(/-/g, "."),
          animalType: review.username,
          department: review.department,
          revisit: review.revisitIntention ? "있음" : "없음",
          content: review.content,
        }));

        setReviews(formattedReviews);
      } catch (err) {
        console.error("리뷰 로딩 에러:", err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [BASE_URL]);

  const getYearOptions = (): SelectOption[] => {
    const years = reviews.map((review) => review.date.split(".")[0]);
    const uniqueYears = Array.from(new Set(years)).sort(
      (a, b) => Number(b) - Number(a)
    );

    return [
      { value: "all", label: "전체 년도" },
      ...uniqueYears.map((year) => ({ value: year, label: `${year}년` })),
    ];
  };

  const getMonthOptions = (): SelectOption[] => {
    if (selectedYear === "all") {
      return [{ value: "all", label: "전체 월" }];
    }

    const months = reviews
      .filter((review) => review.date.startsWith(selectedYear))
      .map((review) => review.date.split(".")[1]);

    const uniqueMonths = Array.from(new Set(months)).sort(
      (a, b) => Number(a) - Number(b)
    );

    return [
      { value: "all", label: "전체 월" },
      ...uniqueMonths.map((month) => ({ value: month, label: `${month}월` })),
    ];
  };

  const filterReviews = (list: ReviewType[]) => {
    let filtered = [...list];

    if (selectedYear !== "all") {
      filtered = filtered.filter((review) =>
        review.date.startsWith(selectedYear)
      );
    }

    if (selectedMonth !== "all") {
      filtered = filtered.filter((review) => {
        const [year, month] = review.date.split(".");
        return year === selectedYear && month === selectedMonth;
      });
    }

    return filtered;
  };

  const sortReviews = (list: ReviewType[], order: "asc" | "desc") => {
    return [...list].sort((a, b) => {
      const dateA = new Date(a.date.replace(/\./g, "-")).getTime();
      const dateB = new Date(b.date.replace(/\./g, "-")).getTime();
      return order === "desc" ? dateB - dateA : dateA - dateB;
    });
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setSelectedMonth("all");
  };

  const filteredReviews = filterReviews(reviews);
  const sortedReviews = sortReviews(filteredReviews, sortOrder);

  const yearOptions = getYearOptions();
  const monthOptions = getMonthOptions();

  if (loading) {
    return <LoadingPage message="리뷰를 불러오는 중..." />;
  }

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
          <div className="flex justify-between items-center">
            <h2 className="font-bold">
              최근 방문 리뷰 ({sortedReviews.length})
            </h2>
            <button
              onClick={toggleSortOrder}
              className="flex items-center gap-1 text-xs text-gray-6 hover:text-black"
            >
              {sortOrder === "desc" ? "최신순" : "오래된순"}
              {sortOrder === "desc" ? (
                <ArrowDownWideNarrow size={16} />
              ) : (
                <ArrowUpNarrowWide size={16} />
              )}
            </button>
          </div>

          <div className="flex gap-2 justify-end">
            <div className="w-30">
              <SelectBox
                placeholder="년도 선택"
                options={yearOptions}
                value={selectedYear}
                onChange={handleYearChange}
              />
            </div>

            <div className="w-30">
              <SelectBox
                placeholder="월 선택"
                options={monthOptions}
                value={selectedMonth}
                onChange={setSelectedMonth}
                disabled={selectedYear === "all"}
              />
            </div>

            {(selectedYear !== "all" || selectedMonth !== "all") && (
              <button
                onClick={() => {
                  setSelectedYear("all");
                  setSelectedMonth("all");
                }}
                className="text-xs text-gray-6 hover:text-black underline"
              >
                초기화
              </button>
            )}
          </div>

          <div className="h-full min-h-100 overflow-y-auto scrollbar-thin">
            {sortedReviews.length > 0 ? (
              <Review reviews={sortedReviews} />
            ) : (
              <p className="text-center text-gray-6 py-10">
                {selectedYear !== "all" || selectedMonth !== "all"
                  ? "해당 기간의 리뷰가 없습니다."
                  : "아직 리뷰가 없습니다."}
              </p>
            )}
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
