import { useState, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import StatusUserList from "./status-userlist";

const MOCK_DATA = {
  reservationId: 1,
  reserverName: "김철수",
  userPhoneNumber: "010-1234-5678",
  animalType: "DOG",
  animalTypeDescription: "강아지",
  breed: "POODLE",
  breedDescription: "토이푸들",
  age: 3,
  weight: 4.5,
  department: "기본 검진",
  date: "2024-05-20",
  time: "14:30:00",
  status: "PENDING",
};

const meta: Meta<typeof StatusUserList> = {
  title: "Components/StatusUserList",
  component: StatusUserList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isChecked: { control: "boolean" },
    showCheckbox: { control: "boolean" },
    onToggle: { action: "toggled" },
  },
  args: {
    data: MOCK_DATA,
    isChecked: false,
    showCheckbox: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const RenderWithState = (args: any) => {
  const [checked, setChecked] = useState(args.isChecked);

  useEffect(() => {
    setChecked(args.isChecked);
  }, [args.isChecked]);

  const handleToggle = (id: number) => {
    setChecked((prev: boolean) => !prev);
    args.onToggle?.(id);
  };

  return (
    <div className="w-[400px]">
      <StatusUserList {...args} isChecked={checked} onToggle={handleToggle} />
    </div>
  );
};

export const Default: Story = {
  render: RenderWithState,
};

export const Selectable: Story = {
  args: {
    showCheckbox: true,
  },
  render: RenderWithState,
};

export const Confirmed: Story = {
  args: {
    data: {
      ...MOCK_DATA,
      status: "CONFIRMED",
    },
  },
  render: RenderWithState,
};

export const Cancelled: Story = {
  args: {
    data: {
      ...MOCK_DATA,
      status: "CANCELLED",
    },
  },
  render: RenderWithState,
};

export const NoShow: Story = {
  args: {
    data: {
      ...MOCK_DATA,
      status: "NO_SHOW",
    },
  },
  render: RenderWithState,
};

export const Completed: Story = {
  args: {
    data: {
      ...MOCK_DATA,
      status: "COMPLETED",
    },
  },
  render: RenderWithState,
};
