import React from "react";
import { LucideIcon } from "lucide-react";

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type Props = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
} & (AnchorProps | ButtonProps);

export function NavigationRailItem({ label, icon: Icon, active = false, ...props }: Props) {
  const inner = (
    <>
      <div className="m3-layer" />
      <div className="nav-icon">
        <Icon size={24} />
      </div>
      <span className="label-open">{label}</span>
      <span className="label-closed">{label}</span>
    </>
  );

  const cls = ["m3-container", active ? "active" : ""].filter(Boolean).join(" ");

  if ("href" in props && props.href != undefined) {
    const { href, ...rest } = props as AnchorProps;
    return (
      <a className={cls} href={href} role="menuitem" {...rest}>
        {inner}
      </a>
    );
  }

  const { ...rest } = props as ButtonProps;
  return (
    <button className={cls} role="menuitem" type="button" {...rest}>
      {inner}
    </button>
  );
}
