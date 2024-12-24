import type { Session } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

export const SessionContext = createContext<Session | null>(null)

export function useSessionContext() {
    const sessionContext = useContext(SessionContext)
    if (sessionContext) {
        throw new Error("Try to use useSessionContext without a session")
    }
    return sessionContext
}
