import React, { useState } from "react";
import Button from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Day {
  date: Date;
  isCurrentMonth: boolean;
}

interface CalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSelectDate }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);

  const generateCalendarDays = (): Day[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: Day[] = [];

    const prevMonthDays = firstDay.getDay();
    for (let i = prevMonthDays; i > 0; i--) {
      days.push({
        date: new Date(year, month, 1 - i),
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    const nextMonthDays = 42 - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );

    if (
      prevMonth.getFullYear() < today.getFullYear() ||
      (prevMonth.getFullYear() === today.getFullYear() &&
        prevMonth.getMonth() < today.getMonth())
    ) {
      return;
    }

    setCurrentDate(prevMonth);
  };

  const handleNextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  const days = generateCalendarDays();

  const isPrevDisabled =
    currentDate.getFullYear() < today.getFullYear() ||
    (currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() <= today.getMonth());

  const handleSelectDate = (day: Day) => {
    const isPast =
      day.date <
      new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (isPast) return;

    if (!day.isCurrentMonth) {
      setCurrentDate(new Date(day.date.getFullYear(), day.date.getMonth(), 1));
    }

    onSelectDate(day.date);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="flex px-15 justify-between items-center mb-2">
        <Button
          icon={ChevronLeft}
          variant="icon"
          onClick={handlePrevMonth}
          className={`px-2 py-1 ${
            isPrevDisabled ? "text-gray-3 cursor-not-allowed" : ""
          }`}
          disabled={isPrevDisabled}
        />
        <span className="font-normal text-sm">
          {currentDate.getFullYear()}.{currentDate.getMonth() + 1}
        </span>
        <Button
          icon={ChevronRight}
          variant="icon"
          onClick={handleNextMonth}
          className="px-2 py-1"
        />
      </div>

      <div className="grid grid-cols-7 text-center text-xs font-normal mb-1">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day, idx) => {
          const isSelected =
            selectedDate?.toDateString() === day.date.toDateString();
          const isPast =
            day.date <
            new Date(today.getFullYear(), today.getMonth(), today.getDate());

          return (
            <button
              key={idx}
              disabled={isPast}
              onClick={() => handleSelectDate(day)}
              className={`w-10 h-10 flex justify-center items-center rounded-full transition-colors
                ${!day.isCurrentMonth ? "text-gray-3" : ""}
                ${isPast ? "text-gray-3 cursor-not-allowed" : ""}
                ${
                  isSelected
                    ? "bg-main-1 text-white"
                    : "bg-white hover:bg-main-2/30"
                }
              `}
            >
              {day.date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
