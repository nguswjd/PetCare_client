import { useState } from "react";

export const useReservationActions = (
  selectedIds: number[],
  onComplete: () => void,
  onCancel: () => void
) => {
  const [popupState, setPopupState] = useState({
    open: false,
    type: "alert" as "alert" | "confirm",
    title: "",
    content: "",
    onConfirm: () => {},
  });

  const closePopup = () => {
    setPopupState((prev) => ({ ...prev, open: false }));
  };

  const handleCompleteReservations = () => {
    if (selectedIds.length === 0) {
      setPopupState({
        open: true,
        type: "alert",
        title: "진료완료할 예약을 선택해주세요.",
        content: "",
        onConfirm: () => {},
      });
      return;
    }

    setPopupState({
      open: true,
      type: "confirm",
      title: `${selectedIds.length}건을 진료 완료 처리하시겠습니까?`,
      content: "",
      onConfirm: onComplete,
    });
  };

  const handleCancelReservations = () => {
    if (selectedIds.length === 0) {
      setPopupState({
        open: true,
        type: "alert",
        title: "취소할 예약을 선택해주세요.",
        content: "",
        onConfirm: () => {},
      });
      return;
    }

    setPopupState({
      open: true,
      type: "confirm",
      title: `${selectedIds.length}건의 예약을 취소하시겠습니까?`,
      content: "",
      onConfirm: onCancel,
    });
  };

  return {
    popupState,
    closePopup,
    handleCompleteReservations,
    handleCancelReservations,
  };
};
