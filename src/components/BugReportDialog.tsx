// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bug, X, Image as ImageIcon, Trash2, Loader2, CheckCircle } from "lucide-react";
import { cn } from "../constants";

interface BugReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  setToast: (msg: string) => void;
  isMobile: boolean;
}

export const BugReportDialog = ({
  isOpen,
  onClose,
  setToast,
  isMobile,
}: BugReportDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // reset fields when opening/closing
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setScreenshot(null);
      setIsSubmitting(false);
      setIsSuccess(false);
      setUploadError(null);
    }
  }, [isOpen]);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file (PNG, JPG, etc.).");
      return;
    }
    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Your screenshot must be smaller than 5MB!");
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        setScreenshot(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // paste listener in thewrapper
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          processFile(file);
          e.preventDefault();
          break;
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setToast("Please fill in both title and description, thanks!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/report-bug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          screenshot,
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Counldn't submit your bug report.");
      }

      setIsSuccess(true);
      setToast("Bug report submitted successfully!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setToast(err.message || "Something went wrong submitting bug report!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const dialogSpring = {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className={cn(
            "fixed inset-0 z-[110] flex items-center justify-center overflow-hidden",
            isMobile ? "p-0 bg-black/20" : "p-4"
          )}
          onPaste={handlePaste}
        >
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isSubmitting && onClose()}
            className="absolute inset-0 bg-black/60 backdrop-blur-md motion-gpu"
          />

          {/* container */}
          <motion.div
            initial={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } }}
            transition={isMobile ? { type: "spring", damping: 30, stiffness: 350, mass: 0.8 } : dialogSpring}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative bg-[var(--surface)] shadow-2xl overflow-hidden flex flex-col motion-gpu border-[var(--outline-variant)]",
              isMobile 
                ? "w-full h-[100dvh] max-w-none max-h-none rounded-none border-none" 
                : "w-full max-w-lg rounded-[2rem] md:rounded-[2.5rem] max-h-[85vh] border"
            )}
            style={{ touchAction: "none" }}
          >
            <div className="flex flex-col h-full overflow-hidden">
              {/* handle drag for mobile */}
              {isMobile && (
                <div className="w-full flex justify-center pt-3 pb-1 shrink-0 bg-[var(--surface)]">
                  <div className="w-12 h-1.5 bg-[var(--outline-variant)] rounded-full opacity-40" />
                </div>
              )}

              {/* headre */}
              <div className={cn(
                "flex justify-between items-center border-b border-[var(--outline-variant)] bg-[var(--surface)] sticky top-0 z-10 shrink-0",
                isMobile ? "p-4" : "p-6 md:p-8"
              )}>
                <div className="flex items-center gap-3">
                  <Bug size={24} className="text-[var(--primary)]" />
                  <h2 className="font-black text-xl md:text-2xl font-expressive uppercase tracking-tight">
                    Report a Bug
                  </h2>
                </div>
                {!isSubmitting && (
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-[var(--surface-variant)] rounded-full transition-colors cursor-pointer text-[var(--on-surface)]"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>

              {/* form content */}
              <div className={cn(
                "space-y-6 overflow-y-auto scrollbar-hide flex-1",
                isMobile ? "p-6 pb-32" : "p-6 md:p-8"
              )}>
                {isSuccess ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center space-y-4"
                  >
                    <CheckCircle size={64} className="text-emerald-500 animate-bounce" />
                    <h3 className="text-xl font-bold text-[var(--on-surface)]">Thank you!</h3>
                    <p className="text-sm text-[var(--on-surface-variant)] max-w-xs">
                      Your bug report has been successfully sent to the server. I'm grateful for your feedback!
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* input title */}
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-[var(--on-surface-variant)]">
                        Bug Title
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        placeholder="e.g. Broken link on dash page"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full mt-2 bg-[var(--surface-variant)]/40 text-[var(--on-surface)] border-5 border-[var(--outline-variant)] focus:border-[var(--primary)] rounded-2xl px-4 py-3 text-md focus:outline-none transition-all duration-200"
                      />
                    </div>

                    {/* desc textarea */}
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-[var(--on-surface-variant)]">
                        Description
                      </label>
                      <textarea
                        required
                        disabled={isSubmitting}
                        rows={4}
                        placeholder="Please describe the steps to reproduce the bug and what happened..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full mt-2 bg-[var(--surface-variant)]/40 text-[var(--on-surface)] border-5 border-[var(--outline-variant)] focus:border-[var(--primary)] rounded-2xl px-4 py-3 text-md focus:outline-none transition-all duration-200 resize-none min-h-[100px]"
                      />
                    </div>

                    {/* upload and paste */}
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-[var(--on-surface-variant)] flex justify-between items-center">
                        <span>Screenshot (Optional)</span>
                        {screenshot && (
                          <span className="text-[10px] text-emerald-500 font-bold lowercase tracking-normal">
                            Image attached
                          </span>
                        )}
                      </label>

                      {screenshot ? (
                        <div className="relative border border-[var(--outline-variant)] rounded-2xl overflow-hidden group bg-black/10">
                          <img
                            src={screenshot}
                            alt="Screenshot Preview"
                            className="w-full max-h-48 object-contain"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button
                              type="button"
                              onClick={removeScreenshot}
                              className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-colors cursor-pointer shadow-lg"
                              title="Remove screenshot"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={cn(
                            "border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200",
                            dragActive
                              ? "border-[var(--primary)] bg-[var(--primary-container)]/10"
                              : "border-[var(--outline-variant)] bg-[var(--surface-variant)]/20 hover:bg-[var(--surface-variant)]/40"
                          )}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                            disabled={isSubmitting}
                          />
                          <ImageIcon size={32} className="text-[var(--on-surface-variant)]/60 mb-2" />
                          <p className="text-sm font-bold text-[var(--on-surface)]">
                            Click to upload or drag screenshot
                          </p>
                          <p className="text-xs text-[var(--on-surface-variant)]/75 mt-1">
                            You can also paste (Ctrl+V) an image anywhere in this popup
                          </p>
                          {uploadError && (
                            <p className="text-xs text-rose-500 font-bold mt-2">
                              {uploadError}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* footer actions */}
                    <div className="flex gap-3 pt-5 border-t border-[var(--outline-variant)]">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={onClose}
                        className="flex-1 bg-[var(--surface-variant)] hover:bg-[var(--outline-variant)]/40 text-[var(--on-surface-variant)] py-3.5 rounded-2xl hover:rounded-xl active:scale-95 text-sm font-black tracking-wide transition-all duration-200 cursor-pointer text-center"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !title.trim() || !description.trim()}
                        className="flex-[1.5] bg-[var(--primary)] text-[var(--on-primary)] disabled:bg-[var(--surface-variant)]/50 disabled:text-[var(--outline)] disabled:scale-100 disabled:opacity-50 py-3.5 rounded-xl hover:rounded-2xl active:scale-95 transition-all duration-300 ease-out flex items-center justify-center gap-2 cursor-pointer text-sm font-black tracking-wide shadow-sm disabled:shadow-none"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <span>Send Report</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
