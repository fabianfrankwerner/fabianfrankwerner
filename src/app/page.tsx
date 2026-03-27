"use client";

import { useClerk } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";

import { AuthWrapper } from "@/components/auth-wrapper";
import LandingPage from "@/components/landing-page";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { signOut } = useClerk();

  return (
    <AuthWrapper>
      <Authenticated>
        <div className="flex min-h-screen flex-col bg-background">
          <header className="border-b">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="text-xl font-bold tracking-tight">Simultan</div>
                <div className="hidden text-xs text-muted-foreground sm:block">
                  Content Scheduling for Developers
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </header>
        </div>
      </Authenticated>
      <Unauthenticated>
        <LandingPage />
      </Unauthenticated>
    </AuthWrapper>
  );
}
