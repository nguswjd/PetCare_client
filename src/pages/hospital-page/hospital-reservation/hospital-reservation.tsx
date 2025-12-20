import { useLocation } from "react-router";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Popup from "@/components/popup";
import StatusUserList from "@/components/status-userlist";
import Button from "@/components/ui/button";
import { SelectBox } from "@/components/ui/selectbox";

import { useReservationList } from "./hooks/useReservationList";
import { useReservationFilter } from "./hooks/useReservationFilter";
import { useReservationActions } from "./hooks/useReservationActions";

function HospitalReservation() {
  const location = useLocation();
  const { hospitalData } = location.state || {};

  const {
    reservations,
    selectedIds,
    handleToggleSelect,
    executeCompleteReservations,
    executeCancelReservations,
  } = useReservationList();

  const {
    pendingSortOrder,
    selectedYear,
    selectedMonth,
    yearOptions,
    monthOptions,
    pendingList,
    cancelledList,
    visitedList,
    handleYearChange,
    setSelectedMonth,
    toggleSortOrder,
    resetFilters,
  } = useReservationFilter(reservations);

  const {
    popupState,
    closePopup,
    handleCompleteReservations,
    handleCancelReservations,
  } = useReservationActions(
    selectedIds,
    executeCompleteReservations,
    executeCancelReservations
  );

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

      <div className="px-6 pt-4 flex gap-2 justify-end items-center">
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

      <main className="py-4 flex flex-1 flex-col gap-6 px-6 md:flex-row md:justify-between overflow-auto">
        <section className="w-full flex flex-col gap-4 lg:w-1/3">
          <div className="flex justify-between items-center">
            <h2 className="font-bold">예약 중 ({pendingList.length})</h2>
            <button
              onClick={toggleSortOrder}
              className="flex items-center gap-1 text-xs text-gray-6 hover:text-black"
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
                {selectedYear !== "all" || selectedMonth !== "all"
                  ? "해당 기간의 예약이 없습니다."
                  : "예약 대기 내역이 없습니다."}
              </p>
            )}
          </div>

          <div className="flex justify-center gap-2 py-2 w-full">
            <Button
              className="w-full max-w-[200px] bg-main-2"
              label="예약 거절"
              onClick={handleCancelReservations}
            />
            <Button
              className="w-full max-w-[200px]"
              label="진료 완료"
              onClick={handleCompleteReservations}
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
                {selectedYear !== "all" || selectedMonth !== "all"
                  ? "해당 기간의 취소 내역이 없습니다."
                  : "취소된 내역이 없습니다."}
              </p>
            )}
          </div>
        </section>

        <section className="w-full flex flex-col gap-4 lg:w-1/3">
          <h2 className="font-bold self-start">
            진료 완료 ({visitedList.length})
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
                {selectedYear !== "all" || selectedMonth !== "all"
                  ? "해당 기간의 완료 내역이 없습니다."
                  : "방문 완료 내역이 없습니다."}
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

      <Popup
        open={popupState.open}
        type={popupState.type}
        title={popupState.title}
        onClose={closePopup}
        onConfirm={popupState.onConfirm}
      >
        {popupState.type === "alert" && popupState.content}
      </Popup>
    </div>
  );
}

export default HospitalReservation;
