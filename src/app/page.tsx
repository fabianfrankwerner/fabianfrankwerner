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
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs">Simultan</div>
            <Button variant="secondary" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </Authenticated>
      <Unauthenticated>
        <LandingPage />
      </Unauthenticated>
    </AuthWrapper>
  );
}
