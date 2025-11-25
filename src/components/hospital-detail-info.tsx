import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Radio } from "./ui/radio";
import { SelectBox } from "./ui/selectbox";
import Calendar from "./ui/calendar";
import Button from "./ui/button";

function HospitalInfo() {
  const [Parking, setParking] = useState("yes");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

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
    "24시간",
  ];

  const Label = ({
    children,
  }: {
    children: React.ReactNode;
    required?: boolean;
  }) => <label className="text-sm text-black">{children}</label>;

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
          <Checkbox variant="secondary" label="예방접종" />
          <Checkbox variant="secondary" label="내과/외과" />
          <Checkbox variant="secondary" label="치과/피부과/안과" />
          <Checkbox variant="secondary" label="중성화수술" />
          <Checkbox variant="secondary" label="건강검진" />
          <Checkbox variant="secondary" label="응급진료" />
          <Checkbox variant="secondary" label="정형외과/심장내과/중앙클리닉" />
        </div>
      </div>

      <div className="w-full flex flex-col gap-1">
        <Label children="진료동물" />
        {/* <SelectBox options={AnimalType} /> */}
        {/* <SelectBox placeholder="종류" />
      <SelectBox placeholder="품종" /> */}
        {/* 종류 ex- #육지동물 */}
        <input
          type="text"
          className="focus:outline-none w-full text-sm text-gray-5"
        />
        {/* 품종 ex- #고양이 */}
        <input
          type="text"
          className="focus:outline-none w-full text-sm text-gray-5"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label children="휴무일 등록" />
        <Calendar selectedDates={selectedDates} onSelectDate={toggleDate} />
      </div>

      <div className="flex flex-col gap-1">
        <Label children="운영시간" />
        <div className="grid grid-cols-4 gap-2">
          {times.map((time) => (
            <Button
              key={time}
              variant="secondary"
              label={time}
              toggleable
              active={selectedTimes.includes(time)}
              onClick={() => toggleTime(time)}
              className="w-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HospitalInfo;
