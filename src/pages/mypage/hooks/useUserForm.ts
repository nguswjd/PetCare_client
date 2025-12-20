import { useState } from "react";
import { useNavigate } from "react-router";

interface UserFormData {
  name: string;
  username: string;
  animalType: string;
  breed: string;
  phone: string;
}

export const useUserForm = (initialData: UserFormData) => {
  const navigate = useNavigate();
  const [form, setForm] = useState<UserFormData>(initialData);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string }>({});
  const [verifiedPhone, setVerifiedPhone] = useState(false);

  const handleEdit = () => {
    setEditMode(true);
    setVerifiedPhone(false);
    setErrors({});
  };

  const checkPhoneDuplicate = async (currentPhone: string) => {
    if (!form.phone) return;

    if (form.phone === currentPhone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
      setVerifiedPhone(true);
      return;
    }

    try {
      const res = await fetch(`/api/v1/auth/check-phone?phone=${form.phone}`);
      const data = await res.json();

      if (res.status === 400 || res.status === 409) {
        setErrors((prev) => ({ ...prev, phone: data.message }));
        setVerifiedPhone(false);
      } else if (res.ok) {
        setErrors((prev) => ({ ...prev, phone: "" }));
        setVerifiedPhone(true);
      }
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        phone: "중복 확인 중 오류가 발생했습니다.",
      }));
      setVerifiedPhone(false);
    }
  };

  const handleSave = async () => {
    if (!verifiedPhone) {
      setErrors((prev) => ({
        ...prev,
        phone: "휴대폰 번호 중복확인을 해주세요.",
      }));
      return { success: false };
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return { success: false };
      }

      const res = await fetch("/api/v1/auth/me", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          phoneNumber: form.phone,
          species: form.animalType,
          breed: form.breed,
        }),
      });

      if (!res.ok) {
        let errorMessage = "정보 수정 실패";
        try {
          const data = await res.json();
          errorMessage = data.message || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      setEditMode(false);
      setErrors({});
      setVerifiedPhone(false);
      return { success: true, updatedForm: form };
    } catch (err: any) {
      console.error(err);
      alert(err.message || "정보 수정 중 오류가 발생했습니다.");
      return { success: false };
    }
  };

  const updateField = (field: keyof UserFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = (data: UserFormData) => {
    setForm(data);
    setEditMode(false);
    setErrors({});
    setVerifiedPhone(false);
  };

  return {
    form,
    editMode,
    errors,
    verifiedPhone,
    handleEdit,
    checkPhoneDuplicate,
    handleSave,
    updateField,
    resetForm,
  };
};
