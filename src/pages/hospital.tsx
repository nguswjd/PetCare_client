import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import LoadingPage from "../components/loading";
import ErrorPage from "@/components/error";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Review from "@/components/review";
import Button from "@/components/ui/button";
import Popup from "@/components/popup";
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

interface ReviewType {
  date: string;
  animalType: string;
  department: string;
  revisit: string;
  content: string;
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
];

function Hospital() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasReview] = useState(true);

  const [activeReservation, setActiveReservation] =
    useState<ActiveReservation | null>(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/api/v1/hospital/${id}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(async (data) => {
        const hospital = {
          id: Number(id),
          name: data.name,
          address: data.address,
          operatingStatus: data.operatingStatus,
          image: data.imageUrl,
          alt: data.description,
          hasParking: data.hasParking,
          animalTypes: data.animalTypes || [],
          departments: data.departments || [],
          breeds: data.breeds || [],
          holidays: data.holidays || [],
        };

        setHospitalInfo(hospital);

        await addRecentHospitalUnified({
          id: hospital.id,
          name: hospital.name,
          address: hospital.address,
          imageUrl: hospital.image,
          operatingStatus: hospital.operatingStatus,
        });

        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });

    if (token) {
      fetch(`${BASE_URL}/api/v1/reservations/hospital/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((data) => {
          setActiveReservation(data);
        })
        .catch(() => {
          setActiveReservation(null);
        });
    }
  }, [id, BASE_URL]);

  const handleGoReview = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
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
        const errData = await res.json();
        alert(errData.message || "리뷰를 작성할 수 있는 진료 내역이 없습니다.");
      }
    } catch (err) {
      console.error("리뷰 가능 여부 확인 실패:", err);
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
      alert("로그인이 필요합니다.");
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
        throw new Error("예약 취소에 실패했습니다.");
      }

      setActiveReservation(null);
      setShowCancelPopup(false);
      setShowSuccessPopup(true);
    } catch (err) {
      console.error("예약 취소 에러:", err);
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
          showBackButton={true}
        />
        <div>
          <img
            src={hospitalInfo.image}
            alt={hospitalInfo.alt || "병원 이미지"}
            className="w-full min-h-40 h-[15vh] max-h-60 bg-gray-4 object-cover"
          />
          <section className="flex justify-between mt-4 mx-4 pb-4 border-b border-b-gray-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-xl">{hospitalInfo.name}</h3>
                <p className="flex gap-2 text-gray-6 font-medium text-sm">
                  {hospitalInfo.address.split(" ").slice(1, 3).join(" ")}
                </p>
              </div>
              <div className="flex gap-2 text-gray-6 font-medium text-sm">
                <p>{hospitalInfo.operatingStatus}</p>
                {hospitalInfo.distance && <p>{hospitalInfo.distance}</p>}
              </div>
            </div>
            {activeReservation ? (
              <Button
                label="예약취소"
                onClick={() => setShowCancelPopup(true)}
              />
            ) : (
              <Button label="예약하기" onClick={handleGoReservation} />
            )}
          </section>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto scrollbar-hide flex items-center justify-center">
        {hasReview ? (
          <div className="w-full">
            <Review reviews={reviews} />
          </div>
        ) : (
          <Button
            variant="outline"
            label="리뷰를 남겨주세요!"
            className="text-gray-6 border-gray-6 flex gap-2 items-center w-82"
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
    </div>
  );
}

export default Hospital;
