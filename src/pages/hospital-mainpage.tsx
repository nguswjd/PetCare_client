import { useState } from "react";
import { useNavigate } from "react-router";

import Header from "@/components/header";
import Popup from "@/components/popup";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

import HospitalInfo from "@/components/hospital-detail-info";

import { PencilLine, ChevronLast } from "lucide-react";

function HospitalMainPage() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [alertPopup, setAlertPopup] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });
  const [passwordError, setPasswordError] = useState(false);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/api/v1/hospital/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "로그아웃 실패");
      }

      localStorage.removeItem("token");
      setAlertPopup({ open: true, message: "로그아웃 되었습니다." });
    } catch (err: any) {
      setAlertPopup({ open: true, message: err.message || "로그아웃 실패" });
    }
  };

  const handleGoReview = () => navigate(`/hospital-main/review`);
  const handleGoReservation = () => navigate(`/hospital-main/reservation`);

  return (
    <div className="h-dvh flex flex-col">
      <Header label="병원 관리 페이지" showBackButton={false} />

      <main className="py-4 flex flex-col flex-1 overflow-auto gap-4">
        <section className="p-4 border-b border-t border-b-gray-3 border-t-gray-3">
          <h2 className="hidden">내 병원 정보</h2>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-xl">A hosptial</h3>
            <p className="flex gap-2 text-gray-6 font-medium text-sm">
              경기도 수원시 뭐시기뭐시기
            </p>
          </div>
        </section>

        <section>
          <div className="px-6 flex w-full justify-between">
            <h2 className="font-bold">예약내역</h2>
            <Button
              variant="icon"
              icon={ChevronLast}
              className="w-4 h-4"
              onClick={handleGoReview}
            />
          </div>
          <div className="flex gap-2 px-6 overflow-x-auto scrollbar-hide">
            <Card
              size="sm"
              image=""
              name="예약자명"
              animalType="육지동물 / 고양이"
              className="[&>div]:gap-y-0.5"
            />
            <Card
              size="sm"
              image=""
              name="예약자명"
              animalType="육지동물 / 고양이"
              className="[&>div]:gap-y-0.5"
            />
            <Card
              size="sm"
              image=""
              name="예약자명"
              animalType="육지동물 / 고양이"
              className="[&>div]:gap-y-0.5"
            />
          </div>
        </section>

        <section>
          <div className="px-6 flex w-full justify-between">
            <h2 className="font-bold">병원 리뷰</h2>
            <Button
              variant="icon"
              icon={ChevronLast}
              className="w-4 h-4"
              onClick={handleGoReservation}
            />
          </div>

          <div className="flex gap-2 px-6 overflow-x-auto scrollbar-hide">
            <Card
              size="sm"
              image=""
              alt="병원 이미지"
              name="예약자명"
              animalType="육지동물 / 고양이"
              content="리뷰리뷰리뷰리뷰"
              className="[&>div]:gap-y-0.5"
            />
            <Card
              size="sm"
              image=""
              alt="병원 이미지"
              name="예약자명"
              animalType="육지동물 / 개(대형)"
              content="리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰"
              className="[&>div]:gap-y-0.5"
            />
            <Card
              size="sm"
              image=""
              alt="병원 이미지"
              name="예약자명"
              animalType="조류 / 앵무새"
              content="리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰리뷰"
              className="[&>div]:gap-y-0.5"
            />
          </div>
        </section>

        <section className="px-6">
          <h2 className="hidden">병원 정보 수정</h2>
          <div className="flex justify-between items-center">
            <h3 className="font-bold">내 정보 수정</h3>
            <div className="flex gap-2">
              {/* {!editMode && (
                <Button
                  icon={PencilLine}
                  variant="icon"
                  className="w-4 h-4"
                  onClick={handleEdit}
                />
              )}
              {editMode && (
                <Button
                  icon={CheckLine}
                  variant="icon"
                  className="w-4 h-4"
                  onClick={handleSave}
                />
              )} */}
            </div>
          </div>

          <HospitalInfo />
        </section>
      </main>

      <div className="flex w-full py-2 px-6 gap-1">
        <Button
          className="w-full bg-main-2"
          label="회원탈퇴"
          onClick={() => {
            setShowPopup(true);
            setPasswordError(false);
          }}
        />
        <Button className="w-full" label="로그아웃" onClick={handleLogout} />
      </div>

      {showPopup && (
        <Popup
          open={showPopup}
          type="form"
          title="탈퇴를 진행하시겠습니까?"
          placeholder="비밀번호를 입력해주세요."
          confirmLabel="탈퇴"
          cancelLabel="취소"
          onConfirm={async (password) => {
            if (!password) {
              setPasswordError(true);
              return;
            }

            try {
              const token = localStorage.getItem("token");
              const API_URL = import.meta.env.VITE_API_URL;

              const res = await fetch(
                `${API_URL}/api/v1/hospital/auth/withdraw`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({ password }),
                }
              );

              if (!res.ok) {
                const errorData = await res.json();
                if (res.status === 401 || res.status === 400) {
                  setPasswordError(true);
                  return;
                }
                throw new Error(errorData.message || "회원탈퇴 실패");
              }

              localStorage.removeItem("token");
              setShowPopup(false);
              navigate("/");
            } catch (err: any) {
              setShowPopup(false);
              setAlertPopup({
                open: true,
                message: err.message || "회원탈퇴 실패",
              });
            }
          }}
          onCancel={() => setShowPopup(false)}
          onClose={() => setShowPopup(false)}
          error={passwordError}
          errorMessage="비밀번호가 일치하지 않습니다."
        />
      )}

      {alertPopup.open && (
        <Popup
          open={alertPopup.open}
          type="alert"
          children={`이용해주셔서 감사합니다.\n안녕히가세요.`}
          title={alertPopup.message}
          onClose={() => {
            setAlertPopup({ open: false, message: "" });
            navigate("/");
          }}
        />
      )}

      <footer className="flex mb-4 justify-between px-6 py-2 border-y border-gray-3">
        <div className="flex flex-col">
          <p className="font-semibold text-base">PET CARE 문의하기</p>
          <a href="mailto:nguswjd02@ajou.ac.kr" className="text-gray-6 text-xs">
            nguswjd02@ajou.ac.kr
          </a>
        </div>
        <img src="/PetCare_logo.svg" className="w-10 h-10" alt="petcare 로고" />
      </footer>
    </div>
  );
}

export default HospitalMainPage;
