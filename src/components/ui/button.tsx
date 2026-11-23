import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-display text-[0.88rem] font-bold uppercase tracking-[0.04em] transition-[transform,background-color,color,box-shadow,border-color] duration-200 ease-out active:not-disabled:translate-y-0 disabled:opacity-50 disabled:pointer-events-none min-h-11 px-5",
  {
    variants: {
      variant: {
        primary:
          "bg-oxblood text-on-brand border-2 border-transparent shadow-[0_2px_8px_rgb(227_6_19_/_0.22)] hover:bg-oxblood-deep hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgb(227_6_19_/_0.28)]",
        outline:
          "bg-white text-oxblood border-2 border-oxblood shadow-none hover:bg-oxblood hover:text-on-brand hover:-translate-y-0.5",
        ghost:
          "bg-transparent text-ink hover:bg-paper-inset hover:text-oxblood",
        gold:
          "bg-gold text-ink border-2 border-gold shadow-none hover:bg-gold-deep hover:-translate-y-0.5",
        quiet:
          "bg-white text-ink border border-rule hover:border-ink",
      },
      shape: {
        default: "rounded-xl",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      shape: "pill",
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
  return <Comp className={cn(buttonVariants({ variant, shape }), className)} {...props} />;
}
