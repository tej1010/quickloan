import { useCallback, useRef, useState } from "react";
import Button from "../ui/button/Button";
import { downloadTextFile } from "../../services/loanApplicationService";

interface KfsReviewStepProps {
  kfsContent: string;
  loanId: string;
  onScrolledToBottom: (scrolled: boolean) => void;
}

export default function KfsReviewStep({ kfsContent, loanId, onScrolledToBottom }: KfsReviewStepProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
    if (atBottom && !scrolled) {
      setScrolled(true);
      onScrolledToBottom(true);
    }
  }, [scrolled, onScrolledToBottom]);

  const handleDownload = () => {
    downloadTextFile(kfsContent, `KFS-${loanId}.txt`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Scroll to the bottom to review the complete Key Fact Statement
        </p>
        <Button size="sm" variant="outline" onClick={handleDownload}>
          Download KFS
        </Button>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="max-h-[420px] overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5"
      >
        <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono text-gray-700 dark:text-gray-300">
          {kfsContent}
        </pre>
      </div>

      {!scrolled ? (
        <p className="text-xs text-warning-600 text-center">
          Please scroll to the bottom of the KFS to enable Proceed
        </p>
      ) : (
        <p className="text-xs text-success-600 text-center">
          KFS reviewed completely. You may proceed.
        </p>
      )}
    </div>
  );
}
