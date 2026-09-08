type Props = React.HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "article" | "ul" | "li";
  /** 16px padding on every side. Off by default so lists and images can run edge to edge. */
  pad?: boolean;
};

/** Paper card with a visible edge: 2px outline plus a 3px solid shadow in the same colour. Never a blur. */
export function Card({ as: Tag = "div", pad = false, className = "", ...rest }: Props) {
  return (
    <Tag
      className={`overflow-hidden rounded-lg border-2 border-edge bg-paper shadow-card ${pad ? "p-4" : ""} ${className}`}
      {...rest}
    />
  );
}
