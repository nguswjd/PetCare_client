import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";

import Button from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import StatusUserList from "@/components/status-userlist";

interface ReservationData {
  reservationId: number;
  reserverName: string;
  userPhoneNumber: string;
  animalType: string;
  breed: string;
  age: number;
  weight: number;
  department: string;
  date: string;
  time: string;
  status: string;
}

function HospitalReservation() {
  const location = useLocation();
  const { hospitalData } = location.state || {};

  const [reservations, setReservations] = useState<ReservationData[]>([]);

  const [pendingSortOrder, setPendingSortOrder] = useState<"asc" | "desc">(
    "desc"
  );

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "/api/v1/reservations/hospital/management",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

    fetchReservations();
  }, []);

  // 3. [핵심] sortReservations 함수의 매개변수 타입 지정
  // list: ReservationData 배열
  // order: "asc" 또는 "desc"만 가능
  const sortReservations = (list: ReservationData[], order: "asc" | "desc") => {
    return [...list].sort((a, b) => {
      // TypeScript에서 Date 연산을 위해 .getTime() 사용 권장
      const dateA = new Date(`${a.date}T${a.time}`).getTime();
      const dateB = new Date(`${b.date}T${b.time}`).getTime();
      return order === "desc" ? dateB - dateA : dateA - dateB;
    });
  };

  const pendingList = sortReservations(
    reservations.filter(
      (r) => r.status === "PENDING" || r.status === "CONFIRMED"
    ),
    pendingSortOrder
  );

  const cancelledList = sortReservations(
    reservations.filter((r) => r.status === "CANCELLED"),
    "desc"
  );

  const visitedList = sortReservations(
    reservations.filter(
      (r) => r.status === "VISITED" || r.status === "COMPLETED"
    ),
    "desc"
  );

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSortOrder = () => {
    setPendingSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  return (
    <div className="h-dvh flex flex-col">
      <Header label="예약 관리" variant="label" showBackButton={true} />

      <section className="p-4 border-b border-t border-y-gray-3">
        <h2 className="hidden">내 병원 정보</h2>
        <Header
          variant="hospital"
          hospitalData={hospitalData}
          showBackButton={false}
        />
      </section>

      <main className="py-4 flex flex-1 flex-col gap-6 px-6 md:flex-row md:justify-between overflow-auto">
        {/* --- 1. 예약 중 섹션 --- */}
        <section className="w-full flex flex-col gap-4 lg:w-1/3">
          <div className="flex justify-between items-center">
            <h2 className="font-bold">예약 중 ({pendingList.length})</h2>
            <button
              onClick={toggleSortOrder}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-black"
            >
              {pendingSortOrder === "desc" ? "최신순" : "오래된순"}
              {pendingSortOrder === "desc" ? (
                <ArrowDownWideNarrow size={16} />
              ) : (
                <ArrowUpNarrowWide size={16} />
              )}
            </button>
          </div>

          <div className="h-106 w-full overflow-y-auto scrollbar-thin pr-3 flex flex-col gap-2 items-center">
            {pendingList.length > 0 ? (
              pendingList.map((reservation) => (
                <StatusUserList
                  key={reservation.reservationId}
                  data={reservation}
                  isChecked={selectedIds.includes(reservation.reservationId)}
                  onToggle={handleToggleSelect}
                  showCheckbox={true}
                />
              ))
            ) : (
              <p className="text-gray-400 text-sm mt-10">
                예약 대기 내역이 없습니다.
              </p>
            )}
          </div>

          <div className="flex justify-center gap-2 py-2 w-full">
            <Button
              className="w-full max-w-[200px] bg-main-2"
              label="예약 거절"
              onClick={() => console.log("거절할 ID:", selectedIds)}
            />
            <Button
              className="w-full max-w-[200px]"
              label="방문 완료"
              onClick={() => console.log("확정할 ID:", selectedIds)}
            />
          </div>
        </section>

        <section className="w-full flex flex-col gap-4 lg:w-1/3">
          <h2 className="font-bold self-start">
            예약 취소 ({cancelledList.length})
          </h2>
          <div className="h-106 w-full overflow-y-auto scrollbar-thin pr-3 flex flex-col gap-2 items-center">
            {cancelledList.length > 0 ? (
              cancelledList.map((reservation) => (
                <StatusUserList
                  key={reservation.reservationId}
                  data={reservation}
                  showCheckbox={false}
                />
              ))
            ) : (
              <p className="text-gray-400 text-sm mt-10">
                취소된 내역이 없습니다.
              </p>
            )}
          </div>
        </section>

        <section className="w-full flex flex-col gap-4 lg:w-1/3">
          <h2 className="font-bold self-start">
            방문 완료 ({visitedList.length})
          </h2>
          <div className="h-106 w-full overflow-y-auto scrollbar-thin pr-3 flex flex-col gap-2 items-center">
            {visitedList.length > 0 ? (
              visitedList.map((reservation) => (
                <StatusUserList
                  key={reservation.reservationId}
                  data={reservation}
                  showCheckbox={false}
                />
              ))
            ) : (
              <p className="text-gray-400 text-sm mt-10">
                방문 완료 내역이 없습니다.
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

export default HospitalReservation;
