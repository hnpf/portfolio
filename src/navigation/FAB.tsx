import { LucideIcon } from "lucide-react";

type Color =
  | "primary-container"
  | "secondary-container"
  | "tertiary-container"
  | "primary"
  | "secondary"
  | "tertiary";

type Size = "small" | "normal" | "medium" | "large";
type Elevation = "normal" | "lowered" | "none";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: Color;
  elevation?: Elevation;
  size?: Size;
  icon?: LucideIcon;
  text?: string;
};

const iconSize: Record<Size, number> = {
  small: 24,
  normal: 24,
  medium: 28,
  large: 36,
};

export function FAB({
  color = "primary",
  elevation = "normal",
  size = "normal",
  icon: Icon,
  text,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={`m3-fab m3-layer color-${color} size-${size} elevation-${elevation}`}
      {...rest}
    >
      {Icon && <Icon size={iconSize[size]} />}
      {text && <span className="fab-label">{text}</span>}
    </button>
  );
}
