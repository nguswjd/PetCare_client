import { useLocation } from "react-router";
import { useState, useEffect } from "react";

import Header from "@/components/header";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { SelectBox } from "@/components/ui/selectbox";
import Calendar from "@/components/ui/calendar";

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
  holidays?: string[]; // ⭐ holidays 추가
}

function Reservation() {
  const { state } = useLocation();
  const { hospitalInfo } = state as { hospitalInfo: HospitalInfo };

  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [selectedAnimalType, setSelectedAnimalType] = useState("");
  const [selectedAnimalLabel, setSelectedAnimalLabel] = useState("");
  const [filteredBreeds, setFilteredBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");

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
          `${API_URL}/api/v1/breeds/${selectedAnimalType}`
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

  const times = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ];

  const ageOptions = Array.from({ length: 21 }, (_, i) => ({
    label: `${i}살`,
    value: `${i}`,
  }));

  const weightOptions = Array.from({ length: 50 }, (_, i) => ({
    label: `${i + 1}kg`,
    value: `${i + 1}`,
  }));

  const isFormComplete =
    name &&
    selectedAnimalType &&
    selectedBreed &&
    selectedDepartment &&
    selectedDate &&
    selectedTime &&
    selectedAge &&
    selectedWeight;

  return (
    <div className="h-dvh">
      <div className="sticky top-0 z-10 bg-white">
        <Header label={hospitalInfo.name} />
      </div>

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
                <p className="overflow-hidden w-50 text-ellipsis whitespace-nowrap">
                  {hospitalInfo.breeds.join(", ")}
                </p>
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

        <section className="px-6 flex flex-col gap-3 mt-4 pb-24">
          <h2 className="hidden">병원 예약 폼</h2>

          <Input
            placeholder="예약자 명"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <div className="flex gap-2">
            <SelectBox
              placeholder="나이"
              options={ageOptions}
              value={selectedAge}
              onChange={(value) => setSelectedAge(value)}
            />

            <SelectBox
              placeholder="체중"
              options={weightOptions}
              value={selectedWeight}
              onChange={(value) => setSelectedWeight(value)}
            />
          </div>

          <SelectBox
            placeholder="진료 항목을 선택해주세요."
            options={hospitalInfo.departments.map((item) => ({
              label: item,
              value: item,
            }))}
            value={selectedDepartment}
            onChange={(value) => setSelectedDepartment(value)}
          />

          <div className="flex flex-col items-center gap-3 mt-4  md:flex-row md:items-center md:justify-center md:gap-6">
            <div className="w-full max-w-sm">
              <Calendar
                selectedDates={selectedDate ? [selectedDate] : []}
                onSelectDate={(date: Date) => setSelectedDate(date)}
                holidays={hospitalInfo.holidays || []} // ⭐ holidays 전달
              />
            </div>

            <div className="grid grid-cols-4 grid-rows-3 gap-2 w-full max-w-100">
              {times.map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  label={time}
                  toggleable
                  active={selectedTime === time}
                  onClick={() => setSelectedTime(time)}
                  className="w-full"
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer className="fixed bottom-0 left-0 w-full px-6 pt-3 pb-6 bg-white">
        <Button
          label="예약하기"
          className="w-full"
          disabled={!isFormComplete}
          onClick={() => {
            if (!isFormComplete) return;
          }}
        />
      </footer>
    </div>
  );
}

export default Reservation;
