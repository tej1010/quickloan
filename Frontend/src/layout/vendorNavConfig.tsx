import {
  BoxCubeIcon,
  CalenderIcon,
  DollarLineIcon,
  GridIcon,
  GroupIcon,
  ListIcon,
  PlugInIcon,
  UserCircleIcon,
} from "../icons";
import type { NavItem } from "../config/navigation";
import { vendorNavItems, vendorOthersItems } from "../config/navigation";

export const vendorNavWithIcons: NavItem[] = [
  { ...vendorNavItems[0], icon: <GridIcon /> },
  { ...vendorNavItems[1], icon: <GroupIcon /> },
  {
    ...vendorNavItems[2],
    icon: <ListIcon />,
  },
  { ...vendorNavItems[3], icon: <CalenderIcon /> },
  { ...vendorNavItems[4], icon: <DollarLineIcon /> },
  { ...vendorNavItems[5], icon: <BoxCubeIcon /> },
];

export const vendorOthersWithIcons: NavItem[] = [
  { ...vendorOthersItems[0], icon: <PlugInIcon /> },
  { ...vendorOthersItems[1], icon: <UserCircleIcon /> },
];
