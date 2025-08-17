"use client";
import { SessionProvider } from "next-auth/react";
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}

// childer layout me ahi 
// measn pure code me <sessionProvider> ka use kiya hai
