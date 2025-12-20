import { useState, useEffect } from "react";

export interface ReservationData {
  reservationId: number;
  reserverName: string;
  userPhoneNumber: string;
  animalType: string;
  animalTypeDescription: string;
  breed: string;
  breedDescription: string;
  age: number;
  weight: number;
  department: string;
  date: string;
  time: string;
  status: string;
}

export const useReservationList = () => {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/v1/reservations/hospital/management", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      } else {
        console.error("Failed to fetch reservations");
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const executeCompleteReservations = async () => {
    try {
      const token = localStorage.getItem("token");

      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/v1/reservations/${id}/complete`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      alert("진료 완료 처리되었습니다.");
      setSelectedIds([]);
      fetchReservations();
    } catch (error) {
      console.error("Error completing reservations:", error);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  const executeCancelReservations = async () => {
    try {
      const token = localStorage.getItem("token");

      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/v1/reservations/hospital/${id}/cancel`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      alert("예약이 취소되었습니다.");
      setSelectedIds([]);
      fetchReservations();
    } catch (error) {
      console.error("Error cancelling reservations:", error);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return {
    reservations,
    selectedIds,
    handleToggleSelect,
    executeCompleteReservations,
    executeCancelReservations,
  };
};
