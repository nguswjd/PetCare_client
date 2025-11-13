import type { Meta, StoryObj } from "@storybook/react-vite";
import Card from "./card";

const meta: Meta<typeof Card> = {
  title: "Ui/Card",
  component: Card,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
  args: {
    variant: "primary",
    size: "md",
    image: "",
    alt: "병원 이미지",
    name: "A hospital",
    address: "제주시 외도동",
    content: "깨끗하고 좋아요~",
    businessStatus: "24시간 영업",
    distance: "30km",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    size: "md",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};
