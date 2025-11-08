import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "./button";

const meta: Meta<typeof Button> = {
  title: "Example/Button",
  component: Button,
  parameters: { layout: "centered" },
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

export const primary: Story = {
  args: {
    label: "primary",
    variant: "primary",
  },
};

export const secondary: Story = {
  args: {
    label: "11:11",
    variant: "secondary",
    active: true,
  },
};

export const outline: Story = {
  args: {
    label: "outline",
    variant: "outline",
  },
};

export const user: Story = {
  args: {
    label: "user",
    variant: "user",
  },
};
