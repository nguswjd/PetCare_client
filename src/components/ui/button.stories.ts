import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Example/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    icon: { control: false },
  },
  args: {
    label: "Button",
    disabled: false,
    icon: undefined,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Injective: Story = {
  args: {
    label: "Injective",
  },
};
