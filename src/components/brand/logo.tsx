import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/** Wordmark is an opaque white PNG — always sit it on a white plate. */
export function Logo({
  to = "/",
  compact = false,
  className,
}: {
  to?: "/" | "/desk";
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn("group flex min-h-11 items-center gap-3 no-underline", className)}
    >
      <span className="inline-flex items-center rounded-md bg-white px-1.5 py-1">
        <img
          src="/logo.png"
          alt="JUROSpain"
          className={compact ? "h-7 w-auto" : "h-8 w-auto sm:h-9"}
          width={220}
          height={44}
        />
      </span>
    </Link>
  );
}
