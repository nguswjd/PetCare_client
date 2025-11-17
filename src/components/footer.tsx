import { useNavigate } from "react-router";
import Button from "./ui/button";
import { UserRound, HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FooterProps = {
  className?: string;
};

function Footer({ className }: FooterProps) {
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

  return (
    <footer
      className={cn(
        "bg-main-1 px-8 py-4 flex w-full items-center justify-between",
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
