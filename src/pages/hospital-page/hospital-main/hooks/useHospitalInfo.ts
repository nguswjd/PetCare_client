import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export interface HospitalData {
  name: string;
  address: string;
  representativeName: string;
  hospitalNumber: string;
  businessRegistrationNumber: string;
  imageUrl: string | null;
  hasParking: boolean;
  departments: string[];
  animalTypes: string[];
  breeds: string[];
  holidays: string[];
  operatingStartTime: string | null;
  operatingEndTime: string | null;
  is24Hours: boolean;
  breakTimes: string[];
}

export const useHospitalInfo = () => {
  const navigate = useNavigate();
  const [hospitalData, setHospitalData] = useState<HospitalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    fetchHospitalData();
  }, [navigate]);

  const fetchHospitalData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const hospitalRes = await fetch("/api/v1/hospital/auth/me", {
        headers,
      });

      if (!hospitalRes.ok) throw new Error("병원 정보를 불러올 수 없습니다.");

      const data = await hospitalRes.json();
      setHospitalData(data);
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || "정보를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    if (!formData) {
      return { success: false, message: "변경된 내용이 없습니다." };
    }

    try {
      const token = localStorage.getItem("token");
      const form = new FormData();

      if (hospitalData) {
        form.append("representativeName", hospitalData.representativeName);
        form.append("name", hospitalData.name);
        form.append("hospitalNumber", hospitalData.hospitalNumber);
        form.append("address", hospitalData.address);
      }

      form.append("hasParking", JSON.stringify(formData.hasParking));
      form.append("departments", JSON.stringify(formData.departments));
      form.append("animalTypes", JSON.stringify(formData.animalTypes));
      form.append("breeds", JSON.stringify(formData.breeds));
      form.append("holidays", JSON.stringify(formData.holidays));

      if (formData.operatingStartTime)
        form.append("operatingStartTime", formData.operatingStartTime);
      if (formData.operatingEndTime)
        form.append("operatingEndTime", formData.operatingEndTime);

      form.append("breakTimes", JSON.stringify(formData.breakTimes));

      if (formData.imageFile) {
        form.append("imageFile", formData.imageFile);
      }

      const res = await fetch("/api/v1/hospital/auth/update-details", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "수정 실패");
      }

      const updatedData = await res.json();
      setHospitalData(updatedData);
      setEditMode(false);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "정보 수정에 실패했습니다.",
      };
    }
  };

  return {
    hospitalData,
    loading,
    editMode,
    formData,
    setFormData,
    handleEdit,
    handleSave,
  };
};
