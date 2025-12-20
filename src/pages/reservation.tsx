import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";

import Header from "@/components/header";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { SelectBox } from "@/components/ui/selectbox";
import Calendar from "@/components/ui/calendar";
import Popup from "@/components/popup";
import HospitalInfoSection from "@/components/hospital-section";

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
  holidays?: string[];
}

interface AnimalType {
  code: string;
  description: string;
}

interface Breed {
  code: string;
  description: string;
}

interface Department {
  code: string;
  description: string;
}

const BASE_TIMES = [
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
  "20:00",
];

function Reservation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { hospitalInfo } = state as { hospitalInfo: HospitalInfo };

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const [name, setName] = useState("");
  const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);
  const [selectedAnimalType, setSelectedAnimalType] = useState("");
  const [selectedAnimalTypeCode, setSelectedAnimalTypeCode] = useState("");
  const [filteredBreeds, setFilteredBreeds] = useState<Breed[]>([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [selectedBreedCode, setSelectedBreedCode] = useState("");
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>(
    []
  );
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDepartmentCode, setSelectedDepartmentCode] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableServerTimes, setAvailableServerTimes] = useState<string[]>(
    []
  );
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [breakTimes, setBreakTimes] = useState<string[]>([]);
  const [operatingStartTime, setOperatingStartTime] = useState<string>("");
  const [operatingEndTime, setOperatingEndTime] = useState<string>("");

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("token");

    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          setShowLoginPopup(true);
          return;
        }

        const data = await res.json();

        setName(data.name ?? "");
        if (data.species) setSelectedAnimalTypeCode(data.species);
        if (data.breed) setSelectedBreedCode(data.breed);
      } catch {
        localStorage.removeItem("token");
        setShowLoginPopup(true);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchHospitalDetail = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(
          `${API_URL}/api/v1/hospital/${hospitalInfo.id}`
        );
        if (!res.ok) throw new Error("");
        const data = await res.json();
        setReviewCount(data.reviewCount || 0);
        setBreakTimes(data.breakTimes || []);
        setOperatingStartTime(data.operatingStartTime || "");
        setOperatingEndTime(data.operatingEndTime || "");
      } catch {
        setReviewCount(0);
        setBreakTimes([]);
        setOperatingStartTime("");
        setOperatingEndTime("");
      }
    };

    fetchHospitalDetail();
  }, [hospitalInfo.id]);

  useEffect(() => {
    const fetchAnimalTypes = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/api/v1/animal-types`);
        if (!res.ok) throw new Error("");
        const data = await res.json();

        const allTypes: AnimalType[] = Array.isArray(data.types)
          ? data.types
          : [];
        const filtered = allTypes.filter((type) =>
          hospitalInfo.animalTypes.includes(type.description)
        );

        setAnimalTypes(filtered);
      } catch {
        setAnimalTypes([]);
      }
    };

    if (hospitalInfo.animalTypes && hospitalInfo.animalTypes.length > 0) {
      fetchAnimalTypes();
    }
  }, [hospitalInfo.animalTypes]);

  useEffect(() => {
    if (hospitalInfo.departments) {
      const depts = hospitalInfo.departments.map((dept) => ({
        code: dept,
        description: dept,
      }));
      setFilteredDepartments(depts);
    }
  }, [hospitalInfo.departments]);

  useEffect(() => {
    if (!selectedAnimalTypeCode) {
      setFilteredBreeds([]);
      setSelectedBreed("");
      if (!selectedBreedCode) setSelectedBreedCode("");
      return;
    }

    const fetchBreeds = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(
          `${API_URL}/api/v1/breeds/${selectedAnimalTypeCode}`
        );
        if (!res.ok) throw new Error("");
        const data = await res.json();
        const arrayData: Breed[] = Array.isArray(data.breeds)
          ? data.breeds
          : data.breeds || [];

        setFilteredBreeds(arrayData);

        if (selectedBreedCode) {
          const found = arrayData.find((b) => b.code === selectedBreedCode);
          if (found) {
            setSelectedBreed(found.description);
          } else {
            setSelectedBreed("");
            setSelectedBreedCode("");
          }
        } else {
          setSelectedBreed("");
        }
      } catch {
        setFilteredBreeds([]);
        setSelectedBreed("");
        setSelectedBreedCode("");
      }
    };

    fetchBreeds();
  }, [selectedAnimalTypeCode, hospitalInfo.breeds, selectedBreedCode]);

  useEffect(() => {
    if (!animalTypes.length || !selectedAnimalTypeCode) return;
    const found = animalTypes.find((a) => a.code === selectedAnimalTypeCode);
    if (found) setSelectedAnimalType(found.description);
  }, [animalTypes, selectedAnimalTypeCode]);

  useEffect(() => {
    if (!filteredBreeds.length || !selectedBreedCode) return;
    const found = filteredBreeds.find((b) => b.code === selectedBreedCode);
    if (found) setSelectedBreed(found.description);
  }, [filteredBreeds, selectedBreedCode]);

  useEffect(() => {
    setSelectedTime(null);
    setAvailableServerTimes([]);

    if (!selectedDate || !selectedDepartmentCode || !hospitalInfo.id) {
      return;
    }

    const fetchAvailableTimes = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;

        const formattedDate = `${selectedDate.getFullYear()}-${String(
          selectedDate.getMonth() + 1
        ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

        const queryParams = new URLSearchParams({
          date: formattedDate,
          department: selectedDepartmentCode,
        }).toString();

        const res = await fetch(
          `${API_URL}/api/v1/reservations/${hospitalInfo.id}/available-times?${queryParams}`
        );

        if (!res.ok) throw new Error("");

        const data = await res.json();
        setAvailableServerTimes(data.availableTimes || []);
      } catch {
        setAvailableServerTimes([]);
      }
    };

    fetchAvailableTimes();
  }, [selectedDate, selectedDepartmentCode, hospitalInfo.id]);

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
    selectedAnimalTypeCode &&
    selectedBreedCode &&
    selectedDepartmentCode &&
    selectedDate &&
    selectedTime &&
    selectedAge &&
    selectedWeight;

  const handleReservation = async () => {
    if (!isFormComplete) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const formattedDate = selectedDate
        ? `${selectedDate.getFullYear()}-${String(
            selectedDate.getMonth() + 1
          ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(
            2,
            "0"
          )}`
        : "";

      const reservationData = {
        hospitalId: hospitalInfo.id,
        reserverName: name,
        animalType: selectedAnimalTypeCode,
        breed: selectedBreedCode,
        age: parseInt(selectedAge),
        weight: parseInt(selectedWeight),
        department: selectedDepartmentCode,
        reservationDate: formattedDate,
        reservationTime: `${selectedTime}:00`,
      };

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("token");

      if (!token) {
        setShowLoginPopup(true);
        return;
      }

      const res = await fetch(`${API_URL}/api/v1/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservationData),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        let errorData = contentType?.includes("application/json")
          ? await res.json()
          : await res.text();

        let errorMessage = "예약 중 오류가 발생했습니다.";
        if (res.status === 401) errorMessage = "로그인이 필요합니다.";
        else if (res.status === 403) errorMessage = "권한이 없습니다.";
        else if (res.status === 409) errorMessage = "이미 예약된 시간입니다.";
        else if (typeof errorData === "object" && errorData.message)
          errorMessage = errorData.message;

        throw new Error(errorMessage);
      }

      await res.json();
      setShowSuccessPopup(true);
    } catch (err: any) {
      alert(err.message || "예약 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col relative min-h-screen bg-white">
      <div className="top-0 z-20 bg-white relative">
        <Header
          label={hospitalInfo.name}
          variant="label"
          showBackButton={true}
        />
        <div className="hidden md:block absolute top-1/2 right-6 -translate-y-1/2">
          <Button
            label="예약하기"
            className="w-21 p-0 h-9 text-sm"
            disabled={!isFormComplete}
            onClick={handleReservation}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:max-w-7xl md:w-full md:pr-6 md:gap-8 flex-1">
        <section className="md:w-1/3 md:min-w-120">
          <div className="md:sticky md:top-20">
            <HospitalInfoSection
              image={hospitalInfo.image}
              alt={hospitalInfo.alt}
              name={hospitalInfo.name}
              address={hospitalInfo.address}
              businessStatus={hospitalInfo.businessStatus}
              distance={hospitalInfo.distance}
              hasParking={hospitalInfo.hasParking}
              breeds={hospitalInfo.breeds}
              reviewCount={reviewCount}
              departments={hospitalInfo.departments}
            />
          </div>
        </section>

        <main className="flex-1 px-6 md:px-0 flex flex-col gap-6 mt-4 pb-24 md:pb-10 overflow-y-auto">
          <h2 className="hidden">병원 예약 폼</h2>

          <Input
            placeholder="예약자 명"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex gap-2">
            <SelectBox
              placeholder="종류"
              options={animalTypes.map((item) => ({
                label: item.description,
                value: item.code,
              }))}
              value={selectedAnimalTypeCode || ""}
              onChange={(value) => {
                const selected = animalTypes.find(
                  (item) => item.code === value
                );
                if (selected) {
                  setSelectedAnimalType(selected.description);
                  setSelectedAnimalTypeCode(selected.code);
                  setSelectedBreed("");
                  setSelectedBreedCode("");
                }
              }}
            />

            <SelectBox
              placeholder="품종"
              options={filteredBreeds.map((item) => ({
                label: item.description,
                value: item.code,
              }))}
              value={selectedBreedCode || ""}
              onChange={(value) => {
                const selected = filteredBreeds.find(
                  (item) => item.code === value
                );
                if (selected) {
                  setSelectedBreed(selected.description);
                  setSelectedBreedCode(selected.code);
                }
              }}
              disabled={!selectedAnimalTypeCode || filteredBreeds.length === 0}
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
            options={filteredDepartments.map((item) => ({
              label: item.description,
              value: item.description,
            }))}
            value={selectedDepartment}
            onChange={(value) => {
              const selected = filteredDepartments.find(
                (item) => item.description === value
              );
              if (selected) {
                setSelectedDepartment(selected.description);
                setSelectedDepartmentCode(selected.code);
              }
            }}
          />

          <div className="flex flex-col items-center gap-3 mt-4 xl:flex-row xl:items-start xl:gap-6">
            <div className="w-full xl:max-w-sm flex-none">
              <Calendar
                selectedDates={selectedDate ? [selectedDate] : []}
                onSelectDate={(date: Date) => setSelectedDate(date)}
                holidays={hospitalInfo.holidays || []}
              />
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 gap-2 w-full max-w-120 xl:flex-1">
              {BASE_TIMES.map((time) => {
                const isAvailable = availableServerTimes.some((serverTime) =>
                  serverTime.startsWith(time)
                );
                const isBreakTime = breakTimes.some((bt) =>
                  bt.startsWith(time)
                );

                const isBeforeOpen =
                  !!operatingStartTime &&
                  time < operatingStartTime.substring(0, 5);

                const isAfterClose =
                  !!operatingEndTime &&
                  time >= operatingEndTime.substring(0, 5);

                const isDisabled =
                  !selectedDate ||
                  !selectedDepartmentCode ||
                  !isAvailable ||
                  isBreakTime ||
                  isBeforeOpen ||
                  isAfterClose;

                return (
                  <Button
                    key={time}
                    variant="outline"
                    label={time}
                    toggleable
                    active={selectedTime === time}
                    disabled={isDisabled}
                    onClick={() => setSelectedTime(time)}
                    className="w-full h-10 px-0"
                  />
                );
              })}
            </div>
          </div>
        </main>
      </div>

      <footer className="fixed bottom-0 left-0 w-full px-6 pt-3 pb-6 bg-white md:hidden border-t border-gray-100">
        <Button
          label="예약하기"
          className="w-full"
          disabled={!isFormComplete}
          onClick={handleReservation}
        />
      </footer>

      <Popup
        type="confirm"
        open={showLoginPopup}
        title="로그인 후 이용 가능합니다."
        confirmLabel="예"
        cancelLabel="아니오"
        onConfirm={() => navigate("/login")}
        onCancel={() => navigate(-1)}
        onClose={() => setShowLoginPopup(false)}
      />

      <Popup
        type="alert"
        open={showSuccessPopup}
        onClose={() => {
          setShowSuccessPopup(false);
          navigate(`/hospital/${hospitalInfo.id}`);
        }}
        title="예약 완료 되었습니다"
      >
        예약자 명 : {name} <br />
        날짜 :{" "}
        {selectedDate
          ? `${selectedDate.getFullYear()}-${String(
              selectedDate.getMonth() + 1
            ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(
              2,
              "0"
            )}`
          : ""}{" "}
        {selectedTime}
        <br />
        품종 : {selectedBreed} <br />
        진료항목 : {selectedDepartment}
      </Popup>
    </div>
  );
}

export default Reservation;
