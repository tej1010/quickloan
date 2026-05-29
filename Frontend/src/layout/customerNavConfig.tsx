import {
  DocsIcon,
  DollarLineIcon,
  GridIcon,
  ListIcon,
  PlugInIcon,
  UserCircleIcon,
} from "../icons";
import type { NavItem } from "../config/navigation";
import { customerNavItems, customerOthersItems } from "../config/navigation";

export const customerNavWithIcons: NavItem[] = [
  { ...customerNavItems[0], icon: <GridIcon /> },
  { ...customerNavItems[1], icon: <ListIcon /> },
  { ...customerNavItems[2], icon: <DollarLineIcon /> },
  { ...customerNavItems[3], icon: <DocsIcon /> },
];

export const customerOthersWithIcons: NavItem[] = [
  { ...customerOthersItems[0], icon: <PlugInIcon /> },
  { ...customerOthersItems[1], icon: <UserCircleIcon /> },
];
