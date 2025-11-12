import { useNavigate } from "react-router";
import Button from "./ui/button";
import { UserRound, HomeIcon } from "lucide-react";

function Footer() {
  const navigate = useNavigate();
  const isLoggedIn = false;

  const handleUserClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      console.log("로그인 상태입니다.");
    }
  };

  return (
    <footer className="bg-main-1 px-8 py-4 flex w-full items-center justify-between">
      <Button
        variant="icon"
        icon={UserRound}
        className="text-white"
        onClick={handleUserClick}
      />
      <Button variant="icon" icon={HomeIcon} className="text-white" />
    </footer>
  );
}

export default Footer;
