import { useState, useEffect } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { SelectBox } from "@/components/ui/selectbox";
import type { SelectOption } from "@/components/ui/selectbox";

interface UserFormProps {
  onFormChange: (isValid: boolean, formData: any) => void;
}

function UserForm({ onFormChange }: UserFormProps) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    animalType: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    phone: "",
  });

  const [verified, setVerified] = useState({
    username: false,
    phone: false,
  });

  useEffect(() => {
    const allFilled: boolean =
      !!form.name &&
      !!form.username &&
      !!form.password &&
      !!form.passwordConfirm &&
      !!form.phone &&
      !!form.animalType &&
      form.password === form.passwordConfirm &&
      !errors.username &&
      !errors.phone &&
      verified.username &&
      verified.phone;
    onFormChange(allFilled, form);
  }, [form, errors, verified, onFormChange]);

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

  const animaltypes: SelectOption[] = [
    { label: "육지동물", value: "TERRESTRIAL" },
    { label: "수생동물", value: "AQUATIC" },
    { label: "조류", value: "AVIAN" },
    { label: "기타", value: "OTHER" },
  ];

  return (
    <div className="w-full flex flex-col">
      <div className="flex w-full mb-7">
        <Button className="w-full" variant="user" label="사용자" />
        <Button className="w-full" disabled variant="user" label="관리자" />
      </div>

      <div className="flex flex-col gap-3">
        <Input
          placeholder="이름"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <Input
              placeholder="아이디"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
            <Button
              className="w-27"
              variant="primary"
              label="중복확인"
              disabled={!form.username}
              onClick={checkUsernameDuplicate}
            />
          </div>
          {errors.username && (
            <span className="text-red ml-2 text-xs">{errors.username}</span>
          )}
          {verified.username && !errors.username && (
            <span className="text-blue-2 ml-2 text-xs">
              사용 가능한 아이디입니다.
            </span>
          )}
        </div>

        <Input
          placeholder="비밀번호"
          type="password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />
        <Input
          placeholder="비밀번호 확인"
          type="password"
          value={form.passwordConfirm}
          onChange={(e) => handleChange("passwordConfirm", e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <Input
              placeholder="휴대폰번호"
              type="text"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <Button
              className="w-27"
              variant="primary"
              label="중복확인"
              disabled={!form.phone}
              onClick={checkPhoneDuplicate}
            />
          </div>
          {errors.phone && (
            <span className="text-red ml-2 text-xs">{errors.phone}</span>
          )}
          {verified.phone && !errors.phone && (
            <span className="text-blue-2 ml-2 text-xs">
              사용 가능한 번호입니다.
            </span>
          )}
        </div>

        <div className="flex w-full gap-2">
          <SelectBox
            placeholder="종류"
            options={animaltypes}
            onChange={(value) => handleChange("animalType", value)}
          />
          <SelectBox
            placeholder="품종"
            options={animaltypes}
            onChange={(value) => handleChange("animalType", value)}
          />
        </div>
      </div>
    </div>
  );
}

export default UserForm;
