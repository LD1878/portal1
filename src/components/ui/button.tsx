import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-display text-[0.9rem] font-bold uppercase tracking-[0.5px] transition-[transform,background-color,color,box-shadow,border-color] duration-200 ease-out active:not-disabled:translate-y-0 disabled:opacity-50 disabled:pointer-events-none min-h-11 px-6",
  {
    variants: {
      variant: {
        primary:
          "bg-oxblood text-on-brand border-2 border-transparent shadow-[0_2px_5px_rgb(227_6_19_/_0.2)] hover:bg-oxblood-deep hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgb(227_6_19_/_0.3)]",
        ghost:
          "bg-transparent text-ink hover:bg-paper-inset hover:text-oxblood",
        outline:
          "bg-transparent text-oxblood border-2 border-oxblood shadow-none hover:bg-oxblood hover:text-on-brand hover:-translate-y-0.5",
        stamp:
          "border-2 border-oxblood bg-transparent text-oxblood tracking-[0.5px] hover:bg-oxblood hover:text-on-brand",
      },
      shape: {
        default: "rounded-md",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      shape: "default",
    },
  },
);

export function Button({
  className,
  variant,
  shape,
  asChild,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, shape }), className)} {...props} />
  );
}
