import Button from "./ui/button";
import { PencilLine, Trash2 } from "lucide-react";

export interface ReviewType {
  id: number;
  date: string;
  username: string;
  animalType: string;
  breed: string;
  department: string;
  revisit: string;
  content: string;
  isMyReview: boolean;
}

interface ReviewProps {
  reviews: ReviewType[];
  onDelete: (id: number) => void;
}

const Review = ({ reviews, onDelete }: ReviewProps) => {
  return (
    <div className="flex flex-col justify-center items-center w-full ">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div
            key={review.id}
            className="w-full text-sm p-4 border-b border-b-gray-3 flex flex-col gap-1 relative"
          >
            <div className="flex justify-between items-center text-gray-6 text-xs mb-1">
              <p>{review.date}</p>
              <p>작성자 : {review.username}</p>
            </div>

            <p>
              진료동물 : {review.animalType} / {review.breed}
            </p>
            <p>진료항목 : {review.department}</p>
            <p>재방문 의사 : {review.revisit}</p>
            <p className="mt-2 whitespace-pre-wrap leading-relaxed">
              {review.content}
            </p>

            {review.isMyReview && (
              <Button
                variant="icon"
                icon={Trash2}
                iconSize="w-5 h-5"
                className="hover:text-black absolute text-gray-6 right-5 top-[50%]"
                onClick={() => onDelete(review.id)}
              />
            )}
          </div>
        ))
      ) : (
        <Button
          icon={PencilLine}
          variant="outline"
          label="리뷰를 남겨주세요!"
          className="text-gray-6 flex justify-center items-center w-[324px] gap-2 my-6"
        />
      )}
    </div>
  );
};

export default Review;
