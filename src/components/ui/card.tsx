import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const imageVariants = cva("", {
  variants: {
    size: {
      sm: "h-19 w-41",
      md: "h-40 w-41",
      lg: "h-40 md:h-50 w-full",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const cardVariants = cva("rounded-md w-full overflow-hidden", {
  variants: {
    variant: {
      primary: "",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

interface CardProps
  extends VariantProps<typeof imageVariants>,
    VariantProps<typeof cardVariants> {
  className?: string;
  image: string;
  alt?: string;
  name?: string;
  address?: string;
  animalType?: string;
  content?: string;
  businessStatus?: string;
  distance?: string;
  onClick?: () => void;
}

const Card = ({
  size,
  image,
  alt,
  name,
  address,
  animalType,
  content,
  businessStatus,
  distance,
  onClick,
  className,
}: CardProps) => {
  return (
    <div className={cn("flex flex-col gap-2", className)} onClick={onClick}>
      <img
        src={image}
        alt={alt || "card image"}
        className={cn(
          imageVariants({ size }),
          "object-cover rounded-md bg-gray-4"
        )}
      />
      {(name ||
        address ||
        animalType ||
        content ||
        businessStatus ||
        distance) && (
        <div
          className={cn(
            "flex flex-col gap-0.5",
            size === "lg" ? "w-full" : "w-42"
          )}
        >
          <div
            className={cn(
              "grid items-center",
              animalType
                ? "grid-cols-[1fr_auto]"
                : size === "lg"
                ? "grid-cols-[auto_1fr]"
                : "grid-cols-2"
            )}
          >
            {name && (
              <p
                className={cn(
                  "text-md font-semibold text-black mr-2",
                  size === "lg" ? "w-auto" : "w-20 truncate"
                )}
              >
                {name}
              </p>
            )}
            {(animalType || address) && (
              <p
                className={cn(
                  "text-sm font-normal text-gray-6 truncate",
                  animalType ? "w-auto" : ""
                )}
              >
                {animalType || address}
              </p>
            )}
          </div>
          {size === "sm" ? (
            content && (
              <p className="font-medium text-sm text-gray-6 truncate">
                {content}
              </p>
            )
          ) : (
            <div className="grid grid-cols-2">
              {businessStatus && (
                <p className="font-medium text-sm text-gray-7">
                  {businessStatus}
                </p>
              )}
              {distance && (
                <p className="font-medium text-sm text-gray-7">{distance}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
