import { useState, useEffect, useRef } from "react";

import { Checkbox } from "./ui/checkbox";
import { Radio } from "./ui/radio";
import { MultiSelectBox } from "./ui/multi-selectbox";
import { SelectBox } from "./ui/selectbox";
import Input from "./ui/input";
import Calendar from "./ui/calendar";
import { Upload, X } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

interface HospitalInfoProps {
  onDataChange?: (data: HospitalFormData) => void;
}

export interface HospitalFormData {
  hasParking: boolean;
  departments: string[];
  animalTypes: string[];
  breeds: string[];
  holidays: string[];
  operatingStartTime: string | null;
  operatingEndTime: string | null;
  breakTimes: string[];
  imageFile: File | null;
}

interface Department {
  code: string;
  description: string;
}

function HospitalInfo({ onDataChange }: HospitalInfoProps) {
  const [Parking, setParking] = useState("yes");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [departments, setDepartments] = useState<Department[]>([]);

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

  const onDataChangeRef = useRef(onDataChange);

  useEffect(() => {
    onDataChangeRef.current = onDataChange;
  }, [onDataChange]);

  const times: string[] = Array.from(
    { length: 24 },
    (_, i) => i.toString().padStart(2, "0") + ":00"
  );

  const Label = ({
    children,
  }: {
    children: React.ReactNode;
    required?: boolean;
  }) => <label className="text-sm text-black">{children}</label>;

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/departments`);
        const data = await response.json();
        setDepartments(data.departments || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchAnimalTypes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/animal-types`);
        const data = await response.json();
        setAnimalTypes(data.types || []);
      } catch (error) {
        console.error(error);
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
          fetch(`${API_BASE_URL}/api/v1/breeds/${type}`).then((res) =>
            res.json()
          )
        );
        const results = await Promise.all(breedPromises);

        const allBreeds: Array<{ code: string; description: string }> =
          results.flatMap((data) => data.breeds || []);
        const uniqueBreeds = Array.from(
          new Map(allBreeds.map((breed) => [breed.code, breed])).values()
        );
        setBreeds(uniqueBreeds);
      } catch (error) {
        console.error(error);
        setBreeds([]);
      }
    };

    fetchAllBreeds();
  }, [selectedAnimalTypes]);

  useEffect(() => {
    if (onDataChangeRef.current) {
      onDataChangeRef.current({
        hasParking: Parking === "yes",
        departments: selectedDepartments,
        animalTypes: selectedAnimalTypes,
        breeds: selectedBreeds,
        holidays: selectedDates.map((d) => d.toISOString().split("T")[0]),
        operatingStartTime: startTime,
        operatingEndTime: endTime,
        breakTimes: breakTimes,
        imageFile: imageFile,
      });
    }
  }, [
    Parking,
    selectedDepartments,
    selectedAnimalTypes,
    selectedBreeds,
    selectedDates,
    startTime,
    endTime,
    breakTimes,
    imageFile,
  ]);

  const toggleDate = (date: Date) => {
    setSelectedDates((prev) => {
      const exists = prev.some((d) => d.toDateString() === date.toDateString());
      return exists
        ? prev.filter((d) => d.toDateString() !== date.toDateString())
        : [...prev, date];
    });
  };

  const toggleDepartment = (code: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(code) ? prev.filter((d) => d !== code) : [...prev, code]
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

  const endTimes = startTime ? times.filter((t) => t >= startTime) : times;

  const breakTimeOptions =
    startTime && endTime
      ? startTime === endTime
        ? times
        : times.filter((t) => t > startTime && t < endTime)
      : times;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      setImageFile(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImageFile(null);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Label children="병원이미지 업로드" />
          <label
            htmlFor="image-upload"
            className="cursor-pointer inline-flex items-center justify-center p-2 rounded-lg transition-colors"
          >
            <Upload className="w-5 h-5" />
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {uploadedImage && (
          <div className="relative w-full aspect-video">
            <img
              src={uploadedImage}
              alt="병원 이미지"
              className="w-full h-full object-cover rounded-lg"
            />
            <X
              onClick={removeImage}
              className="absolute top-2 w-5 h-5 right-2  text-black rounded-full flex items-center justify-center hover:bg-gray-2"
            />
          </div>
        )}
      </div>

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
          {departments.map((dept) => (
            <Checkbox
              key={dept.code}
              variant="secondary"
              label={dept.description}
              checked={selectedDepartments.includes(dept.code)}
              onCheckedChange={() => toggleDepartment(dept.code)}
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
            className="text-sm p-0 text-gray-5 border-none resize-none outline-none bg-transparent w-full min-h-5"
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
            onChange={(value) => {
              setStartTime(value);
              if (endTime && value && value >= endTime) setEndTime(null);
              setBreakTimes([]);
            }}
          />

          <SelectBox
            placeholder="종료시간"
            options={endTimes.map((t) => ({ value: t, label: t }))}
            value={endTime || ""}
            onChange={(value) => {
              setEndTime(value);
              setBreakTimes([]);
            }}
          />

          <MultiSelectBox
            placeholder="휴계시간"
            options={breakTimeOptions.map((t) => ({ value: t, label: t }))}
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
