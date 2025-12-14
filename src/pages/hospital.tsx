import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import LoadingPage from "../components/loading";
import ErrorPage from "@/components/error";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Review, { type ReviewType } from "@/components/review";
import Button from "@/components/ui/button";
import Popup from "@/components/popup";
import HospitalInfoSection from "@/components/hospital-section";
import { PencilLine } from "lucide-react";
import { addRecentHospitalUnified } from "@/utils/recentHospitals";

interface HospitalInfo {
  id: number;
  name: string;
  address: string;
  operatingStatus: string;
  image: string;
  alt: string;
  distance?: string;
  hasParking: boolean;
  animalTypes: string[];
  departments: string[];
  breeds: string[];
  holidays?: string[];
}

interface ReviewApiResponse {
  reviewId: number;
  hospitalName: string;
  username: string;
  department: string;
  content: string;
  visitDate: string;
  createdDate: string;
  revisitIntention: boolean;
  isMyReview: boolean;
}

interface ActiveReservation {
  id: number;
  userId: number;
  hospitalId: number;
  hospitalName: string;
  reserverName: string;
  animalType: string;
  breed: string;
  age: number;
  weight: number;
  department: string;
  reservationDate: string;
  reservationTime: string;
  status: string;
  createdAt: string;
}

function Hospital() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo | null>(null);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reviewCount, setReviewCount] = useState<number>(0);

  const [activeReservation, setActiveReservation] =
    useState<ActiveReservation | null>(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showNoReviewPopup, setShowNoReviewPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showReviewDeleteSuccessPopup, setShowReviewDeleteSuccessPopup] =
    useState(false);
  const [showReviewDeleteErrorPopup, setShowReviewDeleteErrorPopup] =
    useState(false);
  const [reviewDeleteErrorMessage, setReviewDeleteErrorMessage] = useState("");
  const [showDeleteConfirmPopup, setShowDeleteConfirmPopup] = useState(false);
  const [reviewIdToDelete, setReviewIdToDelete] = useState<number | null>(null);

  const BASE_URL = import.meta.env.VITE_API_URL;
  const hasReview = reviews.length > 0;

  useEffect(() => {
    if (!id) return;

    const fetchAllData = async () => {
      const token = localStorage.getItem("token");

      try {
        const hospitalRes = await fetch(`${BASE_URL}/api/v1/hospital/${id}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!hospitalRes.ok) throw new Error("Hospital fetch failed");
        const hospitalData = await hospitalRes.json();

        const hospital = {
          id: Number(id),
          name: hospitalData.name,
          address: hospitalData.address,
          operatingStatus: hospitalData.operatingStatus,
          image: hospitalData.imageUrl,
          alt: hospitalData.description,
          hasParking: hospitalData.hasParking,
          animalTypes: hospitalData.animalTypes || [],
          departments: hospitalData.departments || [],
          breeds: hospitalData.breeds || [],
          holidays: hospitalData.holidays || [],
        };

        setHospitalInfo(hospital);
        setReviewCount(hospitalData.reviewCount || 0);
        addRecentHospitalUnified({
          id: hospital.id,
          name: hospital.name,
          address: hospital.address,
          imageUrl: hospital.image,
          operatingStatus: hospital.operatingStatus,
        }).catch(() => {});
      } catch (err) {
        console.error("Hospital info error:", err);
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const reviewRes = await fetch(
          `${BASE_URL}/api/v1/reviews/hospital/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        if (reviewRes.ok) {
          const reviewData: ReviewApiResponse[] = await reviewRes.json();

          const mappedReviews: ReviewType[] = reviewData.map((review) => ({
            id: review.reviewId,
            date: review.visitDate,
            animalType: review.username,
            department: review.department,
            revisit: review.revisitIntention ? "있음" : "없음",
            content: review.content,
            isMyReview: review.isMyReview,
          }));
          setReviews(mappedReviews);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error("Review fetch error:", err);
        setReviews([]);
      }

      if (token) {
        try {
          const resRes = await fetch(
            `${BASE_URL}/api/v1/reservations/hospital/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (resRes.ok) {
            const text = await resRes.text();
            if (text) {
              const resData = JSON.parse(text);
              setActiveReservation(resData);
            } else {
              setActiveReservation(null);
            }
          }
        } catch (err) {
          console.error("Reservation fetch error:", err);
        }
      }

      setLoading(false);
    };

    fetchAllData();
  }, [id, BASE_URL]);

  const confirmDeleteReview = async () => {
    if (!reviewIdToDelete) return;

    const token = localStorage.getItem("token");
    const reviewId = reviewIdToDelete;

    setShowDeleteConfirmPopup(false);
    setReviewIdToDelete(null);

    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/api/v1/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        setReviewCount((prev) => Math.max(0, prev - 1));
        setShowReviewDeleteSuccessPopup(true);
      } else {
        const errData = await res.json().catch(() => ({}));
        setReviewDeleteErrorMessage(
          errData.message || "리뷰 삭제에 실패했습니다."
        );
        setShowReviewDeleteErrorPopup(true);
      }
    } catch (err) {
      console.error(err);
      alert("오류가 발생했습니다.");
    }
  };

  const handleDeleteReview = (reviewId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    setReviewIdToDelete(reviewId);
    setShowDeleteConfirmPopup(true);
  };

  const handleGoReview = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/reviews/check-available?hospitalId=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const reservationId = await res.json();
        navigate(`/review/${reservationId}`);
      } else {
        setShowNoReviewPopup(true);
      }
    } catch (err) {
      console.error(err);
      alert("서버 연결 중 오류가 발생했습니다.");
    }
  };

  const handleGoReservation = () => {
    if (!hospitalInfo) return;
    navigate(`/hospital/${id}/reservation`, {
      state: { hospitalInfo },
    });
  };

  const handleCancelReservation = async () => {
    if (!activeReservation) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/reservations/${activeReservation.id}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      setActiveReservation(null);
      setShowCancelPopup(false);
      setShowSuccessPopup(true);
    } catch (err) {
      console.error(err);
      alert("예약 취소 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <LoadingPage message="로딩중..." />;
  if (error || !hospitalInfo) return <ErrorPage onRetry={() => navigate(-1)} />;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-10 bg-white">
        <Header
          label={hospitalInfo.name}
          variant="label"
          onBackClick={() => navigate("/")}
          showBackButton={true}
        />
        <HospitalInfoSection
          image={hospitalInfo.image}
          alt={hospitalInfo.alt}
          name={hospitalInfo.name}
          address={hospitalInfo.address}
          businessStatus={hospitalInfo.operatingStatus}
          distance={hospitalInfo.distance}
          hasParking={hospitalInfo.hasParking}
          breeds={hospitalInfo.breeds}
          reviewCount={reviewCount}
          departments={hospitalInfo.departments}
          showButton={true}
          buttonLabel={activeReservation ? "예약취소" : "예약하기"}
          onButtonClick={
            activeReservation
              ? () => setShowCancelPopup(true)
              : handleGoReservation
          }
        />
      </div>

      <main className="flex-1 overflow-y-auto scrollbar-hide flex justify-center">
        {hasReview ? (
          <div className="w-full">
            <Review reviews={reviews} onDelete={handleDeleteReview} />
          </div>
        ) : (
          <Button
            variant="outline"
            label="리뷰를 남겨주세요!"
            className="text-gray-6 self-center h-10 border-gray-6 flex gap-2 items-center w-82"
            icon={PencilLine}
            onClick={handleGoReview}
          />
        )}
      </main>

      <div className="sticky bottom-0 z-10 bg-white">
        {hasReview ? (
          <div className="flex flex-col items-center w-full">
            <Button
              variant="outline"
              label="리뷰를 남겨주세요!"
              className="text-gray-6 border-gray-6 flex gap-2 items-center w-82 m-6 justify-center"
              icon={PencilLine}
              onClick={handleGoReview}
            />
          </div>
        ) : (
          <div />
        )}
        <Footer />
      </div>

      <Popup
        type="confirm"
        open={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        title="예약을 취소하시겠습니까?"
        confirmLabel="예"
        cancelLabel="아니오"
        onConfirm={handleCancelReservation}
        onCancel={() => setShowCancelPopup(false)}
      />

      <Popup
        type="alert"
        open={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        title="예약취소가 완료되었습니다."
      >
        감사합니다.
      </Popup>

      <Popup
        type="confirm"
        open={showNoReviewPopup}
        onClose={() => setShowNoReviewPopup(false)}
        title="리뷰 작성은 진료 완료 후 작성 가능합니다."
        confirmLabel="예약하기"
        cancelLabel="취소"
        onConfirm={() => {
          handleGoReservation();
          setShowNoReviewPopup(false);
        }}
        onCancel={() => setShowNoReviewPopup(false)}
      />

      <Popup
        type="confirm"
        open={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        title="로그인 후 이용 가능합니다."
        confirmLabel="로그인"
        cancelLabel="취소"
        onConfirm={() => {
          navigate("/login");
          setShowLoginPopup(false);
        }}
        onCancel={() => setShowLoginPopup(false)}
      />

      <Popup
        type="confirm"
        open={showDeleteConfirmPopup}
        onClose={() => {
          setShowDeleteConfirmPopup(false);
          setReviewIdToDelete(null);
        }}
        title="리뷰를 삭제하시겠습니까?"
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={confirmDeleteReview}
        onCancel={() => {
          setShowDeleteConfirmPopup(false);
          setReviewIdToDelete(null);
        }}
      />

      <Popup
        type="alert"
        open={showReviewDeleteSuccessPopup}
        onClose={() => setShowReviewDeleteSuccessPopup(false)}
        title="리뷰 삭제 완료"
      >
        리뷰가 삭제되었습니다.
        <br />
        리뷰는 재작성할 수 있습니다.
      </Popup>

      <Popup
        type="alert"
        open={showReviewDeleteErrorPopup}
        onClose={() => setShowReviewDeleteErrorPopup(false)}
        title="리뷰 삭제 실패"
      >
        {reviewDeleteErrorMessage}
      </Popup>
    </div>
  );
}

export default Hospital;
