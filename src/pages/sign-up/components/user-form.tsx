import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { SelectBox } from "@/components/ui/selectbox";
import { useSignupForm } from "../hooks/useSignupForm";
import { useState } from "react";

interface UserFormProps {
  signupForm: ReturnType<typeof useSignupForm>;
}

function UserForm({ signupForm }: UserFormProps) {
  const [isUser, setIsUser] = useState(true);

  return (
    <div className="w-full flex flex-col">
      <div>
        <Button
          variant="user"
          className="w-[50%]"
          active={isUser}
          onClick={() => setIsUser(true)}
          label="사용자"
        />
        <Button
          variant="user"
          className="w-[50%]"
          active={!isUser}
          onClick={() => setIsUser(false)}
          label="관리자"
        />
      </div>

      <div className="flex flex-col gap-3 py-5">
        <Input
          placeholder="이름"
          value={signupForm.form.name}
          onChange={(e) => signupForm.handleChange("name", e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <Input
              placeholder="아이디"
              value={signupForm.form.username}
              onChange={(e) =>
                signupForm.handleChange("username", e.target.value)
              }
            />
            <Button
              className="w-27"
              variant="primary"
              label="중복확인"
              disabled={!signupForm.form.username}
              onClick={signupForm.checkUsernameDuplicate}
            />
          </div>
          {signupForm.errors.username && (
            <span className="text-red ml-2 text-xs">
              {signupForm.errors.username}
            </span>
          )}
          {signupForm.verified.username && !signupForm.errors.username && (
            <span className="text-blue-2 ml-2 text-xs">
              사용 가능한 아이디입니다.
            </span>
          )}
        </div>

        <Input
          placeholder="비밀번호"
          type="password"
          value={signupForm.form.password}
          onChange={(e) => signupForm.handleChange("password", e.target.value)}
        />
        <Input
          placeholder="비밀번호 확인"
          type="password"
          value={signupForm.form.passwordConfirm}
          onChange={(e) =>
            signupForm.handleChange("passwordConfirm", e.target.value)
          }
        />

        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <Input
              placeholder="휴대폰번호"
              type="number"
              value={signupForm.form.phone}
              onChange={(e) => signupForm.handleChange("phone", e.target.value)}
            />
            <Button
              className="w-27"
              variant="primary"
              label="중복확인"
              disabled={!signupForm.form.phone}
              onClick={signupForm.checkPhoneDuplicate}
            />
          </div>
          {signupForm.errors.phone && (
            <span className="text-red ml-2 text-xs">
              {signupForm.errors.phone}
            </span>
          )}
          {signupForm.verified.phone && !signupForm.errors.phone && (
            <span className="text-blue-2 ml-2 text-xs">
              사용 가능한 번호입니다.
            </span>
          )}
        </div>

        <div className="flex w-full gap-2">
          <SelectBox
            placeholder="종류"
            options={signupForm.species}
            onChange={(value) => signupForm.handleChange("species", value)}
            value={signupForm.form.species}
          />
          <SelectBox
            placeholder="품종"
            options={signupForm.breeds}
            onChange={(value) => signupForm.handleChange("breed", value)}
            value={signupForm.form.breed || ""}
            disabled={
              !signupForm.form.species || signupForm.breeds.length === 0
            }
          />
        </div>
      </div>
    </div>
  );
}

export default UserForm;
