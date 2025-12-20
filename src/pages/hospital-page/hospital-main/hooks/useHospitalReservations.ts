import { useState, useEffect } from "react";

export interface ReservationData {
  reservationId: number;
  reserverName: string;
  animalType: string;
  breed: string;
  date: string;
  time: string;
  status: string;
}

export const useHospitalReservations = () => {
  const [reservations, setReservations] = useState<ReservationData[]>([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const reservationRes = await fetch(
        "/api/v1/reservations/hospital/management",
        { headers }
      );

      if (reservationRes.ok) {
        const reservationData = await reservationRes.json();
        setReservations(reservationData);
      } else {
        console.error("예약 정보를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      setReservations([]);
    }
  };

  const getPendingList = () => {
    return reservations
      .filter((r) => r.status === "PENDING" || r.status === "CONFIRMED")
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`).getTime();
        const dateB = new Date(`${b.date}T${b.time}`).getTime();
        return dateA - dateB;
      });
  };

  return {
    reservations,
    pendingList: getPendingList(),
  };
};
