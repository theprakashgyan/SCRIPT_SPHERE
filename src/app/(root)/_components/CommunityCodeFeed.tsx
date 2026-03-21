import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { Clock, User } from "lucide-react";

async function CommunityCodeFeed() {
  let savedCodes: any[] = [];

  try {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    savedCodes = await convex.query(api.savedCodes.getSavedCodes, {});
  } catch {
    return (
      <div className="mt-6 rounded-xl border border-white/[0.05] bg-[#12121a]/90 p-6">
        <p className="text-sm text-red-300">
          Unable to load community saved code right now. Please refresh in a moment.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-white/[0.05] bg-[#12121a]/90 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Community Saved Code</h2>
          <p className="text-sm text-gray-400">
            Code saved by users from the editor is visible here to everyone.
          </p>
        </div>
        <span className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
          {savedCodes.length} total
        </span>
      </div>

      {savedCodes.length === 0 ? (
        <div className="rounded-lg bg-black/20 p-5 text-sm text-gray-400">
          No code saved yet. Save code from the editor to publish it here.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {savedCodes.slice(0, 12).map((savedCode) => (
            <div
              key={savedCode._id}
              className="rounded-lg border border-[#313244]/50 bg-[#1e1e2e]/80 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="line-clamp-1 text-sm font-semibold text-white">{savedCode.title}</h3>
                <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs text-blue-300">
                  {savedCode.language}
                </span>
              </div>
              <div className="mb-3 flex items-center gap-3 text-xs text-gray-400">
                <span className="inline-flex items-center gap-1">
                  <User className="size-3" />
                  {savedCode.userName}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" />
                  {new Date(savedCode._creationTime).toLocaleDateString()}
                </span>
              </div>
              <pre className="max-h-36 overflow-auto rounded-md bg-black/30 p-3 text-xs text-gray-300">
                <code>{savedCode.code}</code>
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommunityCodeFeed;
