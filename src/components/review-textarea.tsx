import React, { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ReviewTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const ReviewTextarea = forwardRef<HTMLTextAreaElement, ReviewTextareaProps>(
  ({ className, ...props }, ref) => {
    const [value, setValue] = useState("");

    return (
      <div className="px-6 py-4 flex text-sm flex-col border-t border-b border-gray-3">
        <p className="text-right px-6 py-2">{value.length} / 300</p>
        <div className="relative">
          <textarea
            {...props}
            className={cn(
              "w-full px-6 py-4 text-sm resize-none text-left relative z-10 bg-transparent focus:outline-none",
              className
            )}
            ref={ref}
            rows={4}
            value={value}
            onChange={(e) => {
              const newValue = e.target.value.slice(0, 300);
              setValue(newValue);
            }}
          />
          {!value && (
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-6 pointer-events-none text-center">
              리뷰를 입력해주세요.
            </span>
          )}
        </div>
      </div>
    );
  }
);

export default ReviewTextarea;
