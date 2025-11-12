import { useState, useEffect } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

interface UserFormProps {
  onFormChange: (isValid: boolean) => void;
}

function UserForm({ onFormChange }: UserFormProps) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    passwordConfirm: "",
    phone: "",
  });

  useEffect(() => {
    const allFilled: boolean =
      !!form.name &&
      !!form.username &&
      !!form.password &&
      !!form.passwordConfirm &&
      !!form.phone &&
      form.password === form.passwordConfirm;
    onFormChange(allFilled);
  }, [form, onFormChange]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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
          />
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
        <div className="flex gap-2">
          <Input
            placeholder="휴대폰번호"
            type="number"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          <Button
            className="w-27"
            variant="primary"
            label="중복확인"
            disabled={!form.phone}
          />
        </div>
      </div>
    </div>
  );
}

export default UserForm;
