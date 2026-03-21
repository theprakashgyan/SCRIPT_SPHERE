"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../../convex/_generated/api";
import toast from "react-hot-toast";

export default function UpgradeButton() {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const mockUpgrade = useMutation(api.users.mockUpgradeToPro);
  const { user } = useUser();

  const handleUpgrade = async () => {
    if (!user) return;
    setIsUpgrading(true);
    try {
      await mockUpgrade({ userId: user.id });
      toast.success("Successfully upgraded to Pro!");
      // Next.js client-side refresh or reload is an option, but Convex will automatically trigger reactivity
      // To ensure navigation to the actual pro view correctly:
      window.location.reload();
    } catch (error) {
      toast.error("Failed to upgrade.");
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={isUpgrading}
      className={`inline-flex items-center justify-center gap-2 px-8 py-4 text-white 
        bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg 
        hover:from-blue-600 hover:to-blue-700 transition-all ${
        isUpgrading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <Zap className="w-5 h-5" />
      {isUpgrading ? "Upgrading..." : "Upgrade to Pro (Demo)"}
    </button>
  );
}
