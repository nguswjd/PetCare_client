import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

interface UserInfo {
  name: string;
  username: string;
  animalType: string;
  breed: string;
  phone: string;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    username: "",
    animalType: "",
    breed: "",
    phone: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetchUserInfo(token);
  }, [navigate]);

  const fetchUserInfo = async (token: string) => {
    try {
      const res = await fetch("/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }
        throw new Error("유저 정보 불러오기 실패");
      }

      const data = await res.json();

      setUserInfo({
        name: data.name,
        username: data.username,
        animalType: data.species,
        breed: data.breed,
        phone: data.phoneNumber,
      });

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/v1/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "로그아웃 실패");
      }

      localStorage.clear();
      return { success: true, message: "로그아웃 되었습니다." };
    } catch (err: any) {
      return { success: false, message: err.message || "로그아웃 실패" };
    }
  };

  const withdraw = async (password: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/v1/auth/withdraw", {
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

  const updateUserInfo = (updatedInfo: Partial<UserInfo>) => {
    setUserInfo((prev) => ({ ...prev, ...updatedInfo }));
  };

  return {
    isLoading,
    userInfo,
    logout,
    withdraw,
    updateUserInfo,
  };
};
