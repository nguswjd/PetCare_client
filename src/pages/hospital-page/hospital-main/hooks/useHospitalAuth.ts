import { useState } from "react";

export const useHospitalAuth = () => {
  const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    return { success: true, message: "로그아웃 되었습니다." };
  };

  const withdraw = async (password: string | undefined) => {
    if (!password) {
      setPasswordError(true);
      return { success: false, invalidPassword: true };
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/v1/hospital/auth/withdraw", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 401 || res.status === 400) {
          setPasswordError(true);
          return { success: false, invalidPassword: true };
        }
        throw new Error(errorData.message || "회원탈퇴 실패");
      }

      localStorage.removeItem("token");
      return { success: true, invalidPassword: false };
    } catch (err: any) {
      return {
        success: false,
        invalidPassword: false,
        message: err.message || "회원탈퇴 실패",
      };
    }
  };

  return {
    showWithdrawPopup,
    setShowWithdrawPopup,
    passwordError,
    setPasswordError,
    logout,
    withdraw,
  };
};
