import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import Header from "@/components/header";
import Popup from "@/components/popup";
import LoadingPage from "@/components/loading";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Field from "@/components/ui/field";
import Input from "@/components/ui/input";
import { SelectBox } from "@/components/ui/selectbox";
import Footer from "@/components/footer";
import { PencilLine, CheckLine } from "lucide-react";

import { useAuth } from "./hooks/useAuth";
import { useUserForm } from "./hooks/useUserForm";
import { useReservations } from "./hooks/useReservations";
import { useReviews, type ReviewResponse } from "./hooks/useReviews";
import { useAnimalTypes } from "./hooks/useAnimalTypes";

function Mypage() {
  const navigate = useNavigate();
  const { isLoading, userInfo, logout, withdraw, updateUserInfo } = useAuth();
  const {
    form,
    editMode,
    errors,
    verifiedPhone,
    handleEdit,
    checkPhoneDuplicate,
    handleSave,
    updateField,
    resetForm,
  } = useUserForm(userInfo);

  const {
    reservations,
    hospitalsInfo,
    animalTypeMap,
    breedMap,
    selectedReservation,
    setSelectedReservation,
    cancelReservation,
  } = useReservations();

  const { myReviews } = useReviews();

  const { animalTypes, breeds, getAnimalTypeLabel, getBreedLabel } =
    useAnimalTypes(form.animalType);

  const displayBreeds = useAnimalTypes(userInfo.animalType).breeds;

  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showWithdrawComplete, setShowWithdrawComplete] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [alertPopup, setAlertPopup] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    if (userInfo.name) {
      resetForm(userInfo);
    }
  }, [userInfo]);

  const handleLogout = async () => {
    const result = await logout();
    setAlertPopup({ open: true, message: result.message });
  };

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;

    const result = await cancelReservation(selectedReservation.id);
    if (result.success) {
      setShowCancelPopup(false);
      setShowSuccessPopup(true);
    }
  };

  const handleSaveForm = async () => {
    const result = await handleSave();
    if (result.success && result.updatedForm) {
      updateUserInfo(result.updatedForm);
    }
  };

  if (isLoading || !userInfo.name) return <LoadingPage message="로딩중..." />;

  return (
    <div className="h-dvh bg-white flex flex-col relative">
      <Header label="마이페이지" variant="label" showBackButton={true} />

      <section className="border-y border-gray-3 p-4">
        <h2 className="hidden">내정보</h2>
        <p className="font-semibold text-xl">{userInfo.name}</p>
        <span className="text-gray-6 text-sm">
          {getAnimalTypeLabel(userInfo.animalType)}
          {userInfo.breed &&
            ` / ${getBreedLabel(userInfo.breed, displayBreeds)}`}
        </span>
      </section>

      <main className="py-4 flex flex-col scrollbar-hide gap-4 flex-1 overflow-auto">
        <div className="flex flex-col gap-6 lg:flex-row lg:px-6 w-full">
          <section className="flex flex-col gap-3 flex-1 min-w-0">
            <h3 className="font-bold mx-6 lg:mx-0">예약내역</h3>
            {reservations.length === 0 ? (
              <div className="w-full h-31 flex items-center justify-center">
                <p className="text-gray-5">예약 내역이 없습니다.</p>
              </div>
            ) : (
              <div className="flex px-6 lg:px-0 overflow-x-auto scrollbar-hide">
                {reservations.map((reservation) => {
                  const hospital = hospitalsInfo[reservation.hospitalId];
                  if (!hospital) return null;

                  return (
                    <div key={reservation.id} className="flex px-2 gap-1">
                      <Card
                        size="sm"
                        image={hospital.imageUrl}
                        alt={hospital.name}
                        name={hospital.name}
                        address={hospital.address}
                        onClick={() => navigate(`/hospital/${hospital.id}`)}
                        className="cursor-pointer"
                      />
                      <div className="flex items-center flex-col gap-1">
                        <div className="text-sm w-37 text-center font-normal">
                          <p>날짜: {reservation.reservationDate}</p>
                          <p>
                            시간: {reservation.reservationTime.substring(0, 5)}
                          </p>
                          <p>
                            품종:{" "}
                            {animalTypeMap[reservation.animalType] ||
                              reservation.animalType}{" "}
                            ({breedMap[reservation.breed] || reservation.breed})
                          </p>
                        </div>
                        <Button
                          label="예약취소"
                          className="font-medium text-sm w-25"
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setShowCancelPopup(true);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-3 lg:mx-0 flex-1">
            <h3 className="font-bold mx-6">나의 리뷰</h3>
            {myReviews.length === 0 ? (
              <div className="w-full h-31 flex items-center justify-center">
                <p className="text-gray-5 mx-6">등록된 리뷰가 없습니다.</p>
              </div>
            ) : (
              <div className="flex px-6 overflow-auto scrollbar-hide gap-2">
                {myReviews.map((review: ReviewResponse) => (
                  <Card
                    key={review.reviewId}
                    size="sm"
                    image={review.hospitalImageUrl}
                    alt={review.hospitalName}
                    name={review.hospitalName}
                    address=""
                    content={review.content}
                    onClick={() => navigate(`/hospital/${review.hospitalId}`)}
                    className="cursor-pointer"
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="flex flex-col max-w-120 gap-3 mx-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">내 정보 수정</h3>
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
                  icon={CheckLine}
                  variant="icon"
                  iconSize="w-5 h-5"
                  onClick={handleSaveForm}
                />
              )}
            </div>
          </div>

          <Input
            value={form.name}
            disabled={!editMode}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="이름"
          />

          <Field placeholder={form.username} />

          <div className="flex gap-2">
            <Input
              placeholder="휴대폰 번호"
              value={form.phone}
              disabled={!editMode}
              onChange={(e) => updateField("phone", e.target.value)}
            />

            <Button
              className="w-27 disabled:cursor-auto"
              variant="primary"
              label="중복확인"
              disabled={!editMode || !form.phone}
              onClick={() => checkPhoneDuplicate(userInfo.phone)}
            />
          </div>

          {errors.phone && (
            <span className="text-red ml-2 text-xs">{errors.phone}</span>
          )}

          {verifiedPhone && !errors.phone && editMode && form.phone && (
            <span className="text-blue-2 ml-2 text-xs">
              사용 가능한 번호입니다.
            </span>
          )}

          <div className="flex w-full gap-2">
            <SelectBox
              placeholder="종류"
              options={animalTypes}
              value={form.animalType}
              disabled={!editMode}
              onChange={(value) => {
                updateField("animalType", value);
                updateField("breed", "");
              }}
            />

            <SelectBox
              placeholder="품종"
              options={breeds}
              value={form.breed || ""}
              disabled={!editMode || !form.animalType || breeds.length === 0}
              onChange={(value) => updateField("breed", value)}
            />
          </div>
        </section>
      </main>

      <div className="flex w-full py-2 px-6 gap-1 lg:absolute lg:top-2.5 lg:right-6 lg:w-auto lg:p-0">
        <Button
          className="w-full max-w-60 lg:w-22 bg-main-2"
          label="회원탈퇴"
          onClick={() => {
            setShowPopup(true);
            setPasswordError(false);
          }}
        />
        <Button
          className="w-full max-w-60 lg:w-22"
          label="로그아웃"
          onClick={handleLogout}
        />
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

            const result = await withdraw(password);
            if (result.invalidPassword) {
              setPasswordError(true);
              return;
            }

            if (result.success) {
              setShowPopup(false);
              setShowWithdrawComplete(true);
            } else if (result.message) {
              setShowPopup(false);
              setAlertPopup({ open: true, message: result.message });
            }
          }}
          onCancel={() => setShowPopup(false)}
          onClose={() => setShowPopup(false)}
          error={passwordError}
          errorMessage="비밀번호가 일치하지 않습니다."
        />
      )}

      {showWithdrawComplete && (
        <Popup
          type="alert"
          open={showWithdrawComplete}
          title="회원탈퇴가 완료되었습니다."
          onClose={() => {
            setShowWithdrawComplete(false);
            navigate("/");
          }}
        >
          감사합니다.
        </Popup>
      )}

      <Popup
        type="confirm"
        open={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        title="예약을 취소하시겠습니까?"
        confirmLabel="예"
        cancelLabel="아니오"
        onConfirm={handleCancelReservation}
        onCancel={() => setShowCancelPopup(false)}
      />

      <Popup
        type="alert"
        open={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        title="예약취소가 완료되었습니다."
      >
        감사합니다.
      </Popup>

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

      <Footer variant="hospital" className="mb-6" />
    </div>
  );
}

export default Mypage;
