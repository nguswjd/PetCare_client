import { useState } from "react";

export interface HospitalSignupForm {
  representativeName: string;
  username: string;
  password: string;
  passwordConfirm: string;
  name: string;
  hospitalNumber: string;
  businessRegistrationNumber: string;
  address: string;
  detailAddress?: string;
  postalCode?: string;
  hasParking: boolean;
  departments: string[];
  animalTypes: string[];
  breeds: string[];
  holidays: string[];
  operatingHours: string[];
  imageUrl?: string;
  description?: string;
}

export function useHospitalSignupForm() {
  const [form, setForm] = useState<HospitalSignupForm>({
    representativeName: "",
    username: "",
    password: "",
    passwordConfirm: "",
    name: "",
    hospitalNumber: "",
    businessRegistrationNumber: "",
    address: "",
    detailAddress: "",
    postalCode: "",
    hasParking: false,
    departments: [],
    animalTypes: [],
    breeds: [],
    holidays: [],
    operatingHours: [],
    imageUrl: "",
    description: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof HospitalSignupForm, string>>
  >({});
  const [verified, setVerified] = useState({
    username: false,
    hospitalNumber: false,
    businessRegistrationNumber: false,
  });

  const handleChange = (field: keyof HospitalSignupForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (field === "username")
      setVerified((prev) => ({ ...prev, username: false }));
    if (field === "hospitalNumber")
      setVerified((prev) => ({ ...prev, hospitalNumber: false }));
    if (field === "businessRegistrationNumber")
      setVerified((prev) => ({ ...prev, businessRegistrationNumber: false }));
  };

  const checkUsernameDuplicate = async () => {
    try {
      const response = await fetch(
        `/api/v1/hospital/auth/check-username?username=${form.username}`
      );
      const data = await response.json();

      if (data.available) {
        setVerified((prev) => ({ ...prev, username: true }));
        setErrors((prev) => ({ ...prev, username: undefined }));
      } else {
        setErrors((prev) => ({
          ...prev,
          username: "이미 사용 중인 아이디입니다.",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, username: "중복 확인에 실패했습니다." }));
    }
  };

  const checkHospitalNumberDuplicate = async () => {
    try {
      const response = await fetch(
        `/api/v1/hospital/auth/check-hospital-number?hospitalNumber=${form.hospitalNumber}`
      );
      const data = await response.json();

      if (data.available) {
        setVerified((prev) => ({ ...prev, hospitalNumber: true }));
        setErrors((prev) => ({ ...prev, hospitalNumber: undefined }));
      } else {
        setErrors((prev) => ({
          ...prev,
          hospitalNumber: "이미 등록된 병원 번호입니다.",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        hospitalNumber: "중복 확인에 실패했습니다.",
      }));
    }
  };

  const checkBusinessNumberDuplicate = async () => {
    try {
      const response = await fetch(
        `/api/v1/hospital/auth/check-business-number?businessRegistrationNumber=${form.businessRegistrationNumber}`
      );
      const data = await response.json();

      if (data.available) {
        setVerified((prev) => ({ ...prev, businessRegistrationNumber: true }));
        setErrors((prev) => ({
          ...prev,
          businessRegistrationNumber: undefined,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          businessRegistrationNumber: "이미 등록된 사업자 번호입니다.",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        businessRegistrationNumber: "중복 확인에 실패했습니다.",
      }));
    }
  };

  const signup = async () => {
    try {
      const response = await fetch("/api/v1/hospital/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          representativeName: form.representativeName,
          username: form.username,
          password: form.password,
          name: form.name,
          hospitalNumber: form.hospitalNumber,
          businessRegistrationNumber: form.businessRegistrationNumber,
          address: form.address,
          hasParking: form.hasParking,
          departments: form.departments,
          animalTypes: form.animalTypes,
          breeds: form.breeds,
          holidays: form.holidays,
          operatingHours: form.operatingHours,
          imageUrl: form.imageUrl,
          description: form.description,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("회원가입 실패:", error);
      throw error;
    }
  };

  return {
    form,
    errors,
    verified,
    handleChange,
    checkUsernameDuplicate,
    checkHospitalNumberDuplicate,
    checkBusinessNumberDuplicate,
    signup,
  };
}
