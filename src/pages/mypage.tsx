import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import Header from "@/components/header";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Field from "@/components/ui/field";
import { SelectBox } from "@/components/ui/selectbox";
import type { SelectOption } from "@/components/ui/selectbox";

import { PencilLine } from "lucide-react";

function Mypage() {
  const navigate = useNavigate();

  interface UserInfo {
    name: string;
    animalType: string;
    breeds: string;
    phonenumber: string;
  }

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

  const userinfo: UserInfo = {
    name: "남현정",
    animalType: "육지동물",
    breeds: "대형견",
    phonenumber: "01020385269",
  };

  const [form, setForm] = useState({
    name: userinfo.name,
    animalType: userinfo.animalType,
    breed: userinfo.breeds,
    phone: userinfo.phonenumber,
  });

  const reservationInfo: ReservationInfo = {
    date: "2025.10.28",
    animalType: "육지동물",
    breeds: "대형견",
  };

  const [breeds, setBreeds] = useState<SelectOption[]>([]);

  const animaltypes: SelectOption[] = [
    { label: "육지동물", value: "TERRESTRIAL" },
    { label: "수생동물", value: "AQUATIC" },
    { label: "조류", value: "AVIAN" },
    { label: "기타", value: "OTHER" },
  ];

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

        const options: SelectOption[] = data.breeds.map((item: any) => ({
          label: item.description,
          value: item.code,
        }));
        setBreeds(options);
      } catch (err) {
        console.error(err);
        setBreeds([]);
      }
    };

    fetchBreeds();
  }, [form.animalType]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "animalType") {
      setForm((prev) => ({ ...prev, breed: "" }));
    }
  };

  return (
    <div className="h-dvh bg-white flex flex-col">
      <Header label="마이페이지" />
      <section className="border-y border-gray-3 p-4">
        <h2 className="hidden">내정보</h2>
        <p className="font-semibold text-xl">{userinfo.name}</p>
        <span className="text-gray-6 text-sm">
          {userinfo.animalType} / {userinfo.breeds}
        </span>
      </section>

      <main className="px-6 py-4 flex flex-col scrollbar-hide gap-4 flex-1 overflow-auto">
        <section className="flex flex-col gap-3">
          <h3 className="font-bold">예약내역</h3>
          <div className="flex px-4 justify-between">
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
                <p>날짜 : {reservationInfo.date}</p>
              </div>
              <Button label="에약취소" className="font-medium text-sm w-25" />
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
          <div className="flex justify-between">
            <h3 className="font-bold">내 정보 수정</h3>
            <Button icon={PencilLine} variant="icon" className="w-4 h-4" />
          </div>
          <Field placeholder={userinfo.name} />
          <Field placeholder={userinfo.phonenumber} />

          <div className="flex w-full gap-2">
            <SelectBox
              placeholder="종류"
              options={animaltypes}
              onChange={(value) => handleChange("animalType", value)}
              value={form.animalType}
            />
            <SelectBox
              placeholder="품종"
              options={breeds}
              onChange={(value) => handleChange("breed", value)}
              value={form.breed || ""}
              disabled={!form.animalType || breeds.length === 0}
            />
          </div>
        </section>
      </main>

      <div className="flex w-full py-2 px-6 gap-1">
        <Button className="w-full bg-main-2" label="회원탈퇴" />
        <Button className="w-full" label="로그아웃" />
      </div>

      <footer className="flex mb-4 justify-between px-6 py-2 border-y border-gray-3">
        <div className="flex flex-col">
          <p className="font-semibold text-base">PET CARE 문의하기</p>
          <span className="text-gray-6 text-xs">nguswjd02@ajou.ac.kr</span>
        </div>
        <img src="/PetCare_logo.svg" className="w-10 h-10" alt="petcare 로고" />
      </footer>
    </div>
  );
}

export default Mypage;
