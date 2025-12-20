import { useState, useEffect } from "react";
import type { ReviewType } from "@/components/review";

interface ApiReviewType {
  reviewId: number;
  hospitalName: string;
  username: string;
  animalType: string;
  breed: string;
  department: string;
  content: string;
  visitDate: string;
  createdDate: string;
  revisitIntention: boolean;
}

export const useReviewList = () => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/v1/reviews/hospital/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("리뷰 조회 실패");
      }

      const data: ApiReviewType[] = await res.json();

      const formattedReviews: ReviewType[] = data.map((review) => ({
        id: review.reviewId,
        date: review.createdDate.replace(/-/g, "."),
        username: review.username,
        animalType: review.animalType,
        breed: review.breed,
        department: review.department,
        revisit: review.revisitIntention ? "있음" : "없음",
        content: review.content,
        isMyReview: false,
      }));

      setReviews(formattedReviews);
    } catch (err) {
      console.error("리뷰 로딩 에러:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    reviews,
    loading,
  };
};
