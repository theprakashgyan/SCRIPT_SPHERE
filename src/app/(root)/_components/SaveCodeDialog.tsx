import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { LANGUAGE_CONFIG } from "../_constants";

function SaveCodeDialog({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { language, getCode } = useCodeEditorStore();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);

    try {
      const code = getCode();
      const cleanedTitle = title.trim();
      const autoTitle = `${LANGUAGE_CONFIG[language].label} code - ${new Date().toLocaleString()}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      const res = await fetch("/api/saved-codes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          title: cleanedTitle || autoTitle,
          language,
          code,
        }),
      });
      clearTimeout(timeoutId);

      const payload = (await res.json()) as { message?: string };
      if (!res.ok) {
        throw new Error(payload.message || "Failed to save code.");
      }

      toast.success("Code saved and shared successfully");
      setTitle("");
      onClose();
    } catch (error) {
      console.log("Error saving code:", error);
      const isAbort = error instanceof DOMException && error.name === "AbortError";
      const fallbackMessage = isAbort
        ? "Save request timed out. Please try again."
        : "Failed to save code. Please try again.";
      const message =
        error instanceof Error && error.message
          ? error.message
          : fallbackMessage;
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1e1e2e] rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Save Code</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">
              Title (optional)
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#181825] border border-[#313244] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a title, or leave blank for auto title"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default SaveCodeDialog;
