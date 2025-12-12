import { useState } from "react";

import Button from "./ui/button";
import { Square, SquareCheckBig } from "lucide-react";

export interface StatusUserList {}

const StatusUserList = () => {
  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    setChecked((prev) => !prev);
  };

  return (
    <div className="flex gap-6 max-w-90 w-full border-b border-b-gray-5 pb-4">
      <Button
        variant="icon"
        icon={checked ? SquareCheckBig : Square}
        onClick={handleToggle}
      />
      <div className="text-sm flex w-full flex-col gap-1">
        <p className="self-end">2025.12.12</p>
        <p>이름 : 남현정</p>
        <p>번호 : 010-1234-5678</p>
        <p>진료대상 : 개(대형)</p>
        <p>3살 / 10kg</p>
        <p>진료항목 : 예방접종</p>
        <p>예약 시간 : 10:00</p>
      </div>
    </div>
  );
};

export default StatusUserList;
