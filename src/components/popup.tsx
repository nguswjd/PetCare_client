import * as React from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";
import Input from "./ui/input";
import { X } from "lucide-react";

type PopupType = "confirm" | "form" | "alert";

interface PopupProps {
  type?: PopupType;
  open: boolean;
  onClose: () => void;
  title?: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: (value?: string) => void | Promise<void>;
  onCancel?: () => void;
  alertLabel?: string;
  onAcknowledge?: () => void;
  children?: React.ReactNode;
  className?: string;
  error?: boolean;
  errorMessage?: string;
}

export default function Popup({
  type = "confirm",
  open,
  onClose,
  title,
  confirmLabel = "예",
  cancelLabel = "아니오",
  placeholder,
  onConfirm,
  onCancel,
  children,
  className,
  error = false,
  errorMessage = "",
}: PopupProps) {
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  React.useEffect(() => {
    if (error) {
      setInputValue("");
    }
  }, [error]);

  if (!open) return null;

  const baseOverlayClass =
    "w-screen h-dvh fixed inset-0 bg-black-30 flex items-center justify-center z-50";
  const baseBoxClass =
    "bg-white relative p-6 rounded-md flex flex-col gap-4 w-80";

  return (
    <div className={cn(baseOverlayClass, className)}>
      <div className={baseBoxClass}>
        {title && <p className="text-center font-bold text-base">{title}</p>}

        {type === "confirm" && (
          <div className="flex justify-center gap-4">
            <Button
              variant="primary"
              className="w-21 bg-white text-black"
              label={confirmLabel}
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
            />
            <Button
              variant="primary"
              className="w-21"
              label={cancelLabel}
              onClick={() => {
                onCancel?.();
                onClose();
              }}
            />
          </div>
        )}

        {type === "form" && (
          <>
            <Input
              type="password"
              placeholder={error ? errorMessage : placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={cn(error && "border-red placeholder:text-red")}
            />
            <div className="flex justify-center gap-4">
              <Button
                variant="primary"
                className="w-20 bg-white text-black"
                label={confirmLabel}
                onClick={() => {
                  onConfirm?.(inputValue);
                }}
              />

              <Button
                variant="primary"
                className="w-20"
                label={cancelLabel}
                onClick={() => {
                  onCancel?.();
                  onClose();
                }}
              />
            </div>
          </>
        )}

        {type === "alert" && (
          <>
            <Button
              variant="icon"
              icon={X}
              className="absolute top-0 right-0 m-2"
              onClick={onClose}
            />
            <p className="text-base font-normal whitespace-pre-line">
              {children}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
