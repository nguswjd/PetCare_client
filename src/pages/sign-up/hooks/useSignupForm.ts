import { useState, useEffect } from "react";
import type { SelectOption } from "@/components/ui/selectbox";

export const useSignupForm = () => {
  const [isUser, setIsUser] = useState(true);

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    species: "",
    breed: "",
    businessName: "",
    businessNumber: "",
    licenseNumber: "",
    address: "",
    detailAddress: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    phone: "",
    businessNumber: "",
    licenseNumber: "",
  });

  const [verified, setVerified] = useState({
    username: false,
    phone: false,
    businessNumber: false,
    licenseNumber: false,
  });

  const [species, setSpecies] = useState<SelectOption[]>([]);
  const [breeds, setBreeds] = useState<SelectOption[]>([]);

  const commonValid =
    !!form.name &&
    !!form.username &&
    !!form.password &&
    !!form.passwordConfirm &&
    !!form.phone &&
    form.password === form.passwordConfirm &&
    !errors.username &&
    !errors.phone &&
    verified.username &&
    verified.phone;

  const isValid = isUser
    ? commonValid
    : commonValid &&
      !!form.businessName &&
      !!form.businessNumber &&
      !!form.address &&
      !!form.detailAddress &&
      !!form.postalCode &&
      !errors.businessNumber &&
      verified.businessNumber;

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/api/v1/auth/animal-types`);
        if (!res.ok) throw new Error("동물 종류 불러오기 실패");
        const data = await res.json();
        const arrayData = Array.isArray(data) ? data : data.types || [];
        const options: SelectOption[] = arrayData.map((item: any) => ({
          label: item.description || item.name,
          value: item.code || item.id,
        }));
        setSpecies(options);
      } catch (err) {
        console.error(err);
        setSpecies([]);
      }
    };

    fetchSpecies();
  }, []);

  useEffect(() => {
    if (!form.species) {
      setBreeds([]);
      return;
    }

    const fetchBreeds = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(
          `${API_URL}/api/v1/auth/breeds/${form.species}`
        );
        if (!res.ok) throw new Error("품종 불러오기 실패");
        const data = await res.json();
        const options: SelectOption[] = data.breeds.map((item: any) => ({
          label: item.description,
          value: item.code,
        }));
        setBreeds(options);
      } catch (err) {
        console.error(err);
        setBreeds([]);
      }
    };

    fetchBreeds();
  }, [form.species]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    if (key === "username") {
      setErrors((prev) => ({ ...prev, username: "" }));
      setVerified((prev) => ({ ...prev, username: false }));
    }

    if (key === "phone") {
      setErrors((prev) => ({ ...prev, phone: "" }));
      setVerified((prev) => ({ ...prev, phone: false }));
    }

    if (key === "businessNumber") {
      setErrors((prev) => ({ ...prev, businessNumber: "" }));
      setVerified((prev) => ({ ...prev, businessNumber: false }));
    }

    if (key === "licenseNumber") {
      setErrors((prev) => ({ ...prev, licenseNumber: "" }));
      setVerified((prev) => ({ ...prev, licenseNumber: false }));
    }

    if (key === "species") {
      setForm((prev) => ({ ...prev, breed: "" }));
    }
  };

  const resetVerification = () => {
    setVerified({
      username: false,
      phone: false,
      businessNumber: false,
      licenseNumber: false,
    });
    setErrors({
      username: "",
      phone: "",
      businessNumber: "",
      licenseNumber: "",
    });
  };

  const checkUsernameDuplicate = async () => {
    if (!form.username) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(
        `${API_URL}/api/v1/auth/check-username?username=${form.username}`
      );
      const data = await res.json();

      if (res.status === 400) {
        setErrors((prev) => ({
          ...prev,
          username: data.message || "유효하지 않은 아이디입니다.",
        }));
        setVerified((prev) => ({ ...prev, username: false }));
      } else if (res.status === 409) {
        setErrors((prev) => ({
          ...prev,
          username: data.message || "이미 사용 중인 아이디입니다.",
        }));
        setVerified((prev) => ({ ...prev, username: false }));
      } else if (res.ok) {
        setErrors((prev) => ({ ...prev, username: "" }));
        setVerified((prev) => ({ ...prev, username: true }));
      } else {
        throw new Error("중복 확인 실패");
      }
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        username: "중복 확인 중 오류가 발생했습니다.",
      }));
      setVerified((prev) => ({ ...prev, username: false }));
    }
  };

  const checkHospitalUsernameDuplicate = async () => {
    if (!form.username) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(
        `${API_URL}/api/v1/hospital/auth/check-username?username=${form.username}`
      );
      const data = await res.json();

      if (res.status === 400) {
        setErrors((prev) => ({
          ...prev,
          username: data.message || "유효하지 않은 아이디입니다.",
        }));
        setVerified((prev) => ({ ...prev, username: false }));
      } else if (res.status === 409) {
        setErrors((prev) => ({
          ...prev,
          username: data.message || "이미 사용 중인 아이디입니다.",
        }));
        setVerified((prev) => ({ ...prev, username: false }));
      } else if (res.ok) {
        setErrors((prev) => ({ ...prev, username: "" }));
        setVerified((prev) => ({ ...prev, username: true }));
      } else {
        throw new Error("중복 확인 실패");
      }
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        username: "중복 확인 중 오류가 발생했습니다.",
      }));
      setVerified((prev) => ({ ...prev, username: false }));
    }
  };

  const checkPhoneDuplicate = async () => {
    if (!form.phone) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(
        `${API_URL}/api/v1/auth/check-phone?phone=${form.phone}`
      );
      const data = await res.json();

      if (res.status === 400) {
        setErrors((prev) => ({
          ...prev,
          phone: data.message || "유효하지 않은 전화번호입니다.",
        }));
        setVerified((prev) => ({ ...prev, phone: false }));
      } else if (res.status === 409) {
        setErrors((prev) => ({
          ...prev,
          phone: data.message || "이미 등록된 번호입니다.",
        }));
        setVerified((prev) => ({ ...prev, phone: false }));
      } else if (res.ok) {
        setErrors((prev) => ({ ...prev, phone: "" }));
        setVerified((prev) => ({ ...prev, phone: true }));
      } else {
        throw new Error("중복 확인 실패");
      }
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        phone: "중복 확인 중 오류가 발생했습니다.",
      }));
      setVerified((prev) => ({ ...prev, phone: false }));
    }
  };

  const checkHospitalNumberDuplicate = async () => {
    if (!form.phone) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(
        `${API_URL}/api/v1/hospital/auth/check-hospital-number?hospitalNumber=${form.phone}`
      );
      const data = await res.json();

      if (res.status === 400) {
        setErrors((prev) => ({
          ...prev,
          phone: data.message || "유효하지 않은 병원 번호입니다.",
        }));
        setVerified((prev) => ({ ...prev, phone: false }));
      } else if (res.status === 409) {
        setErrors((prev) => ({
          ...prev,
          phone: data.message || "이미 등록된 병원 번호입니다.",
        }));
        setVerified((prev) => ({ ...prev, phone: false }));
      } else if (res.ok) {
        setErrors((prev) => ({ ...prev, phone: "" }));
        setVerified((prev) => ({ ...prev, phone: true }));
      } else {
        throw new Error("중복 확인 실패");
      }
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        phone: "중복 확인 중 오류가 발생했습니다.",
      }));
      setVerified((prev) => ({ ...prev, phone: false }));
    }
  };

  const checkBusinessNumberDuplicate = async () => {
    if (!form.businessNumber) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(
        `${API_URL}/api/v1/hospital/auth/check-business-number?businessRegistrationNumber=${form.businessNumber}`
      );
      const data = await res.json();

      if (res.status === 400) {
        setErrors((prev) => ({
          ...prev,
          businessNumber: data.message || "유효하지 않은 사업자 번호입니다.",
        }));
        setVerified((prev) => ({ ...prev, businessNumber: false }));
      } else if (res.status === 409) {
        setErrors((prev) => ({
          ...prev,
          businessNumber: data.message || "이미 등록된 사업자 번호입니다.",
        }));
        setVerified((prev) => ({ ...prev, businessNumber: false }));
      } else if (res.ok) {
        setErrors((prev) => ({ ...prev, businessNumber: "" }));
        setVerified((prev) => ({ ...prev, businessNumber: true }));
      } else {
        throw new Error("중복 확인 실패");
      }
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        businessNumber: "중복 확인 중 오류가 발생했습니다.",
      }));
      setVerified((prev) => ({ ...prev, businessNumber: false }));
    }
  };

  const setUserType = (value: boolean) => {
    setIsUser(value);
  };

  return {
    form,
    errors,
    verified,
    species,
    breeds,
    isValid,
    isUser,
    setUserType,
    handleChange,
    resetVerification,
    checkUsernameDuplicate,
    checkHospitalUsernameDuplicate,
    checkPhoneDuplicate,
    checkHospitalNumberDuplicate,
    checkBusinessNumberDuplicate,
  };
};
