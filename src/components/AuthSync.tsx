"use client";

import React from "react";
import { useAuthStore } from "@/store/Auth";

/**
 * Validates the persisted auth state against Appwrite on app load.
 *
 * The auth store persists `user` to localStorage, so without this the UI can
 * show a logged-in state long after the actual Appwrite session has expired —
 * leading to confusing "missing permission for role users" errors on writes.
 */
export default function AuthSync() {
    const { hydrated, verfiySession } = useAuthStore();

    React.useEffect(() => {
        // Runs on every load, not just when a user is already stored: after an
        // OAuth redirect Appwrite has set a session cookie but the store is
        // still empty, so this is what actually picks the logged-in user up.
        if (hydrated) verfiySession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hydrated]);

    return null;
}
