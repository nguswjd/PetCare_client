import { useState, useEffect } from "react";

import { Checkbox } from "./ui/checkbox";
import { Radio } from "./ui/radio";
import { MultiSelectBox } from "./ui/multi-selectbox";
import { SelectBox } from "./ui/selectbox";
import Input from "./ui/input";
import Calendar from "./ui/calendar";

function HospitalInfo() {
  const [Parking, setParking] = useState("yes");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);

  const [animalTypes, setAnimalTypes] = useState<
    Array<{ code: string; description: string }>
  >([]);
  const [breeds, setBreeds] = useState<
    Array<{ code: string; description: string }>
  >([]);
  const [selectedAnimalTypes, setSelectedAnimalTypes] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [breakTimes, setBreakTimes] = useState<string[]>([]);

  const times: string[] = Array.from(
    { length: 24 },
    (_, i) => i.toString().padStart(2, "0") + ":00"
  );

  const treatments = [
    "예방접종",
    "내과/외과",
    "치과/피부과/안과",
    "중성화수술",
    "건강검진",
    "응급진료",
    "정형외과/심장내과/중앙클리닉",
    "기타",
  ];

  const Label = ({
    children,
  }: {
    children: React.ReactNode;
    required?: boolean;
  }) => <label className="text-sm text-black">{children}</label>;

  useEffect(() => {
    const fetchAnimalTypes = async () => {
      try {
        const response = await fetch("/api/v1/auth/animal-types");
        const data = await response.json();
        setAnimalTypes(data.types || []);
      } catch (error) {
        console.error("동물 종류 조회 실패:", error);
      }
    };

    fetchAnimalTypes();
  }, []);

  useEffect(() => {
    if (selectedAnimalTypes.length === 0) {
      setBreeds([]);
      return;
    }

    const fetchAllBreeds = async () => {
      try {
        const breedPromises = selectedAnimalTypes.map((type) =>
          fetch(`/api/v1/auth/breeds/${type}`).then((res) => res.json())
        );
        const results = await Promise.all(breedPromises);

        const allBreeds = results.flatMap((data) => data.breeds || []);
        const uniqueBreeds = Array.from(
          new Map(allBreeds.map((breed) => [breed.code, breed])).values()
        );
        setBreeds(uniqueBreeds);
      } catch (error) {
        console.error("품종 조회 실패:", error);
        setBreeds([]);
      }
    };

    fetchAllBreeds();
  }, [selectedAnimalTypes]);

  const toggleDate = (date: Date) => {
    setSelectedDates((prev) => {
      const exists = prev.some((d) => d.toDateString() === date.toDateString());
      return exists
        ? prev.filter((d) => d.toDateString() !== date.toDateString())
        : [...prev, date];
    });
  };

  const toggleTime = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const toggleTreatment = (treatment: string) => {
    setSelectedTreatments((prev) =>
      prev.includes(treatment)
        ? prev.filter((t) => t !== treatment)
        : [...prev, treatment]
    );
  };

  const handleAnimalTypeChange = (value: string) => {
    setSelectedAnimalTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  const handleBreedChange = (value: string) => {
    setSelectedBreeds((prev) =>
      prev.includes(value) ? prev.filter((b) => b !== value) : [...prev, value]
    );
  };

  const getAnimalTypesHashtags = () => {
    return selectedAnimalTypes
      .map((code) => {
        const type = animalTypes.find((t) => t.code === code);
        return type ? `#${type.description}` : "";
      })
      .filter(Boolean)
      .join(" ");
  };

  const getBreedsHashtags = () => {
    return selectedBreeds
      .map((code) => {
        const breed = breeds.find((b) => b.code === code);
        return breed ? `#${breed.description}` : "";
      })
      .filter(Boolean)
      .join(" ");
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label children="주차장 여부" />
        <Radio
          value={Parking}
          onChange={setParking}
          options={[
            { value: "yes", label: "있음" },
            { value: "no", label: "없음" },
          ]}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label children="진료항목" />
        <div className="grid grid-cols-2 gap-2">
          {treatments.map((treatment) => (
            <Checkbox
              key={treatment}
              variant="secondary"
              label={treatment}
              checked={selectedTreatments.includes(treatment)}
              onCheckedChange={() => toggleTreatment(treatment)}
            />
          ))}
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <Label children="진료동물" />
        <div className="flex gap-2">
          <MultiSelectBox
            placeholder="종류"
            options={animalTypes.map((type) => ({
              value: type.code,
              label: type.description,
            }))}
            onChange={handleAnimalTypeChange}
            selectedValues={selectedAnimalTypes}
          />
          <MultiSelectBox
            placeholder="품종"
            options={breeds.map((breed) => ({
              value: breed.code,
              label: breed.description,
            }))}
            onChange={handleBreedChange}
            selectedValues={selectedBreeds}
            disabled={selectedAnimalTypes.length === 0 || breeds.length === 0}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Input
            className="text-sm p-0 text-gray-5 border-none"
            value={getAnimalTypesHashtags()}
            readOnly
          />
          <textarea
            className="text-sm p-0 text-gray-5 border-none resize-none outline-none bg-transparent w-full min-h-[20px]"
            value={getBreedsHashtags()}
            readOnly
            rows={1}
            style={{
              overflow: "hidden",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
            ref={(el) => {
              if (el) {
                el.style.height = "auto";
                el.style.height = el.scrollHeight + "px";
              }
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label children="운영시간" />
        <div className="flex gap-2">
          <SelectBox
            placeholder="시작시간"
            options={times.map((t) => ({ value: t, label: t }))}
            value={startTime || ""}
            onChange={setStartTime}
          />

          <SelectBox
            placeholder="종료시간"
            options={times.map((t) => ({ value: t, label: t }))}
            value={endTime || ""}
            onChange={setEndTime}
          />

          <MultiSelectBox
            placeholder="휴계시간"
            options={times.map((t) => ({ value: t, label: t }))}
            selectedValues={breakTimes}
            onChange={(value) => {
              setBreakTimes((prev) =>
                prev.includes(value)
                  ? prev.filter((v) => v !== value)
                  : [...prev, value]
              );
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label children="휴무일 등록" />
        <Calendar selectedDates={selectedDates} onSelectDate={toggleDate} />
      </div>
    </div>
  );
}

export default HospitalInfo;
