"use client";

import { useAuth } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";

import { Spinner } from "@/components/ui/spinner";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading: isConvexAuthLoading } = useConvexAuth();
  const { isLoaded: isClerkAuthLoaded } = useAuth();

  if (isConvexAuthLoading || !isClerkAuthLoaded) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Spinner className="size-5" />
      </div>
    );
  }

  return <>{children}</>;
}
