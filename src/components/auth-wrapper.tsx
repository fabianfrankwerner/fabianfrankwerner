"use client";

import { useAuth } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";

import { Spinner } from "@/components/ui/spinner";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading: isConvexAuthLoading, isAuthenticated } = useConvexAuth();
  const { isLoaded: isClerkAuthLoaded, isSignedIn } = useAuth();

  const isAuthenticating =
    !isClerkAuthLoaded ||
    isConvexAuthLoading ||
    (isClerkAuthLoaded && isSignedIn && !isAuthenticated);

  if (isAuthenticating) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Spinner className="size-5" />
      </div>
    );
  }

  return <>{children}</>;
}
