import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import Header from "@/components/header";
import Popup from "@/components/popup";
import LoadingPage from "../components/loading";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Field from "@/components/ui/field";
import Input from "@/components/ui/input";
import { SelectBox } from "@/components/ui/selectbox";
import type { SelectOption } from "@/components/ui/selectbox";

import { PencilLine, CheckLine } from "lucide-react";
import Footer from "@/components/footer";

interface Reservation {
  id: number;
  userId: number;
  hospitalId: number;
  hospitalName: string;
  reserverName: string;
  animalType: string;
  breed: string;
  age: number;
  weight: number;
  department: string;
  reservationDate: string;
  reservationTime: string;
  status: string;
  createdAt: string;
}

interface HospitalInfo {
  id: number;
  name: string;
  address: string;
  imageUrl: string;
  operatingStatus: string;
}

interface ReviewResponse {
  reviewId: number;
  hospitalId: number;
  hospitalName: string;
  hospitalImageUrl: string;
  username?: string;
  department: string;
  content: string;
  visitDate?: string;
  createdDate: string;
  revisitIntention?: boolean;
  isMyReview: boolean;
}

function Mypage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    animalType: "",
    breed: "",
    phone: "",
  });

  const [displayUser, setDisplayUser] = useState({
    name: "",
    username: "",
    animalType: "",
    breed: "",
    phone: "",
  });

  const [animalTypes, setAnimalTypes] = useState<SelectOption[]>([]);
  const [breeds, setBreeds] = useState<SelectOption[]>([]);
  const [displayBreeds, setDisplayBreeds] = useState<SelectOption[]>([]);
  const [editMode, setEditMode] = useState(false);

  const [errors, setErrors] = useState<{ phone?: string }>({});
  const [verifiedPhone, setVerifiedPhone] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [myReviews, setMyReviews] = useState<ReviewResponse[]>([]);

  const [hospitalsInfo, setHospitalsInfo] = useState<{
    [key: number]: HospitalInfo;
  }>({});
  const [animalTypeMap, setAnimalTypeMap] = useState<{ [key: string]: string }>(
    {}
  );
  const [breedMap, setBreedMap] = useState<{ [key: string]: string }>({});
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const getAnimalTypeLabel = (value: string) => {
    const found = animalTypes.find((option) => option.value === value);
    return found ? found.label : value;
  };

  const getBreedLabel = (value: string) => {
    if (!value) return "";
    const found = displayBreeds.find((option) => option.value === value);
    return found ? found.label : "";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const res = await fetch("/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            navigate("/login", { replace: true });
            return;
          }
          throw new Error("유저 정보 불러오기 실패");
        }

        const data = await res.json();

        setForm({
          name: data.name,
          username: data.username,
          animalType: data.species,
          breed: data.breed,
          phone: data.phoneNumber,
        });

        setDisplayUser({
          name: data.name,
          username: data.username,
          animalType: data.species,
          breed: data.breed,
          phone: data.phoneNumber,
        });

        setIsLoading(false);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      }
    };

    const fetchHospitalInfo = async (
      hospitalIds: number[],
      currentHospitalsMap: { [key: number]: HospitalInfo }
    ) => {
      const token = localStorage.getItem("token");
      if (!token) return {};

      const hospitalPromises = hospitalIds.map((id: number) =>
        fetch(`/api/v1/hospital/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => res.json())
      );

      const hospitalsData = await Promise.all(hospitalPromises);
      const newHospitalsMap: { [key: number]: HospitalInfo } = {};
      hospitalsData.forEach((hospital, index) => {
        const id = hospitalIds[index];
        if (hospital) {
          newHospitalsMap[id] = {
            id: id,
            name: hospital.name,
            address: hospital.address,
            imageUrl: hospital.imageUrl,
            operatingStatus: hospital.operatingStatus,
          };
        }
      });
      return { ...currentHospitalsMap, ...newHospitalsMap };
    };

    const fetchReservations = async () => {
      try {
        const res = await fetch("/api/v1/reservations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("예약 목록 불러오기 실패");

        const data = await res.json();
        const activeReservations = data.filter(
          (r: Reservation) => r.status === "PENDING" || r.status === "CONFIRMED"
        );
        setReservations(activeReservations);

        const hospitalIds = Array.from(
          new Set(activeReservations.map((r: Reservation) => r.hospitalId))
        ) as number[];

        let updatedHospitalsMap = await fetchHospitalInfo(hospitalIds, {});
        setHospitalsInfo(updatedHospitalsMap);

        const allAnimalTypes = new Set(
          activeReservations.map((r: Reservation) => r.animalType)
        );
        const breedPromises = Array.from(allAnimalTypes).map((type: any) =>
          fetch(`/api/v1/breeds/${type}`).then((res) => res.json())
        );

        const breedsData = await Promise.all(breedPromises);
        const breedMapping: { [key: string]: string } = {};
        breedsData.forEach((data) => {
          if (data.breeds) {
            data.breeds.forEach((breed: any) => {
              breedMapping[breed.code] = breed.description;
            });
          }
        });
        setBreedMap(breedMapping);
      } catch (err) {
        console.error(err);
        setReservations([]);
      }
    };

    const fetchMyReviews = async () => {
      try {
        const res = await fetch("/api/v1/reviews/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("리뷰 목록 불러오기 실패");

        const data: ReviewResponse[] = await res.json();
        setMyReviews(data);
      } catch (err) {
        console.error(err);
        setMyReviews([]);
      }
    };

    fetchUserInfo();
    fetchReservations();
    fetchMyReviews();
  }, [navigate]);

  useEffect(() => {
    const fetchAnimalTypes = async () => {
      try {
        const res = await fetch("/api/v1/animal-types");
        if (!res.ok) throw new Error("동물 종류 불러오기 실패");
        const data = await res.json();

        const arrayData = Array.isArray(data) ? data : data.types || [];
        const options: SelectOption[] = arrayData.map((item: any) => ({
          label: item.description || item.name,
          value: item.code || item.id,
        }));

        setAnimalTypes(options);

        const typeMapping: { [key: string]: string } = {};
        arrayData.forEach((item: any) => {
          typeMapping[item.code || item.id] = item.description || item.name;
        });
        setAnimalTypeMap(typeMapping);
      } catch (err) {
        console.error(err);
        setAnimalTypes([]);
      }
    };

    fetchAnimalTypes();
  }, []);

  useEffect(() => {
    if (!form.animalType) {
      setBreeds([]);
      return;
    }

    const fetchBreeds = async () => {
      try {
        const res = await fetch(`/api/v1/breeds/${form.animalType}`);
        if (!res.ok) throw new Error("품종 불러오기 실패");
        const data = await res.json();
        const options: SelectOption[] = Array.isArray(data.breeds)
          ? data.breeds.map((item: any) => ({
              label: item.description,
              value: item.code,
            }))
          : [];
        setBreeds(options);
      } catch (err) {
        console.error(err);
        setBreeds([]);
      }
    };

    fetchBreeds();
  }, [form.animalType]);

  useEffect(() => {
    if (!displayUser.animalType) {
      setDisplayBreeds([]);
      return;
    }

    const fetchDisplayBreeds = async () => {
      try {
        const res = await fetch(`/api/v1/breeds/${displayUser.animalType}`);
        if (!res.ok) throw new Error("품종 불러오기 실패");
        const data = await res.json();
        const options: SelectOption[] = Array.isArray(data.breeds)
          ? data.breeds.map((item: any) => ({
              label: item.description,
              value: item.code,
            }))
          : [];
        setDisplayBreeds(options);
      } catch (err) {
        console.error(err);
        setDisplayBreeds([]);
      }
    };

    fetchDisplayBreeds();
  }, [displayUser.animalType]);

  const handleEdit = () => {
    setEditMode(true);
    setVerifiedPhone(false);
    setErrors({});
  };

  const checkPhoneDuplicate = async () => {
    if (!form.phone) return;

    if (form.phone === displayUser.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
      setVerifiedPhone(true);
      return;
    }

    try {
      const res = await fetch(`/api/v1/auth/check-phone?phone=${form.phone}`);
      const data = await res.json();

      if (res.status === 400 || res.status === 409) {
        setErrors((prev) => ({ ...prev, phone: data.message }));
        setVerifiedPhone(false);
      } else if (res.ok) {
        setErrors((prev) => ({ ...prev, phone: "" }));
        setVerifiedPhone(true);
      }
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        phone: "중복 확인 중 오류가 발생했습니다.",
      }));
      setVerifiedPhone(false);
    }
  };

  const handleSave = async () => {
    if (!verifiedPhone) {
      setErrors((prev) => ({
        ...prev,
        phone: "휴대폰 번호 중복확인을 해주세요.",
      }));
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      const res = await fetch("/api/v1/auth/me", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          phoneNumber: form.phone,
          species: form.animalType,
          breed: form.breed,
        }),
      });

      if (!res.ok) {
        let errorMessage = "정보 수정 실패";
        try {
          const data = await res.json();
          errorMessage = data.message || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      setDisplayUser({ ...form });
      setEditMode(false);
      setErrors({});
      setVerifiedPhone(false);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "정보 수정 중 오류가 발생했습니다.");
    }
  };

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(
        `/api/v1/reservations/${selectedReservation.id}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("예약 취소에 실패했습니다.");
      }

      setReservations((prev) =>
        prev.filter((r) => r.id !== selectedReservation.id)
      );
      setShowCancelPopup(false);
      setShowSuccessPopup(true);
      setSelectedReservation(null);
    } catch (err) {
      console.error("예약 취소 에러:", err);
      alert("예약 취소 중 오류가 발생했습니다.");
    }
  };

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
      const res = await fetch("/api/v1/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "로그아웃 실패");
      }

      localStorage.clear();

      setAlertPopup({ open: true, message: "로그아웃 되었습니다." });
    } catch (err: any) {
      setAlertPopup({ open: true, message: err.message || "로그아웃 실패" });
    }
  };

  if (isLoading || !displayUser.name)
    return <LoadingPage message="로딩중..." />;

  return (
    <div className="h-dvh bg-white flex flex-col relative">
      <Header label="마이페이지" variant="label" showBackButton={true} />

      <section className="border-y border-gray-3 p-4">
        <h2 className="hidden">내정보</h2>
        <p className="font-semibold text-xl">{displayUser.name}</p>
        <span className="text-gray-6 text-sm">
          {getAnimalTypeLabel(displayUser.animalType)}
          {displayUser.breed && ` / ${getBreedLabel(displayUser.breed)}`}
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
                {myReviews.map((review) => (
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
                  onClick={handleSave}
                />
              )}
            </div>
          </div>

          <Input
            value={form.name}
            disabled={!editMode}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="이름"
          />

          <Field placeholder={form.username} />

          <div className="flex gap-2">
            <Input
              placeholder="휴대폰 번호"
              value={form.phone}
              disabled={!editMode}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <Button
              className="w-27 disabled:cursor-auto"
              variant="primary"
              label="중복확인"
              disabled={!editMode || !form.phone}
              onClick={checkPhoneDuplicate}
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
              onChange={(value) =>
                setForm({ ...form, animalType: value, breed: "" })
              }
            />

            <SelectBox
              placeholder="품종"
              options={breeds}
              value={form.breed || ""}
              disabled={!editMode || !form.animalType || breeds.length === 0}
              onChange={(value) => setForm({ ...form, breed: value })}
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

            try {
              const token = localStorage.getItem("token");

              const res = await fetch("/api/v1/auth/withdraw", {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
              });

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
