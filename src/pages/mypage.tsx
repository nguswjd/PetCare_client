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

function Mypage() {
  const navigate = useNavigate();

  interface ReservationInfo {
    date: string;
    animalType: string;
    breeds: string;
  }

  const hospitalinfo = {
    id: 5,
    image: "",
    alt: "가까운 병원",
    name: "C hospital",
    address: "제주시 이도동",
    businessStatus: "영업종료",
    distance: "30km",
  };

  const reservationInfo: ReservationInfo = {
    date: "2025.10.28",
    animalType: "육지동물",
    breeds: "대형견",
  };

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
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("유저 정보 불러오기 실패");

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
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchUserInfo();
  }, [navigate]);

  useEffect(() => {
    const fetchAnimalTypes = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/api/v1/auth/animal-types`);
        if (!res.ok) throw new Error("동물 종류 불러오기 실패");
        const data = await res.json();

        const arrayData = Array.isArray(data) ? data : data.types || [];
        const options: SelectOption[] = arrayData.map((item: any) => ({
          label: item.description || item.name,
          value: item.code || item.id,
        }));

        setAnimalTypes(options);
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
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(
          `${API_URL}/api/v1/auth/breeds/${form.animalType}`
        );
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
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(
          `${API_URL}/api/v1/auth/breeds/${displayUser.animalType}`
        );
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
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(
        `${API_URL}/api/v1/auth/check-phone?phone=${form.phone}`
      );
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

      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/api/v1/auth/me`, {
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

  const [showPopup, setShowPopup] = useState(false);
  const [alertPopup, setAlertPopup] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });

  const handleDelete = () => {
    console.log("탈퇴 진행");
    setShowPopup(false);
    navigate("/");
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/api/v1/auth/logout`, {
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

  if (!displayUser.name) return <LoadingPage message="로딩중..." />;

  return (
    <div className="h-dvh bg-white flex flex-col">
      <Header label="마이페이지" />

      <section className="border-y border-gray-3 p-4">
        <h2 className="hidden">내정보</h2>
        <p className="font-semibold text-xl">{displayUser.name}</p>
        <span className="text-gray-6 text-sm">
          {getAnimalTypeLabel(displayUser.animalType)}
          {displayUser.breed && ` / ${getBreedLabel(displayUser.breed)}`}
        </span>
      </section>

      <main className="px-6 py-4 flex flex-col scrollbar-hide gap-4 flex-1 overflow-auto">
        <section className="flex flex-col gap-3">
          <h3 className="font-bold">예약내역</h3>
          <div className="flex px-2 gap-2">
            <Card
              size="sm"
              image={hospitalinfo.image}
              alt={hospitalinfo.alt}
              name={hospitalinfo.name}
              address={hospitalinfo.address}
              onClick={() => navigate(`/hospital/${hospitalinfo.id}`)}
              className="cursor-pointer"
            />
            <div className="flex items-center flex-col gap-2">
              <div className="text-sm text-center font-normal">
                <p>날짜 : {reservationInfo.date}</p>
                <p>
                  품종 : {reservationInfo.animalType}({reservationInfo.breeds})
                </p>
              </div>
              <Button label="예약취소" className="font-medium text-sm w-25" />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="font-bold">나의 리뷰</h3>
          <div className="w-full h-31 flex items-center justify-center">
            <p className="text-gray-5">등록된 리뷰가 없습니다.</p>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">내 정보 수정</h3>
            <div className="flex gap-2">
              {!editMode && (
                <Button
                  icon={PencilLine}
                  variant="icon"
                  className="w-4 h-4 [&>svg]:!w-4 [&>svg]:!h-4"
                  onClick={handleEdit}
                />
              )}
              {editMode && (
                <Button
                  icon={CheckLine}
                  variant="icon"
                  className="w-4 h-4 [&>svg]:!w-4 [&>svg]:!h-4"
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

      <div className="flex w-full py-2 px-6 gap-1">
        <Button
          className="w-full bg-main-2"
          label="회원탈퇴"
          onClick={() => setShowPopup(true)}
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
          onConfirm={handleDelete}
          onCancel={() => setShowPopup(false)}
          onClose={() => setShowPopup(false)}
        />
      )}

      {alertPopup.open && (
        <Popup
          open={alertPopup.open}
          type="alert"
          children={`안녕히가세요.\n 다음에 뵈어요 :)`}
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

export default Mypage;
