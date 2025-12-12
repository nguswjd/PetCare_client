import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import Header from "@/components/header";
import Popup from "@/components/popup";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Field from "@/components/ui/field";

import HospitalInfo from "@/components/hospital-detail-info";

import { PencilLine, Check, ChevronLast } from "lucide-react";

interface HospitalData {
  name: string;
  address: string;
  representativeName: string;
  hospitalNumber: string;
  businessRegistrationNumber: string;
  imageUrl: string | null;
  hasParking: boolean;
  departments: string[];
  animalTypes: string[];
  breeds: string[];
  holidays: string[];
  operatingStartTime: string | null;
  operatingEndTime: string | null;
  is24Hours: boolean;
  breakTimes: string[];
}

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
  const [editMode, setEditMode] = useState(false);
  const [hospitalData, setHospitalData] = useState<HospitalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const res = await fetch(`${API_URL}/api/v1/hospital/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("병원 정보를 불러올 수 없습니다.");
        }

        const data = await res.json();
        setHospitalData(data);
      } catch (err: any) {
        console.error(err);
        setAlertPopup({
          open: true,
          message: err.message || "병원 정보를 불러올 수 없습니다.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalData();
  }, [API_URL, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAlertPopup({ open: true, message: "로그아웃 되었습니다." });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    if (!formData) {
      setAlertPopup({
        open: true,
        message: "변경된 내용이 없습니다.",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const form = new FormData();

      if (hospitalData) {
        form.append("representativeName", hospitalData.representativeName);
        form.append("name", hospitalData.name);
        form.append("hospitalNumber", hospitalData.hospitalNumber);
        form.append("address", hospitalData.address);
      }

      form.append("hasParking", JSON.stringify(formData.hasParking));
      form.append("departments", JSON.stringify(formData.departments));
      form.append("animalTypes", JSON.stringify(formData.animalTypes));
      form.append("breeds", JSON.stringify(formData.breeds));
      form.append("holidays", JSON.stringify(formData.holidays));

      if (formData.operatingStartTime) {
        form.append("operatingStartTime", formData.operatingStartTime);
      }
      if (formData.operatingEndTime) {
        form.append("operatingEndTime", formData.operatingEndTime);
      }

      form.append("breakTimes", JSON.stringify(formData.breakTimes));

      if (formData.imageFile) {
        form.append("imageFile", formData.imageFile);
      }

      const res = await fetch(
        `${API_URL}/api/v1/hospital/auth/update-details`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "수정 실패");
      }

      const updatedData = await res.json();
      setHospitalData(updatedData);
      setEditMode(false);
    } catch (err: any) {
      setAlertPopup({
        open: true,
        message: err.message || "정보 수정에 실패했습니다.",
      });
    }
  };

  const handleGoReview = () => navigate(`/hospital-main/review`);
  const handleGoReservation = () => navigate(`/hospital-main/reservation`);

  if (loading) {
    return (
      <div className="h-dvh flex items-center justify-center">
        <p className="text-gray-6">로딩 중...</p>
      </div>
    );
  }

  if (!hospitalData) {
    return (
      <div className="h-dvh flex items-center justify-center">
        <p className="text-gray-6">병원 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col">
      <Header label="병원 관리 페이지" showBackButton={false} />

      <main className="py-4 flex flex-col flex-1 overflow-auto gap-4">
        <section className="p-4 border-b border-t border-b-gray-3 border-t-gray-3">
          <h2 className="hidden">내 병원 정보</h2>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-xl">{hospitalData.name}</h3>
            <p className="flex gap-2 text-gray-6 font-medium text-sm">
              {hospitalData.address}
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <div className="px-6 flex w-full justify-between">
            <h2 className="font-bold">예약내역</h2>
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

        <section className="flex flex-col gap-2">
          <div className="px-6 flex w-full justify-between">
            <h2 className="font-bold">병원 리뷰</h2>
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

        <section className="px-6 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">병원 정보 수정</h3>
            <div className="flex gap-2">
              {!editMode && (
                <Button
                  icon={PencilLine}
                  variant="icon"
                  className="w-4 h-4"
                  onClick={handleEdit}
                />
              )}
              {editMode && (
                <Button
                  icon={Check}
                  variant="icon"
                  className="w-4 h-4"
                  onClick={handleSave}
                />
              )}
            </div>
          </div>

          <Field placeholder={hospitalData?.representativeName} />
          <Field placeholder={hospitalData?.name} />
          <Field placeholder={hospitalData?.address} />

          <HospitalInfo
            editMode={editMode}
            initialData={hospitalData}
            onDataChange={setFormData}
          />
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
          children={
            alertPopup.message === "로그아웃 되었습니다."
              ? `이용해주셔서 감사합니다.\n안녕히가세요.`
              : alertPopup.message
          }
          title={alertPopup.message}
          onClose={() => {
            setAlertPopup({ open: false, message: "" });
            if (alertPopup.message === "로그아웃 되었습니다.") {
              navigate("/");
            }
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
