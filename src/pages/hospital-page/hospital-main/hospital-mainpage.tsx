import { useState } from "react";
import { useNavigate } from "react-router";
import { PencilLine, Check, ChevronLast } from "lucide-react";

import Header from "@/components/header";
import Popup from "@/components/popup";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import HospitalInfo from "@/components/hospital-detail-info";

import { useHospitalAuth } from "./hooks/useHospitalAuth";
import { useHospitalInfo } from "./hooks/useHospitalInfo";
import { useHospitalReservations } from "./hooks/useHospitalReservations";
import { useHospitalReviews } from "./hooks/useHospitalReviews";

function HospitalMainPage() {
  const navigate = useNavigate();
  const [alertPopup, setAlertPopup] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });

  const {
    showWithdrawPopup,
    setShowWithdrawPopup,
    passwordError,
    setPasswordError,
    logout,
    withdraw,
  } = useHospitalAuth();

  const {
    hospitalData,
    loading,
    editMode,
    formData,
    setFormData,
    handleEdit,
    handleSave,
  } = useHospitalInfo();

  const { pendingList } = useHospitalReservations();
  const { reviews } = useHospitalReviews();

  const handleLogout = () => {
    const result = logout();
    setAlertPopup({ open: true, message: result.message });
  };

  const handleSaveInfo = async () => {
    const result = await handleSave();
    if (!result.success && result.message) {
      setAlertPopup({ open: true, message: result.message });
    }
  };

  const handleGoReview = () => {
    navigate("/hospital-main/review", { state: { hospitalData } });
  };

  const handleGoReservation = () => {
    navigate("/hospital-main/reservation", { state: { hospitalData } });
  };

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
        <p className="text-gray-6">정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col relative">
      <Header label="병원 관리 페이지" showBackButton={false} />

      <main className="pb-5 md:pb-0 flex flex-col flex-1 overflow-auto">
        <section className="p-4 border-y border-y-gray-3">
          <h2 className="hidden">내 병원 정보</h2>
          <Header
            variant="hospital"
            hospitalData={hospitalData}
            showBackButton={false}
          />
        </section>

        <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6 md:py-4 md:flex-1 md:overflow-hidden">
          <div className="flex flex-col gap-4 md:col-span-1 md:overflow-auto scrollbar-hide">
            <section
              className="flex flex-col gap-2 border-b border-gray-4 mx-6 md:mx-0 pb-6 cursor-pointer"
              onClick={handleGoReservation}
            >
              <div className="flex w-full justify-between md:pl-6 mt-4 md:mt-0">
                <h2 className="font-bold">예약내역</h2>
                <Button variant="icon" icon={ChevronLast} className="w-4 h-4" />
              </div>

              <div className="flex md:pl-6 gap-2 overflow-x-auto scrollbar-hide px-6 md:px-0 -mx-6 md:mx-0">
                {pendingList.length > 0 ? (
                  pendingList.map((res) => (
                    <Card
                      key={res.reservationId}
                      size="sm"
                      image={hospitalData.imageUrl || ""}
                      name={res.reserverName}
                      content={`${res.animalType} / ${res.breed}`}
                    />
                  ))
                ) : (
                  <p className="text-sm w-full text-gray-5 text-center py-10">
                    진행 중인 예약이 없습니다.
                  </p>
                )}
              </div>
            </section>

            <section
              className="flex flex-col gap-2 border-b border-gray-4 mx-6 md:mx-0 pb-6 cursor-pointer mb-4"
              onClick={handleGoReview}
            >
              <div className="flex w-full justify-between md:pl-6">
                <h2 className="font-bold">병원 리뷰 ({reviews.length})</h2>
                <Button variant="icon" icon={ChevronLast} className="w-4 h-4" />
              </div>

              <div className="flex md:pl-6 gap-2 pb-6 overflow-x-auto scrollbar-hide px-6 md:px-0 -mx-6 md:mx-0">
                {reviews.length > 0 ? (
                  reviews
                    .slice(0, 3)
                    .map((review) => (
                      <Card
                        key={review.reviewId}
                        size="sm"
                        image={hospitalData.imageUrl || ""}
                        alt="병원 이미지"
                        name={review.username}
                        animalType={review.department}
                        content={review.content}
                      />
                    ))
                ) : (
                  <p className="text-sm w-full text-gray-5 text-center py-10">
                    아직 리뷰가 없습니다.
                  </p>
                )}
              </div>
            </section>
          </div>

          <section className="px-6 md:px-0 flex flex-col gap-2 md:col-span-2 md:overflow-auto scrollbar-hide mr-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">병원 정보 수정</h3>
              <div className="flex gap-2">
                {!editMode && (
                  <Button
                    icon={PencilLine}
                    variant="icon"
                    iconSize="w-5 h-5"
                    onClick={handleEdit}
                  />
                )}
                {editMode && (
                  <Button
                    icon={Check}
                    variant="icon"
                    iconSize="w-5 h-5"
                    onClick={handleSaveInfo}
                  />
                )}
              </div>
            </div>

            <HospitalInfo
              editMode={editMode}
              initialData={hospitalData}
              onDataChange={setFormData}
              showBasicFields={true}
              basicFieldsData={{
                representativeName: hospitalData?.representativeName,
                name: hospitalData?.name,
                address: hospitalData?.address,
              }}
            />
          </section>
        </div>
      </main>

      <div className="flex w-full md:absolute md:top-2.5 md:right-6 md:w-auto md:p-0 py-2 px-6 gap-1">
        <Button
          className="w-full md:w-22 bg-main-2"
          label="회원탈퇴"
          onClick={() => {
            setShowWithdrawPopup(true);
            setPasswordError(false);
          }}
        />
        <Button
          className="w-full md:w-22"
          label="로그아웃"
          onClick={handleLogout}
        />
      </div>

      {showWithdrawPopup && (
        <Popup
          open={showWithdrawPopup}
          type="form"
          title="탈퇴를 진행하시겠습니까?"
          placeholder="비밀번호를 입력해주세요."
          confirmLabel="탈퇴"
          cancelLabel="취소"
          onConfirm={async (password) => {
            const result = await withdraw(password);
            if (result.invalidPassword) {
              return;
            }

            if (result.success) {
              setShowWithdrawPopup(false);
              navigate("/");
            } else if (result.message) {
              setShowWithdrawPopup(false);
              setAlertPopup({ open: true, message: result.message });
            }
          }}
          onCancel={() => setShowWithdrawPopup(false)}
          onClose={() => setShowWithdrawPopup(false)}
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
            if (alertPopup.message === "로그아웃 되었습니다.") navigate("/");
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
