import { useState, useMemo } from "react";
import type { ReservationData } from "./useReservationList";
import type { SelectOption } from "@/components/ui/selectbox";

export const useReservationFilter = (reservations: ReservationData[]) => {
  const [pendingSortOrder, setPendingSortOrder] = useState<"asc" | "desc">(
    "desc"
  );
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  const getYearOptions = (): SelectOption[] => {
    const years = reservations.map(
      (reservation) => reservation.date.split("-")[0]
    );
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

    const months = reservations
      .filter((reservation) => reservation.date.startsWith(selectedYear))
      .map((reservation) => reservation.date.split("-")[1]);

    const uniqueMonths = Array.from(new Set(months)).sort(
      (a, b) => Number(a) - Number(b)
    );

    return [
      { value: "all", label: "전체 월" },
      ...uniqueMonths.map((month) => ({ value: month, label: `${month}월` })),
    ];
  };

  const filterReservationsByDate = (list: ReservationData[]) => {
    let filtered = [...list];

    if (selectedYear !== "all") {
      filtered = filtered.filter((reservation) =>
        reservation.date.startsWith(selectedYear)
      );
    }

    if (selectedMonth !== "all") {
      filtered = filtered.filter((reservation) => {
        const [year, month] = reservation.date.split("-");
        return year === selectedYear && month === selectedMonth;
      });
    }

    return filtered;
  };

  const sortReservations = (list: ReservationData[], order: "asc" | "desc") => {
    return [...list].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`).getTime();
      const dateB = new Date(`${b.date}T${b.time}`).getTime();
      return order === "desc" ? dateB - dateA : dateA - dateB;
    });
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setSelectedMonth("all");
  };

  const toggleSortOrder = () => {
    setPendingSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const filteredReservations = useMemo(
    () => filterReservationsByDate(reservations),
    [reservations, selectedYear, selectedMonth]
  );

  const pendingList = useMemo(
    () =>
      sortReservations(
        filteredReservations.filter(
          (r) => r.status === "PENDING" || r.status === "CONFIRMED"
        ),
        pendingSortOrder
      ),
    [filteredReservations, pendingSortOrder]
  );

  const cancelledList = useMemo(
    () =>
      sortReservations(
        filteredReservations.filter(
          (r) => r.status === "CANCELLED" || r.status === "NO_SHOW"
        ),
        "desc"
      ),
    [filteredReservations]
  );

  const visitedList = useMemo(
    () =>
      sortReservations(
        filteredReservations.filter(
          (r) => r.status === "VISITED" || r.status === "COMPLETED"
        ),
        "desc"
      ),
    [filteredReservations]
  );

  return {
    pendingSortOrder,
    selectedYear,
    selectedMonth,
    yearOptions: getYearOptions(),
    monthOptions: getMonthOptions(),
    pendingList,
    cancelledList,
    visitedList,
    handleYearChange,
    setSelectedMonth,
    toggleSortOrder,
    resetFilters: () => {
      setSelectedYear("all");
      setSelectedMonth("all");
    },
  };
};
