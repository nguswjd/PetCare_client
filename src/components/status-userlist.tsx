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

const statusMap: Record<string, string> = {
  PENDING: "예약 대기",
  CONFIRMED: "예약 확정",
  CANCELLED: "예약 취소",
  NO_SHOW: "노쇼 (미방문)",
  VISITED: "방문 확인",
  COMPLETED: "진료 완료",
};

const statusColorMap: Record<string, string> = {
  PENDING: "text-blue-2",
  CONFIRMED: "text-green-600",
  CANCELLED: "text-gray-5",
  NO_SHOW: "text-red font-bold",
  VISITED: "text-gray-7",
  COMPLETED: "text-gray-7",
};

const StatusUserList = ({
  data,
  isChecked = false,
  onToggle,
  showCheckbox = false,
}: StatusUserListProps) => {
  const formattedDate = data.date.replace(/-/g, ".");
  const formattedTime = data.time.substring(0, 5);

  const statusLabel = statusMap[data.status] || data.status;
  const statusColor = statusColorMap[data.status] || "text-black";

  return (
    <div className="flex gap-4 max-w-90 w-full border-b border-b-gray-5 pb-4">
      {showCheckbox && onToggle && (
        <Button
          variant="icon"
          className="mt-1 shrink-0"
          icon={isChecked ? SquareCheckBig : Square}
          onClick={() => onToggle(data.reservationId)}
        />
      )}

      <div className="text-sm flex w-full flex-col gap-1">
        <div className="flex justify-between items-center mb-1">
          <span className={`text-xs ${statusColor}`}>{statusLabel}</span>
        </div>

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
        <p>
          <span className="font-semibold">나이 / 무게 :</span>
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
