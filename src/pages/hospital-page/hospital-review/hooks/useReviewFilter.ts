import { useState, useMemo } from "react";
import type { ReviewType } from "@/components/review";
import type { SelectOption } from "@/components/ui/selectbox";

export const useReviewFilter = (reviews: ReviewType[]) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

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

  const filteredReviews = useMemo(
    () => filterReviews(reviews),
    [reviews, selectedYear, selectedMonth]
  );

  const sortedReviews = useMemo(
    () => sortReviews(filteredReviews, sortOrder),
    [filteredReviews, sortOrder]
  );

  return {
    sortOrder,
    selectedYear,
    selectedMonth,
    yearOptions: getYearOptions(),
    monthOptions: getMonthOptions(),
    sortedReviews,
    toggleSortOrder,
    handleYearChange,
    setSelectedMonth,
    resetFilters: () => {
      setSelectedYear("all");
      setSelectedMonth("all");
    },
  };
};
