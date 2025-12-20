import { useNavigate } from "react-router";
import Button from "./ui/button";
import { UserRound, HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FooterProps = {
  className?: string;
  variant?: "default" | "hospital";
};

function Footer({ className, variant = "default" }: FooterProps) {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleUserClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/mypage");
    }
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  if (variant === "hospital") {
    return (
      <footer
        className={cn(
          "flex mb-4 justify-between px-6 py-2 border-y border-gray-3",
          className
        )}
      >
        <div className="flex flex-col">
          <p className="font-semibold text-base">PET CARE 문의하기</p>
          <a href="mailto:nguswjd02@ajou.ac.kr" className="text-gray-6 text-xs">
            nguswjd02@ajou.ac.kr
          </a>
        </div>
        <img src="/PetCare_logo.svg" className="w-10 h-10" alt="petcare 로고" />
      </footer>
    );
  }

  return (
    <footer
      className={cn(
        "bg-main-1 px-8 py-4 flex w-full items-center justify-between pb-6",
        className
      )}
    >
      <Button
        variant="icon"
        icon={UserRound}
        className="text-white"
        onClick={handleUserClick}
      />
      <Button
        variant="icon"
        icon={HomeIcon}
        className="text-white"
        onClick={handleHomeClick}
      />
    </footer>
  );
}

export default Footer;
