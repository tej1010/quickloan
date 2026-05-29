import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageHeader from "../../../components/fintech/PageHeader";
import ComponentCard from "../../../components/common/ComponentCard";
import Badge from "../../../components/ui/badge/Badge";
import Button from "../../../components/ui/button/Button";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { vendorService } from "../../../services/vendorService";
import { authService } from "../../../services/authService";
import type { VendorProfile } from "../../../types";

export default function VendorProfile() {
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });

  useEffect(() => {
    vendorService.getProfile().then(setProfile);
  }, []);

  const handleChangePassword = async () => {
    await authService.changePassword(passwords.current, passwords.newPass);
    closeModal();
    setPasswords({ current: "", newPass: "", confirm: "" });
  };

  if (!profile) return <div className="text-gray-500">Loading...</div>;

  return (
    <>
      <PageMeta title="Profile | Vendor" description="Vendor profile" />
      <PageHeader title="Profile" actions={
        <Button size="sm" variant="outline" onClick={openModal}>Change Password</Button>
      } />
      <div className="space-y-6 max-w-3xl">
        <ComponentCard title="Business Information">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Store Name", profile.storeName],
              ["Owner Name", profile.ownerName],
              ["GSTIN", profile.gstin],
              ["Mobile", profile.mobile],
              ["Email", profile.email],
              ["Address", profile.address],
            ].map(([l, v]) => (
              <div key={l}><p className="text-xs text-gray-500">{l}</p><p className="text-sm font-medium">{v}</p></div>
            ))}
          </div>
        </ComponentCard>
        <ComponentCard title="Bank Information">
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(profile.bank).map(([k, v]) => (
              <div key={k}><p className="text-xs text-gray-500 capitalize">{k.replace(/([A-Z])/g, " $1")}</p><p className="text-sm font-medium">{v}</p></div>
            ))}
          </div>
        </ComponentCard>
        <ComponentCard title="KYC Information">
          <Badge color={profile.kyc.status === "verified" ? "success" : "warning"}>{profile.kyc.status}</Badge>
        </ComponentCard>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md m-4">
        <h3 className="mb-4 text-lg font-semibold">Change Password</h3>
        <div className="space-y-4">
          <div><Label>Current Password</Label><Input type="password" value={passwords.current} onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))} /></div>
          <div><Label>New Password</Label><Input type="password" value={passwords.newPass} onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))} /></div>
          <div><Label>Confirm Password</Label><Input type="password" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} /></div>
          <Button className="w-full" onClick={handleChangePassword} disabled={!passwords.newPass || passwords.newPass !== passwords.confirm}>
            Update Password
          </Button>
        </div>
      </Modal>
    </>
  );
}
