"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { UserButton } from "@clerk/nextjs";
import LandingPage from "@/components/landing-page";

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
      <Unauthenticated>
        <LandingPage />
      </Unauthenticated>
    </>
  );
}
