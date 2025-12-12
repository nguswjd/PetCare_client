import { useLocation } from "react-router";

import Button from "@/components/ui/button";

import Header from "@/components/header";
import StatusUserList from "@/components/status-userlist";

function HospitalReservation() {
  const location = useLocation();
  const { hospitalData } = location.state || {};

  return (
    <div className="h-dvh flex flex-col">
      <Header label="병원리뷰" variant="label" showBackButton={true} />

      <section className="p-4 border-b border-t border-y-gray-3">
        <h2 className="hidden">내 병원 정보</h2>
        <Header
          variant="hospital"
          hospitalData={hospitalData}
          showBackButton={false}
        />
      </section>

      <main className="my-4 flex flex-col gap-6 p-6">
        <section className="w-full flex flex-col gap-4">
          <h2 className="font-bold self-start">예약 중</h2>
          <div className="h-106 w-90 overflow-y-auto scrollbar-thin self-center pr-3">
            <StatusUserList />
            <StatusUserList />
            <StatusUserList />
          </div>

          <div className="flex w-full py-2 px-6 self-center gap-1 max-w-106">
            <Button className="w-full bg-main-2" label="예약 거절" />
            <Button className="w-full" label="예약 확정" />
          </div>
        </section>

        <section className="w-full flex flex-col gap-4">
          <h2 className="font-bold self-start">예약 취소</h2>

          <div className="h-106 w-90 overflow-y-auto scrollbar-thin self-center pr-3">
            <StatusUserList />
            <StatusUserList />
            <StatusUserList />
          </div>
        </section>

        <section className="w-full flex flex-col gap-4">
          <h2 className="font-bold self-start">방문 완료</h2>

          <div className="h-106 w-90 overflow-y-auto scrollbar-thin self-center pr-3">
            <StatusUserList />
            <StatusUserList />
            <StatusUserList />
          </div>
        </section>
      </main>
    </div>
  );
}

export default HospitalReservation;
