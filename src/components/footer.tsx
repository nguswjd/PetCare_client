import { UserRound, HomeIcon } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-main-1 px-8 py-4 flex w-full items-center justify-between">
      <UserRound className="w-6 h-6 text-white" />
      <HomeIcon className="w-6 h-6 text-white" />
    </footer>
  );
}

export default Footer;
