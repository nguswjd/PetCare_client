import { useState } from "react";
import { useNavigate } from "react-router";

import Button from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Input from "@/components/ui/input";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [autoLogin, setAutoLogin] = useState(false);

  const handleSignupClick = () => {
    navigate("/signup");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLogin = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("로그인 응답:", data);

      if (!response.ok) {
        alert(data.message || "로그인 실패");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("토큰 저장 완료:", data.token);
      } else {
        console.warn("응답에 token이 없습니다!");
      }

      if (autoLogin) {
        localStorage.setItem("autoLogin", "true");
      } else {
        localStorage.removeItem("autoLogin");
      }

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("로그인 요청 오류:", error);
      alert("서버에 연결할 수 없습니다.");
    }
  };

  return (
    <div className="bg-white max-w-120 mx-auto flex flex-col h-dvh">
      <header className="mt-[10vh] w-full flex justify-center cursor-pointer z-10 relative">
        <h1 onClick={handleLogoClick}>
          <img
            src="/PetCare_logo.svg"
            className="w-30 h-30"
            alt="petcare 로고"
          />
        </h1>
      </header>

      <main className="flex flex-col items-center justify-center flex-1 gap-4 px-6 -mt-[10vh]">
        <div className="flex w-full mb-7">
          <Button className="w-full" variant="user" label="사용자" />
          <Button
            className="w-full"
            disabled={true}
            variant="user"
            label="관리자"
          />
        </div>

        <div className="w-full flex flex-col gap-4">
          <Input
            className="w-full"
            placeholder="아이디를 입력하세요."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            className="w-full"
            type="password"
            placeholder="비밀번호를 입력하세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="w-full flex justify-start">
            <Checkbox
              label="자동로그인"
              checked={autoLogin}
              onCheckedChange={(v) => setAutoLogin(v)}
            />
          </div>

          <Button className="w-full" label="로그인" onClick={handleLogin} />
        </div>
      </main>

      <footer className="flex px-6 justify-center mb-6">
        <Button
          variant="outline"
          className="w-full"
          label="회원가입"
          onClick={handleSignupClick}
        />
      </footer>
    </div>
  );
}

export default Login;
