import { useLocation } from "react-router";
import { useState, useEffect } from "react";

import Header from "@/components/header";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { SelectBox } from "@/components/ui/selectbox";

import { ChevronDown, ChevronUp } from "lucide-react";

interface HospitalInfo {
  id: number;
  name: string;
  address: string;
  businessStatus: string;
  image: string;
  alt: string;
  distance?: string;
  hasParking: boolean;
  animalTypes: string[];
  departments: string[];
  breeds: string[];
}

function Reservation() {
  const { state } = useLocation();
  const { hospitalInfo } = state as { hospitalInfo: HospitalInfo };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedAnimalType, setSelectedAnimalType] = useState("");
  const [selectedAnimalLabel, setSelectedAnimalLabel] = useState("");
  const [filteredBreeds, setFilteredBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState("");

  const animalTypeMap: Record<string, string> = {
    육지동물: "TERRESTRIAL",
    조류: "AVIAN",
    수생동물: "AQUATIC",
    기타: "OTHER",
  };

  useEffect(() => {
    if (!selectedAnimalType) {
      setFilteredBreeds([]);
      setSelectedBreed("");
      return;
    }

    const fetchBreeds = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(
          `${API_URL}/api/v1/auth/breeds/${selectedAnimalType}`
        );
        if (!res.ok) throw new Error("품종 불러오기 실패");

        const data = await res.json();

        const filtered = data.breeds
          .map((item: any) => item.description)
          .filter((breed: string) => hospitalInfo.breeds.includes(breed));

        setFilteredBreeds(filtered);
        setSelectedBreed("");
      } catch (err) {
        console.error(err);
        setFilteredBreeds([]);
        setSelectedBreed("");
      }
    };

    fetchBreeds();
  }, [selectedAnimalType, hospitalInfo.breeds]);

  return (
    <>
      <Header label={hospitalInfo.name} />

      <div>
        <img
          src={hospitalInfo.image}
          alt={hospitalInfo.alt || "병원 이미지"}
          className="w-full min-h-40 h-[15vh] max-h-60 bg-gray-4 object-cover"
        />

        <section className="flex flex-col justify-between">
          <h2 className="hidden">병원정보</h2>

          <div className="mt-4 px-4 pb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-xl">{hospitalInfo.name}</h3>
              <p className="flex gap-2 text-gray-6 font-medium text-xs">
                {hospitalInfo.address.split(" ").slice(1, 3).join(" ")}
              </p>
            </div>

            <div className="flex gap-2 text-gray-6 font-medium text-sm">
              <p>{hospitalInfo.businessStatus}</p>
              {hospitalInfo.distance && <p>{hospitalInfo.distance}</p>}
            </div>

            <div className="text-sm text-gray-6 py-2 flex justify-between font-medium">
              <div className="flex flex-col">
                <p>주차장 {hospitalInfo.hasParking ? "있음" : "없음"}</p>
                <p>{hospitalInfo.breeds.join(", ")}</p>
              </div>
              <p className="ml-auto text-right">총 리뷰 10,000</p>
            </div>
          </div>

          <div className="border-y px-4 border-y-gray-2 py-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm text-black font-semibold">병원 정보</h3>
              <Button
                variant="icon"
                icon={isOpen ? ChevronUp : ChevronDown}
                onClick={() => setIsOpen((prev) => !prev)}
              />
            </div>

            {isOpen && (
              <div className="mt-4 text-xs flex flex-col gap-3 text-black">
                <p>진료과목 : {hospitalInfo.departments.join(", ")}</p>
                <p>진료동물 : {hospitalInfo.breeds.join(", ")}</p>
                <p>
                  오시는 길: <br />
                  {hospitalInfo.address}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="px-6 flex flex-col gap-3 mt-4">
          <h2 className="hidden">병원 예약 폼</h2>

          <Input placeholder="에약자 명" />
          <div className="flex gap-2">
            <SelectBox
              placeholder="종류"
              options={hospitalInfo.animalTypes.map((item) => ({
                label: item,
                value: item,
              }))}
              value={selectedAnimalLabel || ""}
              onChange={(value) => {
                setSelectedAnimalLabel(value);
                setSelectedAnimalType(animalTypeMap[value]);
                setFilteredBreeds([]);
              }}
            />

            <SelectBox
              placeholder="품종"
              options={filteredBreeds.map((item) => ({
                label: item,
                value: item,
              }))}
              value={selectedBreed || ""}
              onChange={(value) => setSelectedBreed(value)}
              disabled={!selectedAnimalType || filteredBreeds.length === 0}
            />
          </div>

          <SelectBox
            placeholder="진료 항목을 선택해주세요."
            options={hospitalInfo.departments.map((item) => ({
              label: item,
              value: item,
            }))}
          />
        </section>
      </div>
    </>
  );
}

export default Reservation;
