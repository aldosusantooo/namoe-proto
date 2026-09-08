import Link from "next/link";
import type { ComponentProps } from "react";

export type ButtonVariant = "primary" | "coral" | "ghost";

type Common = {
  variant?: ButtonVariant;
  /** 48 x 48, no horizontal padding. For back, search, close and chevron. */
  icon?: boolean;
  /** 44 high, 15px text, 0 16 padding. */
  sm?: boolean;
  /** Stretch to the container width. */
  block?: boolean;
  className?: string;
  children: React.ReactNode;
};

type AsButton = Common & Omit<ComponentProps<"button">, "className" | "children"> & { href?: undefined };
type AsLink = Common & Omit<ComponentProps<typeof Link>, "className" | "children"> & { href: string; external?: boolean };

const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-navy text-paper shadow-btn-primary",
  coral: "bg-coral text-paper shadow-btn-coral",
  ghost: "border-2 border-edge bg-paper text-navy shadow-btn-ghost",
};

export function buttonClass({ variant = "primary", icon = false, sm = false, block = false, className = "" }: Omit<Common, "children">) {
  return [
    "inline-flex items-center justify-center gap-2 rounded-pill font-display font-semibold no-underline select-none",
    "transition-[transform,box-shadow] duration-[var(--duration-fast)] active:translate-y-[3px] active:shadow-none",
    "disabled:opacity-50 disabled:active:translate-y-0",
    VARIANT[variant],
    icon ? (sm ? "size-11 p-0" : "size-12 p-0") : sm ? "min-h-11 px-4 text-[15px]" : "min-h-12 px-5 text-[17px]",
    block ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Every button and link that looks like a button. Renders <button>, or <Link> / <a> when `href` is set. */
export function Button(props: AsButton | AsLink) {
  if (props.href !== undefined) {
    const { variant, icon, sm, block, className, children, external, href, ...rest } = props;
    const cls = buttonClass({ variant, icon, sm, block, className });
    if (external) {
      return (
        <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...(rest as ComponentProps<"a">)}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  const { variant, icon, sm, block, className, children, type = "button", ...rest } = props;
  return (
    <button type={type} className={buttonClass({ variant, icon, sm, block, className })} {...rest}>
      {children}
    </button>
  );
}
