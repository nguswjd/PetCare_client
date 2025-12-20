import { useState, useEffect } from "react";

export interface ReviewResponse {
  reviewId: number;
  hospitalId: number;
  hospitalName: string;
  hospitalImageUrl: string;
  username?: string;
  department: string;
  content: string;
  visitDate?: string;
  createdDate: string;
  revisitIntention?: boolean;
  isMyReview: boolean;
}

export const useReviews = () => {
  const [myReviews, setMyReviews] = useState<ReviewResponse[]>([]);

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/v1/reviews/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("리뷰 목록 불러오기 실패");

      const data: ReviewResponse[] = await res.json();
      setMyReviews(data);
    } catch (err) {
      console.error(err);
      setMyReviews([]);
    }
  };

  return {
    myReviews,
  };
};
