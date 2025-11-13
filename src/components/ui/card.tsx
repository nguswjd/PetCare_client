import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const imageVariants = cva("", {
  variants: {
    size: {
      sm: "h-19 w-41",
      md: "h-40 w-41",
      lg: "h-40 w-full",
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
  image?: string;
  alt?: string;
  name: string;
  address: string;
  content?: string;
  businessStatus?: string;
  distance?: string;
}

const Card = ({
  size,
  image,
  alt,
  name,
  address,
  content,
  businessStatus,
  distance,
}: CardProps) => {
  return (
    <div className="flex flex-col gap-2">
      <img
        src={image}
        alt={alt || "card image"}
        className={cn(
          imageVariants({ size }),
          "object-cover rounded-md bg-gray-4"
        )}
      />
      <div className="grid grid-cols-2 items-center w-42">
        <p className="text-base font-semibold text-black">{name}</p>
        <p className="text-sm font-normal text-gray-6">{address}</p>

        {size === "sm" ? (
          <p className="font-medium text-sm text-gray-6 col-span-2">
            {content}
          </p>
        ) : (
          <>
            <p className="font-medium text-sm text-gray-7">{businessStatus}</p>
            <p className="font-medium text-sm text-gray-7">{distance}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Card;
