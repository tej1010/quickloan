import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon } from "../../../icons";
import PageMeta from "../../../components/common/PageMeta";
import AuthPageLayout from "../../AuthPages/AuthPageLayout";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { authService } from "../../../services/authService";

export default function VendorForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await authService.forgotPassword(email);
    setSent(true);
    setLoading(false);
  };

  return (
    <>
      <PageMeta title="Forgot Password | Vendor" description="Reset vendor password" />
      <AuthPageLayout>
        <div className="flex flex-col flex-1 w-full max-w-md mx-auto justify-center">
          <Link to="/vendor/login" className="inline-flex items-center mb-8 text-sm text-gray-500">
            <ChevronLeftIcon className="size-5" /> Back to login
          </Link>
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90">Forgot Password</h1>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Enter your email to receive a reset link
          </p>
          {sent ? (
            <p className="text-sm text-success-600">Reset link sent to {email}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button className="w-full" disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</Button>
            </form>
          )}
        </div>
      </AuthPageLayout>
    </>
  );
}
