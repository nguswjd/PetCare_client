import Input from "../components/ui/input";
import { useNavigate } from "react-router";

import { ChevronLeft } from "lucide-react";

function Search() {
  const navigate = useNavigate();

  return (
    <div className="bg-white flex flex-col h-dvh">
      <header>
        <Input
          leftIcon={ChevronLeft}
          placeholder="검색어를 입력해주세요."
          variant="Search"
          className="m-4"
          onLeftIconClick={() => navigate(-1)}
        />
      </header>
    </div>
  );
}

export default Search;
