import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

import LoadingPage from "@/components/loading";
import Header from "@/components/header";
import Popup from "@/components/popup";

import { SelectBox } from "@/components/ui/selectbox";
import Button from "@/components/ui/button";
import Field from "@/components/ui/field";
import ReviewTextarea from "@/components/ui/review-textarea";
import { Radio } from "@/components/ui/radio";

interface ReviewFormData {
  reservationId: number;
  hospitalName: string;
  hospitalAddress: string;
  visitDate: string;
  animalType: string;
  breed: string;
  department: string;
}

interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  shouldGoBack: boolean;
}

function Review() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ReviewFormData | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [visitIntent, setVisitIntent] = useState("yes");
  const [content, setContent] = useState("");

  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    title: "",
    message: "",
    shouldGoBack: false,
  });

  const BASE_URL = import.meta.env.VITE_API_URL || "";
  const isValid = content.length >= 10;

  const openAlert = (
    title: string,
    message: string,
    shouldGoBack: boolean = false
  ) => {
    setAlertState({
      isOpen: true,
      title,
      message,
      shouldGoBack,
    });
  };

  const closeAlert = () => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
    if (alertState.shouldGoBack) {
      navigate(-1);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchReviewForm = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/v1/reviews/form/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          openAlert(
            "알림",
            errData.message || "정보를 불러올 수 없습니다.",
            true
          );
          return;
        }

        const data = await res.json();
        setFormData(data);
        setSelectedDepartment(data.department);
      } catch (err) {
        console.error("리뷰 폼 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewForm();
  }, [id, BASE_URL]);

  const departmentOptions = [
    { value: "VACCINATION", label: "예방접종" },
    { value: "INTERNAL_SURGERY", label: "내과/외과" },
    { value: "DENT_SKIN_EYE", label: "치과/피부과/안과" },
    { value: "NEUTERING", label: "중성화수술" },
    { value: "CHECKUP", label: "건강검진" },
    { value: "EMERGENCY", label: "응급진료" },
    { value: "ORTHO_NEURO_CENTER", label: "정형외과/신경과/중앙클리닉" },
    { value: "OTHER", label: "기타" },
  ];

  const handleSubmit = async () => {
    if (!isValid) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/v1/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reservationId: Number(id),
          department: selectedDepartment,
          content: content,
          revisitIntention: visitIntent,
        }),
      });

      if (res.ok) {
        openAlert(
          "리뷰 등록에 성공했습니다.",
          "병원 페이지에서 등록한 리뷰를 확인하세요!",
          true
        );
      } else {
        const errData = await res.json();
        openAlert("등록 실패", errData.message || "리뷰 등록에 실패했습니다.");
      }
    } catch (err) {
      console.error("리뷰 등록 에러:", err);
      openAlert("오류", "예기치 못한 오류가 발생했습니다.");
    }
  };

  if (loading || !formData) {
    return <LoadingPage message="예약 정보를 확인 중입니다..." />;
  }

  return (
    <div className="flex flex-col h-dvh">
      <Header label="리뷰 등록하기" variant="label" showBackButton={true} />

      <div className="flex-1 flex flex-col lg:flex-row lg:max-w-7xl lg:mx-auto lg:w-full lg:overflow-hidden">
        <div className="flex flex-col lg:w-1/2 lg:h-full lg:overflow-y-auto">
          <div className="p-4 border-b border-t border-b-gray-3 border-t-gray-3 lg:border-none lg:p-6 lg:pb-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-xl">{formData.hospitalName}</h3>
              <p className="flex gap-2 text-gray-6 font-medium text-sm">
                {formData.hospitalAddress.split(" ").slice(0, 3).join(" ")}
              </p>
            </div>
          </div>

          <div className="px-6 py-4 flex flex-col gap-4">
            <Field label="방문날짜" placeholder={formData.visitDate} />
            <Field label="진료대상 동물" placeholder={formData.animalType} />
            <Field label="품종" placeholder={formData.breed} />

            <SelectBox
              label="진료항목"
              placeholder="진료 항목을 선택해주세요."
              options={departmentOptions}
              value={selectedDepartment}
              onChange={(value) => setSelectedDepartment(value)}
            />

            <div className="flex flex-col gap-1 mb-4">
              <h3 className="text-sm font-medium text-black">재방문 의사</h3>
              <Radio
                value={visitIntent}
                onChange={setVisitIntent}
                options={[
                  { value: "yes", label: "있음" },
                  { value: "no", label: "없음" },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 py-4 flex flex-col gap-4 lg:w-1/2 lg:h-full lg:p-6 lg:bg-gray-50/30">
          <div className="flex-1 flex flex-col h-full">
            <ReviewTextarea
              value={content}
              onChange={(e: any) => setContent(e.target.value)}
            />
          </div>

          <div className="hidden lg:block mt-4">
            <Button
              variant="primary"
              className="w-full"
              label="등록하기"
              onClick={handleSubmit}
              disabled={!isValid}
            />
          </div>
        </div>
      </div>

      <footer className="px-6 py-4 lg:hidden mt-auto border-t border-gray-100">
        <Button
          variant="primary"
          className="w-full"
          label="등록하기"
          onClick={handleSubmit}
          disabled={!isValid}
        />
      </footer>

      <Popup
        type="alert"
        open={alertState.isOpen}
        onClose={closeAlert}
        title={alertState.title}
      >
        {alertState.message}
      </Popup>
    </div>
  );
}

export default Review;
