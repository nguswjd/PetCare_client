import { useState } from "react";
import { useNavigate } from "react-router";

import Header from "@/components/header";
import Button from "@/components/ui/button";
import Popup from "@/components/popup";

function HospitalMainPage() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [alertPopup, setAlertPopup] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });
  const [passwordError, setPasswordError] = useState(false);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/api/v1/hospital/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "로그아웃 실패");
      }

      localStorage.removeItem("token");
      setAlertPopup({ open: true, message: "로그아웃 되었습니다." });
    } catch (err: any) {
      setAlertPopup({ open: true, message: err.message || "로그아웃 실패" });
    }
  };

  return (
    <div className="h-dvh flex flex-col">
      <Header label="병원 관리 페이지" showBackButton={false} />

      <main className="px-6 py-4 flex flex-col flex-1 overflow-auto">
        <div>
          <p className="text-gray-6">main</p>
        </div>
      </main>

      <div className="flex w-full py-2 px-6 gap-1">
        <Button
          className="w-full bg-main-2"
          label="회원탈퇴"
          onClick={() => {
            setShowPopup(true);
            setPasswordError(false);
          }}
        />
        <Button className="w-full" label="로그아웃" onClick={handleLogout} />
      </div>

      {showPopup && (
        <Popup
          open={showPopup}
          type="form"
          title="탈퇴를 진행하시겠습니까?"
          placeholder="비밀번호를 입력해주세요."
          confirmLabel="탈퇴"
          cancelLabel="취소"
          onConfirm={async (password) => {
            if (!password) {
              setPasswordError(true);
              return;
            }

            try {
              const token = localStorage.getItem("token");
              const API_URL = import.meta.env.VITE_API_URL;

              const res = await fetch(
                `${API_URL}/api/v1/hospital/auth/withdraw`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({ password }),
                }
              );

              if (!res.ok) {
                const errorData = await res.json();
                if (res.status === 401 || res.status === 400) {
                  setPasswordError(true);
                  return;
                }
                throw new Error(errorData.message || "회원탈퇴 실패");
              }

              localStorage.removeItem("token");
              setShowPopup(false);
              navigate("/");
            } catch (err: any) {
              setShowPopup(false);
              setAlertPopup({
                open: true,
                message: err.message || "회원탈퇴 실패",
              });
            }
          }}
          onCancel={() => setShowPopup(false)}
          onClose={() => setShowPopup(false)}
          error={passwordError}
          errorMessage="비밀번호가 일치하지 않습니다."
        />
      )}

      {alertPopup.open && (
        <Popup
          open={alertPopup.open}
          type="alert"
          children={`이용해주셔서 감사합니다.\n안녕히가세요.`}
          title={alertPopup.message}
          onClose={() => {
            setAlertPopup({ open: false, message: "" });
            navigate("/");
          }}
        />
      )}

      <footer className="flex mb-4 justify-between px-6 py-2 border-y border-gray-3">
        <div className="flex flex-col">
          <p className="font-semibold text-base">PET CARE 문의하기</p>
          <a href="mailto:nguswjd02@ajou.ac.kr" className="text-gray-6 text-xs">
            nguswjd02@ajou.ac.kr
          </a>
        </div>
        <img src="/PetCare_logo.svg" className="w-10 h-10" alt="petcare 로고" />
      </footer>
    </div>
  );
}

export default HospitalMainPage;
