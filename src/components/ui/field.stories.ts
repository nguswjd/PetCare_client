import type { Meta, StoryObj } from "@storybook/react-vite";
import Field from "./field";
import { X } from "lucide-react";

const meta: Meta<typeof Field> = {
  title: "UI/Field",
  component: Field,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "search"],
    },
    label: {
      control: "text",
    },
    placeholder: {
      control: "text",
    },
    value: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  args: {
    variant: "default",
    label: "병원 이름",
    placeholder: "병원 이름을 입력하세요",
  },
};

export const WithXIcon: Story = {
  args: {
    variant: "search",
    value: "24시간 동물병원",
    rightIcon: X,
  },
};