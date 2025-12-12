import { useState } from "react";

import Button from "./ui/button";
import { Square, SquareCheckBig } from "lucide-react";

export interface StatusUserList {}

const StatusUserList = () => {
  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    setChecked((prev) => !prev);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="icon"
        icon={checked ? SquareCheckBig : Square}
        onClick={handleToggle}
      />
    </div>
  );
};

export default StatusUserList;
