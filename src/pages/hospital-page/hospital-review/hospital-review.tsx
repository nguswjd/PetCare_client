import { useLocation } from "react-router";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";

import Button from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Review from "@/components/review";
import LoadingPage from "@/components/loading";
import { SelectBox } from "@/components/ui/selectbox";

import { useReviewList } from "./hooks/useReviewList";
import { useReviewFilter } from "./hooks/useReviewFilter";

interface EnumInfo {
  code: string;
  label: string;
}

interface HospitalDataType {
  name: string;
  address: string;
  imageUrl: string;
  departments: EnumInfo[];
  breeds: EnumInfo[];
}

function HospitalReview() {
  const location = useLocation();

  const state = location.state as { hospitalData: HospitalDataType };
  const { hospitalData } = state || {};

  const { reviews, loading } = useReviewList();

  const {
    sortOrder,
    selectedYear,
    selectedMonth,
    yearOptions,
    monthOptions,
    sortedReviews,
    toggleSortOrder,
    handleYearChange,
    setSelectedMonth,
    resetFilters,
  } = useReviewFilter(reviews);

  if (loading) {
    return <LoadingPage message="리뷰를 불러오는 중..." />;
  }

  if (!hospitalData) {
    return <div>병원 정보를 찾을 수 없습니다.</div>;
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
          <div className="mx-6 text-xs flex flex-col gap-2 border-b border-gray-4 pb-4 mb-2">
            <p className="font-bold text-sm">병원 정보</p>
            <div className="ml-2 flex flex-col gap-1">
              <p>
                진료 과목:{" "}
                {hospitalData.departments?.map((dept) => dept.label).join(", ")}
              </p>
              <p>
                진료동물:{" "}
                {hospitalData.breeds?.map((breed) => breed.label).join(", ")}
              </p>
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
                onClick={resetFilters}
                className="text-xs text-gray-6 hover:text-black underline"
              >
                초기화
              </button>
            )}
          </div>

          <div className="h-full min-h-100 overflow-y-auto scrollbar-thin">
            {sortedReviews.length > 0 ? (
              <Review reviews={sortedReviews} onDelete={() => {}} />
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
