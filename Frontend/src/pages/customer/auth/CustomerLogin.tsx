import PageMeta from "../../../components/common/PageMeta";
import CustomerLoginForm from "../../../components/customer/CustomerLoginForm";
import "../../../styles/customer-mobile.css";

export default function CustomerLogin() {
  return (
    <>
      <PageMeta title="Login | Fintech" description="Customer login" />
      <CustomerLoginForm />
    </>
  );
}
