"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";

function SyncUserWithConvex() {
    const { user } = useUser();
    const syncUser = useMutation(api.users.syncUser);

    useEffect(() => {
        if (!user) return;

        const sync = async () => {
            try {
                await syncUser({
                    userId: user.id,
                    email: user.emailAddresses[0]?.emailAddress ?? "",
                    name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
                });
            } catch (error) {
                console.error("Error syncing user:", error);
            }
        };

        sync();
    }, [user, syncUser]);

    return null;
}

export default SyncUserWithConvex;
