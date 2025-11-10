import type { Meta, StoryObj } from "@storybook/react-vite";
import ReviewTextarea from "./review-textarea";

const meta: Meta<typeof ReviewTextarea> = {
  title: "Components/ReviewTextarea",
  component: ReviewTextarea,
  argTypes: {
    placeholder: { control: "text" },
    rows: { control: "number" },
  },
};

export default meta;

type Story = StoryObj<typeof ReviewTextarea>;

export const Primary: Story = {
  args: {
    rows: 4,
  },
};
