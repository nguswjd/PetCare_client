import Button from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Input from "@/components/ui/input";

function Login() {
  return (
    <div className="bg-white max-w-120 mx-auto flex flex-col h-dvh">
      <header className="mt-[15vh] w-full flex justify-center">
        <h1>
          <img src="/PetCare_logo.svg" className="w-30 h-30" alt="설명" />
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
          <Input className="w-full" placeholder="아이디를 입력하세요." />
          <Input className="w-full" placeholder="비밀번호를 입력하세요." />
          <div className="w-full flex justify-start">
            <Checkbox label="자동로그인" />
          </div>
          <Button className="w-full" label="로그인" />
        </div>
      </main>
      <footer className="flex px-6 justify-center mb-6">
        <Button variant="outline" className="w-full" label="회원가입" />
      </footer>
    </div>
  );
}

export default Login;
