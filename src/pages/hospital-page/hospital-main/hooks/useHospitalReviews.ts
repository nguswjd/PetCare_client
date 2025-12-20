import { useState, useEffect } from "react";

export interface ReviewData {
  reviewId: number;
  hospitalName: string;
  username: string;
  department: string;
  content: string;
  visitDate: string;
  createdDate: string;
  revisitIntention: boolean;
}

export const useHospitalReviews = () => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const reviewRes = await fetch("/api/v1/reviews/hospital/my", {
        headers,
      });

      if (reviewRes.ok) {
        const reviewData = await reviewRes.json();
        setReviews(reviewData);
      } else {
        console.error("리뷰 정보를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      setReviews([]);
    }
  };

  return {
    reviews,
  };
};
