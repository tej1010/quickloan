import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageHeader from "../../../components/fintech/PageHeader";
import DataTable from "../../../components/fintech/DataTable";
import Badge from "../../../components/ui/badge/Badge";
import Button from "../../../components/ui/button/Button";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { vendorService } from "../../../services/vendorService";
import { useAuth } from "../../../context/AuthContext";
import type { Branch } from "../../../types";

export default function VendorBranches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const { isOpen, openModal, closeModal } = useModal();
  const { user } = useAuth();
  const isOwner = user?.isOwner;

  useEffect(() => {
    vendorService.getBranches().then(setBranches);
  }, []);

  if (!isOwner) {
    return (
      <div className="p-6 text-center text-gray-500">
        Branch management is available for vendor owners only.
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Branch Management | Vendor" description="Manage branches" />
      <PageHeader title="Branch Management" actions={<Button size="sm" onClick={openModal}>Add Branch</Button>} />
      <DataTable
        title="Branches"
        data={branches}
        columns={[
          { key: "name", header: "Branch Name", render: (r) => <span className="font-medium">{r.name}</span> },
          { key: "address", header: "Address", render: (r) => `${r.address}, ${r.city}` },
          { key: "pincode", header: "Pincode", render: (r) => r.pincode },
          { key: "status", header: "Status", render: (r) => (
            <Badge size="sm" color={r.isActive ? "success" : "error"}>{r.isActive ? "Active" : "Inactive"}</Badge>
          )},
          { key: "actions", header: "Actions", render: () => (
            <div className="flex gap-2">
              <button className="text-xs text-brand-500">Edit</button>
              <button className="text-xs text-warning-600">Toggle</button>
              <button className="text-xs text-error-500">Delete</button>
            </div>
          )},
        ]}
      />
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-lg m-4">
        <h3 className="mb-4 text-lg font-semibold">Add Branch</h3>
        <div className="space-y-4">
          <div><Label>Branch Name</Label><Input placeholder="Branch name" /></div>
          <div><Label>Address</Label><Input placeholder="Address" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>City</Label><Input /></div>
            <div><Label>Pincode</Label><Input /></div>
          </div>
          <Button className="w-full" onClick={closeModal}>Save Branch</Button>
        </div>
      </Modal>
    </>
  );
}
