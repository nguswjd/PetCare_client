import type { Meta, StoryObj } from "@storybook/react-vite";
import Input from "./input";

const meta: Meta<typeof Input> = {
  title: "Example/Input",
  component: Input,
  parameters: {},
  argTypes: {},
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const primary: Story = {
  args: {
    placeholder: "placeholder",
    variant: "primary",
  },
};

export const Search: Story = {
  args: {
    placeholder: "검색어를 입력해주세요.",
    variant: "Search",
  },
};
