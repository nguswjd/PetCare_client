import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReviewType } from "./review";
import Review from "./review";

const meta: Meta<typeof Review> = {
  title: "Components/Review",
  component: Review,
  args: {
    onDelete: (id: number) => console.log(`Delete review with ID: ${id}`),
  },
  argTypes: {
    onDelete: { action: "onDelete" },
  },
};

export default meta;

type Story = StoryObj<typeof Review>;

const reviews: ReviewType[] = [
  {
    id: 1,
    username: "홍길동",
    breed: "말티즈",
    date: "2025.11.10",
    animalType: "개",
    department: "예방접종",
    revisit: "있음",
    content: "리뷰리뷰. 제가 작성한 리뷰입니다.",
    isMyReview: true,
  },
  {
    id: 2,
    username: "김철수",
    breed: "포메라니안",
    date: "2025.11.09",
    animalType: "개",
    department: "건강검진",
    revisit: "없음",
    content: "리뷰".repeat(100),
    isMyReview: false,
  },
  {
    id: 3,
    username: "이영희",
    breed: "코숏",
    date: "2025.11.08",
    animalType: "고양이",
    department: "예방접종",
    revisit: "있음",
    content: "리뷰리뷰리뷰리뷰",
    isMyReview: false,
  },
];

const myOnlyReviews: ReviewType[] = [
  {
    id: 4,
    username: "나",
    breed: "기니피그",
    date: "2025.12.01",
    animalType: "기니피그",
    department: "피부과",
    revisit: "있음",
    content: "이건 제가 작성한 리뷰이고, 삭제 버튼이 보입니다.",
    isMyReview: true,
  },
];

const noReviews: ReviewType[] = [];

export const DefaultReviews: Story = {
  args: {
    reviews,
  },
};

export const MyOnlyReview: Story = {
  args: {
    reviews: myOnlyReviews,
  },
};

export const NoReviews: Story = {
  args: {
    reviews: noReviews,
  },
};
