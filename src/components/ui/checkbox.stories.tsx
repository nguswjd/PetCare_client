import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Primary: Story = {
  args: { variant: "primary", label: "(필수) 개인정보 수집 및 이용동의" },
};

export const Secondary: Story = {
  args: { variant: "secondary", label: "있음" },
};

export const PrimaryExpandable: Story = {
  args: {
    variant: "primary",
    label: "(필수) 개인정보 수집 및 이용동의",
    expandable: true,
    children: <div>{"상세내용 ".repeat(50)}</div>,
  },
};
