import { NavigationRail } from "./NavigationRail";
import { NavigationRailItem } from "./NavigationRailItem";
import { FAB } from "./FAB";
import type { IconifyIcon } from "@iconify/types";

// addBadge: wraps an icon with a badge count (or dot if no count.)
// if you're using this component , simplly adapt to your icon system as needed
function addBadge(icon: IconifyIcon, count?: number): IconifyIcon {
  // stub; replace with your actual badge stuff.
  return icon;
}

const iconStars = { body: "...", width: 24, height: 24 } satisfies IconifyIcon;
const iconStarsOutline = { body: "...", width: 24, height: 24 } satisfies IconifyIcon;

export default function App() {
  return (
    <NavigationRail
      fab={(open) => (
        <FAB
          color="primary-container"
          text={open ? "Label" : undefined}
          elevation="none"
          onClick={() => alert("!")}
        />
      )}
    >
      <NavigationRailItem label="Label" icon={iconStars} active />
      <NavigationRailItem label="Label" icon={iconStarsOutline} />
      <NavigationRailItem label="Label" icon={addBadge(iconStarsOutline, 3)} />
      <NavigationRailItem label="Label" icon={addBadge(iconStarsOutline)} />
    </NavigationRail>
  );
}
