import { APP_NAME } from "@/lib/copy";

type Props = {
  /** `hero`: cream on blue at 44px. `sidebar`: cream on navy at 26px. */
  variant?: "hero" | "sidebar";
  /** Theo's wordmark replaces the text when it lands; pass it here. */
  children?: React.ReactNode;
  className?: string;
};

/** "Namoe Go" as a two-line Fredoka 700 text lockup. Never draws the Namoe Market logo. */
export function Lockup({ variant = "hero", children, className = "" }: Props) {
  const size = variant === "hero" ? "text-lockup" : "text-[26px] leading-none";
  const [first, second] = APP_NAME.split(" ");
  return (
    <span className={`block font-display font-bold tracking-[-0.02em] text-cream ${size} ${className}`}>
      {children ?? (
        <>
          {first}
          <br />
          {second}
        </>
      )}
    </span>
  );
}
