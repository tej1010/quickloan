import { useState } from "react";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

interface CustomerApplicationLinkShareProps {
  link: string;
  mobile: string;
}

export default function CustomerApplicationLinkShare({
  link,
  mobile,
}: CustomerApplicationLinkShareProps) {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const shareMessage = `Complete your device loan application using this secure link: ${link}`;
  const whatsappUrl = `https://wa.me/91${mobile.replace(/\D/g, "")}?text=${encodeURIComponent(shareMessage)}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(link)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <div className="p-4 rounded-xl border border-brand-200 bg-brand-50 dark:border-brand-500/30 dark:bg-brand-500/10">
        <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
          Share link with customer
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Customer can open the link on their phone to continue KYC and consent steps.
        </p>
        <p className="mt-2 text-xs font-mono text-gray-600 dark:text-gray-300 break-all">{link}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          <Button size="sm" variant="outline" onClick={() => setQrOpen(true)}>
            QR Code
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}
          >
            WhatsApp
          </Button>
          <Button size="sm" variant="outline" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </div>
      </div>

      <Modal isOpen={qrOpen} onClose={() => setQrOpen(false)} className="max-w-sm m-4">
        <div className="text-center">
          <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">Scan QR Code</h3>
          <p className="mb-4 text-sm text-gray-500">Customer scans to open the application link</p>
          <img
            src={qrImageUrl}
            alt="Application link QR code"
            className="mx-auto rounded-xl border border-gray-200 dark:border-gray-800"
            width={220}
            height={220}
          />
          <p className="mt-4 text-xs text-gray-400 break-all">{link}</p>
        </div>
      </Modal>
    </>
  );
}
