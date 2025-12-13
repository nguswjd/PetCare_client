import Button from "./ui/button";
import { Square, SquareCheckBig } from "lucide-react";

interface ReservationData {
  reservationId: number;
  reserverName: string;
  userPhoneNumber: string;
  animalType: string;
  breed: string;
  age: number;
  weight: number;
  department: string;
  date: string;
  time: string;
  status: string;
}

interface StatusUserListProps {
  data: ReservationData;
  isChecked?: boolean;
  onToggle?: (id: number) => void;
  showCheckbox?: boolean;
}

const StatusUserList = ({
  data,
  isChecked = false,
  onToggle,
  showCheckbox = false,
}: StatusUserListProps) => {
  const formattedDate = data.date.replace(/-/g, ".");
  const formattedTime = data.time.substring(0, 5);

  return (
    <div className="flex gap-4 max-w-90 w-full border-b border-b-gray-5 pb-4 items-start">
      {showCheckbox && onToggle && (
        <Button
          variant="icon"
          className="mt-1 shrink-0"
          icon={isChecked ? SquareCheckBig : Square}
          onClick={() => onToggle(data.reservationId)}
        />
      )}

      <div className="text-sm flex w-full flex-col gap-1">
        <p className="self-end text-gray-500 text-xs mb-1">{formattedDate}</p>
        <p>
          <span className="font-semibold">이름 :</span> {data.reserverName}
        </p>
        <p>
          <span className="font-semibold">번호 :</span> {data.userPhoneNumber}
        </p>
        <p>
          <span className="font-semibold">진료대상 :</span> {data.animalType} (
          {data.breed})
        </p>
        <p className="text-gray-600">
          {data.age}살 / {data.weight}kg
        </p>
        <p>
          <span className="font-semibold">진료항목 :</span> {data.department}
        </p>
        <p>
          <span className="font-semibold">예약 시간 :</span> {formattedDate}{" "}
          {formattedTime}
        </p>
      </div>
    </div>
  );
};

export default StatusUserList;
