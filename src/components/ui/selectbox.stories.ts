import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectBox } from "./selectbox";

const options1 = [
  { value: "DOG_LARGE", label: "대형견" },
  { value: "DOG_MEDIUM", label: "중형견" },
  { value: "DOG_SMALL", label: "소형견" },
  { value: "CAT", label: "고양이" },
  { value: "COW", label: "소" },
  { value: "OTHER", label: "기타" },
];

const options2 = [
  { value: "TERRESTRIAL", label: "육지동물" },
  { value: "AQUATIC", label: "수생동물" },
  { value: "AVIAN", label: "조류" },
  { value: "OTHER", label: "기타" },
];

const meta: Meta<typeof SelectBox> = {
  title: "UI/Select",
  component: SelectBox,
  argTypes: {
    placeholder: {
      control: "text",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SelectBox>;

export const WithLabel: Story = {
  args: {
    placeholder: "진료대상 동물의 종을 선택해주세요.",
    options: options1,
    label: "진료대상 동물",
  },
};

export const WithoutLabel: Story = {
  args: {
    placeholder: "종류",
    options: options2,
    label: undefined,
  },
};
