"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import SyncUserWithConvex from "../SyncUserWithConvex";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <SyncUserWithConvex />
      {children}
    </ConvexProviderWithClerk>
  );
}

export default ConvexClientProvider;
