import PanelLayout from "./PanelLayout";
import { customerNavWithIcons, customerOthersWithIcons } from "./customerNavConfig";

export default function CustomerLayout() {
  return (
    <PanelLayout
      homePath="/customer/dashboard"
      navItems={customerNavWithIcons}
      othersItems={customerOthersWithIcons}
    />
  );
}
