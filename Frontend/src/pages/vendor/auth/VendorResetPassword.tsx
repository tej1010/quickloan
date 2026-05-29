import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../../icons";
import PageMeta from "../../../components/common/PageMeta";
import AuthPageLayout from "../../AuthPages/AuthPageLayout";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { authService } from "../../../services/authService";

export default function VendorResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return;
    setLoading(true);
    await authService.resetPassword("token", password);
    setLoading(false);
    navigate("/vendor/login");
  };

  return (
    <>
      <PageMeta title="Reset Password | Vendor" description="Reset vendor password" />
      <AuthPageLayout>
        <div className="flex flex-col flex-1 w-full max-w-md mx-auto justify-center">
          <Link to="/vendor/login" className="inline-flex items-center mb-8 text-sm text-gray-500">
            <ChevronLeftIcon className="size-5" /> Back to login
          </Link>
          <h1 className="mb-6 font-semibold text-gray-800 text-title-sm dark:text-white/90">Reset Password</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>New Password</Label>
              <div className="relative">
                <Input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                <span onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                  {show ? <EyeIcon className="size-5 fill-gray-500" /> : <EyeCloseIcon className="size-5 fill-gray-500" />}
                </span>
              </div>
            </div>
            <div>
              <Label>Confirm Password</Label>
              <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            <Button className="w-full" disabled={loading || !password || password !== confirm}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </div>
      </AuthPageLayout>
    </>
  );
}
