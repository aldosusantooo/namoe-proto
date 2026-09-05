type Props = React.HTMLAttributes<HTMLDivElement> & { as?: "div" | "section" | "article" };

export function Card({ as: Tag = "div", className = "", ...rest }: Props) {
  return <Tag className={`rounded-lg bg-surface p-4 shadow-card ${className}`} {...rest} />;
}
