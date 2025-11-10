import Button from "./ui/button";
import { PencilLine } from "lucide-react";

export interface ReviewType {
  date: string;
  animalType: string;
  department: string;
  revisit: string;
  content: string;
}

interface ReviewProps {
  reviews: ReviewType[];
}

const Review = ({ reviews }: ReviewProps) => {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div
            key={index}
            className="w-full text-sm p-4 border-b border-b-gray-3 flex flex-col gap-1"
          >
            <p className="text-right">{review.date}</p>
            <p>진료대상 : {review.animalType}</p>
            <p>진료항목 : {review.department}</p>
            <p>재방문 의사 : {review.revisit}</p>
            <p>{review.content}</p>
          </div>
        ))
      ) : (
        <Button
          icon={PencilLine}
          variant="outline"
          label="리뷰를 남겨주세요!"
          className="text-gray-6 flex justify-center items-center w-[324px] gap-2"
        />
      )}
    </div>
  );
};

export default Review;
