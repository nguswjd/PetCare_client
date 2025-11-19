import type { Meta, StoryObj } from "@storybook/react-vite";
import Calendar from "./calendar";

const meta: Meta<typeof Calendar> = {
  title: "Ui/Calendar",
  component: Calendar,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
