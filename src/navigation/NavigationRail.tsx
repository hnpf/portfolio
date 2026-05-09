import { useState, useEffect, type ReactNode } from "react";

type Collapse = "normal" | "full" | "no" | boolean;

type Props = {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  collapse?: Collapse;
  modal?: boolean;
  alignment?: "top" | "center";
  iconType?: "left" | "full";
  fab?: (open: boolean) => ReactNode;
  children: ReactNode;
};

export function NavigationRail({
  open: controlledOpen,
  onOpenChange,
  collapse = "normal",
  modal = false,
  alignment = "top",
  iconType = "left",
  fab,
  children,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;

  const setOpen = (v: boolean) => {
    setInternalOpen(v);
    onOpenChange?.(v);
  };

  useEffect(() => {
    if (!modal) return;
    const handler = (e: KeyboardEvent) => {
      if (open && e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modal, open]);

  const showToggle = collapse !== "no" && collapse !== false;
  const showTop = showToggle || fab;

  const railCls = [
    "rail",
    open ? "open" : "",
    alignment === "center" ? "centered" : "",
    collapse === "full" ? "collapse" : "",
    iconType === "full" ? "icon" : "",
    modal ? "modal" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // pass rail state down to items via data attr on .items
  const railState = open ? "open" : collapse === "full" ? "collapse" : "default";

  return (
    <div className="m3-rail-container">
      <div className={railCls}>
        {showTop && (
          <div className="rail-top">
            {showToggle && (
              <button
                className="rail-toggle m3-layer"
                type="button"
                aria-label={open ? "Close navigation" : "Open navigation"}
                onClick={() => setOpen(!open)}
              >
                <span className="hamburger" />
              </button>
            )}
            {fab && <div>{fab(open)}</div>}
          </div>
        )}
        <div
          className="items"
          role="menu"
          aria-labelledby="m3-navigationtoggle"
          data-rail-state={railState}
        >
          {children}
        </div>
      </div>
      {modal && open && (
        <div className="rail-shadow" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}
