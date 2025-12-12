import { useLocation } from "react-router";

import Button from "@/components/ui/button";

import Header from "@/components/header";
import Footer from "@/components/footer";
import StatusUserList from "@/components/status-userlist";

function HospitalReservation() {
  const location = useLocation();
  const { hospitalData } = location.state || {};

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
        <section className="w-full flex flex-col gap-4 lg:w-1/3">
          <h2 className="font-bold self-start">예약 중</h2>
          <div className="h-106 w-full overflow-y-auto scrollbar-thin pr-3 flex flex-col gap-5 items-center">
            <StatusUserList />
            <StatusUserList />
            <StatusUserList />
          </div>

          <div className="flex justify-center gap-2 py-2 w-full">
            <Button
              className="w-full max-w-[200px] bg-main-2"
              label="예약 거절"
            />
            <Button className="w-full max-w-[200px]" label="예약 확정" />
          </div>
        </section>

        <section className="w-full flex flex-col gap-4 lg:w-1/3">
          <h2 className="font-bold self-start">예약 취소</h2>
          <div className="h-106 w-full overflow-y-auto scrollbar-thin pr-3 flex flex-col gap-5 items-center">
            <StatusUserList />
            <StatusUserList />
            <StatusUserList />
          </div>
        </section>

        <section className="w-full flex flex-col gap-4 lg:w-1/3">
          <h2 className="font-bold self-start">방문 완료</h2>
          <div className="h-106 w-full overflow-y-auto scrollbar-thin pr-3 flex flex-col gap-5 items-center">
            <StatusUserList />
            <StatusUserList />
            <StatusUserList />
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
