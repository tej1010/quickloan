import PanelLayout from "./PanelLayout";
import { vendorNavWithIcons, vendorOthersWithIcons } from "./vendorNavConfig";

export default function VendorLayout() {
  return (
    <PanelLayout
      homePath="/vendor/dashboard"
      navItems={vendorNavWithIcons}
      othersItems={vendorOthersWithIcons}
      showSearch={false}
    />
  );
}
