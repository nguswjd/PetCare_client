import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReviewType } from "./review";
import Review from "./review";

const meta: Meta<typeof Review> = {
  title: "Components/Review",
  component: Review,
};

export default meta;

type Story = StoryObj<typeof Review>;

const reviews: ReviewType[] = [
  {
    date: "2025.11.10",
    animalType: "개 (말티즈)",
    department: "예방접종",
    revisit: "있음",
    content: "리뷰리뷰",
  },
  {
    date: "2025.11.09",
    animalType: "개 (포메라니안)",
    department: "건강검진",
    revisit: "없음",
    content: "리뷰".repeat(100),
  },
  {
    date: "2025.11.08",
    animalType: "고양이 (코숏)",
    department: "예방접종",
    revisit: "있음",
    content: "리뷰리뷰리뷰리뷰",
  },
];

const noreviews: ReviewType[] = [];

export const review: Story = {
  args: {
    reviews: reviews,
  },
};

export const noreview: Story = {
  args: {
    reviews: noreviews,
  },
};
