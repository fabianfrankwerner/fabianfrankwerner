"use client";

import { UserButton } from "@clerk/nextjs";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";

import LandingPage from "@/components/landing-page";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  return (
    <>
      <Authenticated>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs">Simultan</div>
            <UserButton />
          </div>
        </div>
      </Authenticated>
      <AuthLoading>
        <div className="flex min-h-svh items-center justify-center bg-background">
          <Spinner className="size-5" />
        </div>
      </AuthLoading>
      <Unauthenticated>
        <LandingPage />
      </Unauthenticated>
    </>
  );
}
