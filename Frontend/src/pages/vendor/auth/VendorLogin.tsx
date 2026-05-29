import PageMeta from "../../../components/common/PageMeta";
import AuthPageLayout from "../../AuthPages/AuthPageLayout";
import VendorLoginForm from "../../../components/vendor/VendorLoginForm";

export default function VendorLogin() {
  return (
    <>
      <PageMeta title="Vendor Login | Quick Loan" description="Vendor panel login" />
      <AuthPageLayout>
        <VendorLoginForm />
      </AuthPageLayout>
    </>
  );
}
