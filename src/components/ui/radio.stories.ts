import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio } from "./radio";

const meta: Meta<typeof Radio> = {
  title: "UI/Radio",
  component: Radio,
  argTypes: {
    // variant: {
    //   control: "select",
    //   options: ["secondary"],
    // },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Secondary: Story = {
  args: {
    value: "yes",
    onChange: () => {},
    options: [
      { value: "yes", label: "있음" },
      { value: "no", label: "없음" },
    ],
  },
};
