import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ReviewTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string;
}

const ReviewTextarea = forwardRef<HTMLTextAreaElement, ReviewTextareaProps>(
  ({ className, value = "", onChange, ...props }, ref) => {
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
            onChange={onChange}
            maxLength={300}
          />
          {!value && (
            <span className="absolute top-4 left-6 text-gray-5 pointer-events-none">
              {props.placeholder || "진료 후기를 남겨주세요 (최소 10자)."}
            </span>
          )}
        </div>
      </div>
    );
  }
);

export default ReviewTextarea;
