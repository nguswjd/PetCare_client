import { useState, useEffect, useRef } from "react";

import { Checkbox } from "./ui/checkbox";
import { Radio } from "./ui/radio";
import { MultiSelectBox } from "./ui/multi-selectbox";
import { SelectBox } from "./ui/selectbox";
import Input from "./ui/input";
import Field from "./ui/field";
import Calendar from "./ui/calendar";
import { Upload, X } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

interface HospitalInfoProps {
  onDataChange?: (data: HospitalFormData) => void;
  editMode?: boolean;
  initialData?: {
    imageUrl: string | null;
    hasParking: boolean;
    departments: string[];
    animalTypes: string[];
    breeds: string[];
    holidays: string[];
    operatingStartTime: string | null;
    operatingEndTime: string | null;
    breakTimes: string[];
  };
  showBasicFields?: boolean;
  basicFieldsData?: {
    representativeName?: string;
    name?: string;
    address?: string;
  };
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

function HospitalInfo({
  onDataChange,
  editMode = true,
  initialData,
  showBasicFields = false,
  basicFieldsData,
}: HospitalInfoProps) {
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

  const formatTime = (time: string | null) => {
    if (!time) return null;
    return time.slice(0, 5);
  };

  useEffect(() => {
    if (initialData) {
      setParking(initialData.hasParking ? "yes" : "no");
      setSelectedDepartments(initialData.departments || []);
      setSelectedAnimalTypes(initialData.animalTypes || []);
      setSelectedBreeds(initialData.breeds || []);
      setSelectedDates((initialData.holidays || []).map((h) => new Date(h)));
      setStartTime(formatTime(initialData.operatingStartTime));
      setEndTime(formatTime(initialData.operatingEndTime));
      setBreakTimes(
        (initialData.breakTimes || [])
          .map(formatTime)
          .filter((t): t is string => t !== null)
      );
      if (initialData.imageUrl) setUploadedImage(initialData.imageUrl);
    }
  }, [initialData]);

  const times: string[] = Array.from(
    { length: 24 },
    (_, i) => i.toString().padStart(2, "0") + ":00"
  );

  const Label = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
    required?: boolean;
  }) => <label className={`text-sm text-black ${className}`}>{children}</label>;

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
        const allBreeds = results.flatMap((data) => data.breeds || []);
        const uniqueBreeds = Array.from(
          new Map(allBreeds.map((b) => [b.code, b])).values()
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
    if (!editMode) return;
    setSelectedDates((prev) => {
      const exists = prev.some((d) => d.toDateString() === date.toDateString());
      return exists
        ? prev.filter((d) => d.toDateString() !== date.toDateString())
        : [...prev, date];
    });
  };

  const toggleDepartment = (code: string) => {
    if (!editMode) return;
    setSelectedDepartments((prev) =>
      prev.includes(code) ? prev.filter((d) => d !== code) : [...prev, code]
    );
  };

  const handleAnimalTypeChange = (value: string) => {
    if (!editMode) return;
    setSelectedAnimalTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  const handleBreedChange = (value: string) => {
    if (!editMode) return;
    setSelectedBreeds((prev) =>
      prev.includes(value) ? prev.filter((b) => b !== value) : [...prev, value]
    );
  };

  const getAnimalTypesHashtags = () =>
    selectedAnimalTypes
      .map((code) => animalTypes.find((t) => t.code === code)?.description)
      .filter(Boolean)
      .map((desc) => `#${desc}`)
      .join(" ");

  const getBreedsHashtags = () =>
    selectedBreeds
      .map((code) => breeds.find((b) => b.code === code)?.description)
      .filter(Boolean)
      .map((desc) => `#${desc}`)
      .join(" ");

  const endTimes = startTime ? times.filter((t) => t >= startTime) : times;

  const breakTimeOptions =
    startTime && endTime
      ? startTime === endTime
        ? times
        : times.filter((t) => t > startTime && t < endTime)
      : times;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editMode) return;
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => setUploadedImage(reader.result as string);
    reader.readAsDataURL(file);

    setImageFile(file);
  };

  const removeImage = () => {
    if (!editMode) return;
    setUploadedImage(null);
    setImageFile(null);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-col lg:flex-row lg:gap-6">
        <div className="flex flex-col gap-4 lg:flex-1">
          {showBasicFields && basicFieldsData && (
            <div className="flex flex-col gap-2">
              <Field placeholder={basicFieldsData.representativeName} />
              <Field placeholder={basicFieldsData.name} />
              <Field placeholder={basicFieldsData.address} />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="">
                <Label
                  children={editMode ? "병원이미지 업로드" : "병원이미지"}
                  className="required"
                />
              </div>
              {editMode && (
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex items-center justify-center p-2 rounded-lg transition-colors"
                >
                  <Upload className="w-5 h-5" />
                </label>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={!editMode}
              />
            </div>

            {uploadedImage && (
              <div className="relative w-full aspect-video">
                <img
                  src={uploadedImage}
                  alt="병원 이미지"
                  className="w-full h-full object-cover rounded-lg"
                />
                {editMode && (
                  <X
                    onClick={removeImage}
                    className="absolute top-2 w-5 h-5 right-2 cursor-pointer text-black rounded-full flex items-center justify-center hover:bg-gray-2"
                  />
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label children="주차장 여부" />
            <Radio
              value={Parking}
              onChange={editMode ? setParking : () => {}}
              options={[
                { value: "yes", label: "있음" },
                { value: "no", label: "없음" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label children="진료항목" className="required" />
            <div className="grid grid-cols-2 gap-2">
              {departments.map((dept) => (
                <Checkbox
                  key={dept.code}
                  variant="secondary"
                  label={dept.description}
                  checked={selectedDepartments.includes(dept.code)}
                  onCheckedChange={() => toggleDepartment(dept.code)}
                  disabled={!editMode}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-1">
          <div className="w-full flex flex-col gap-2">
            <Label children="진료동물" className="required" />
            <div className="flex gap-2">
              <MultiSelectBox
                placeholder="종류"
                options={animalTypes.map((type) => ({
                  value: type.code,
                  label: type.description,
                }))}
                onChange={handleAnimalTypeChange}
                selectedValues={selectedAnimalTypes}
                disabled={!editMode}
              />
              <MultiSelectBox
                placeholder="품종"
                options={breeds.map((breed) => ({
                  value: breed.code,
                  label: breed.description,
                }))}
                onChange={handleBreedChange}
                selectedValues={selectedBreeds}
                disabled={
                  !editMode ||
                  selectedAnimalTypes.length === 0 ||
                  breeds.length === 0
                }
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
            <Label children="운영시간" className="required" />
            <div className="flex gap-2">
              <SelectBox
                placeholder="시작시간"
                options={times.map((t) => ({ value: t, label: t }))}
                value={startTime ?? undefined}
                onChange={(value) => {
                  if (!editMode) return;
                  setStartTime(value);
                  if (endTime && value && value >= endTime) setEndTime(null);
                  setBreakTimes([]);
                }}
                disabled={!editMode}
              />
              <SelectBox
                placeholder="종료시간"
                options={endTimes.map((t) => ({ value: t, label: t }))}
                value={endTime ?? undefined}
                onChange={(value) => {
                  if (!editMode) return;
                  setEndTime(value);
                  setBreakTimes([]);
                }}
                disabled={!editMode}
              />
              <MultiSelectBox
                placeholder="휴계시간"
                options={breakTimeOptions.map((t) => ({ value: t, label: t }))}
                selectedValues={breakTimes}
                onChange={(value) => {
                  if (!editMode) return;
                  setBreakTimes((prev) =>
                    prev.includes(value)
                      ? prev.filter((v) => v !== value)
                      : [...prev, value]
                  );
                }}
                disabled={!editMode}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label children="휴무일 등록" />
            <Calendar selectedDates={selectedDates} onSelectDate={toggleDate} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HospitalInfo;
