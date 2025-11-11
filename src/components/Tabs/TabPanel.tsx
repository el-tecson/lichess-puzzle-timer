import { TabPanel as HUITabPanel } from "@headlessui/react";

export default function TabPanel({ className = "", ...props }) {
  return <HUITabPanel className={`tab-panel ${className}`} {...props} />;
}
