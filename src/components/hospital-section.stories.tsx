import type { Meta, StoryObj } from "@storybook/react";
import HospitalInfoSection from "./hospital-section";

const meta: Meta<typeof HospitalInfoSection> = {
  title: "Components/HospitalInfoSection",
  component: HospitalInfoSection,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onButtonClick: { action: "clicked" },
    hasParking: { control: "boolean" },
    showButton: { control: "boolean" },
  },
  args: {
    image: "",
    alt: "행복한 동물병원 전경",
    name: "행복한 동물병원",
    address: "서울시 강남구 역삼동 123-45",
    businessStatus: "영업중",
    hasParking: true,
    breeds: ["강아지", "고양이", "특수동물"],
    reviewCount: 128,
    departments: ["내과", "외과", "피부과", "치과"],
    hospitalNumber: "02-1234-5678",
    showButton: false,
  },
  decorators: [(Story) => <Story />],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithReservationButton: Story = {
  args: {
    showButton: true,
    buttonLabel: "예약하기",
  },
};

export const ClosedStatus: Story = {
  args: {
    businessStatus: "진료마감",
    hasParking: false,
    reviewCount: 42,
  },
};

export const SimpleInfo: Story = {
  args: {
    departments: ["일반진료"],
    breeds: ["강아지"],
    hospitalNumber: undefined,
  },
};
