import { useState, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Popup from "./popup";

const meta: Meta<typeof Popup> = {
  title: "Components/Popup",
  component: Popup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "radio",
      options: ["confirm", "form", "alert"],
    },
    open: { control: "boolean" },
    onConfirm: { action: "confirmed" },
    onCancel: { action: "cancelled" },
    onClose: { action: "closed" },
  },
  args: {
    open: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const PopupWithTrigger = (args: any) => {
  const [isOpen, setIsOpen] = useState(args.open);

  useEffect(() => {
    setIsOpen(args.open);
  }, [args.open]);

  const handleClose = () => {
    setIsOpen(false);
    args.onClose?.();
  };

  return (
    <>
      <div className="text-center p-4 border rounded border-gray-3 text-gray-5">
        <button
          className="p-2 text-black rounded-md text-sm"
          onClick={() => setIsOpen(true)}
        >
          팝업 열기
        </button>
      </div>

      <Popup
        {...args}
        open={isOpen}
        onClose={handleClose}
        onCancel={() => {
          args.onCancel?.();
          handleClose();
        }}
        onConfirm={(val) => {
          args.onConfirm?.(val);
          if (args.type !== "form") handleClose();
        }}
      />
    </>
  );
};

export const Confirm: Story = {
  args: {
    type: "confirm",
    title: "로그아웃 하시겠습니까?",
    confirmLabel: "예",
    cancelLabel: "아니오",
  },
  render: PopupWithTrigger,
};

export const Form: Story = {
  args: {
    type: "form",
    title: "비밀번호 확인",
    placeholder: "비밀번호를 입력하세요",
    confirmLabel: "확인",
    cancelLabel: "취소",
    error: false,
    errorMessage: "비밀번호가 일치하지 않습니다",
  },
  render: PopupWithTrigger,
};

export const Alert: Story = {
  args: {
    type: "alert",
    title: "알림",
    children: "예약이 성공적으로\n완료되었습니다.",
  },
  render: PopupWithTrigger,
};
