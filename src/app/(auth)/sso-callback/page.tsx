"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { Spinner } from "@/components/ui/spinner";

function SSOCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useConvexAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isAuthenticated || searchParams.toString() === "") {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router, searchParams]);

  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <Spinner className="size-5" />
      <AuthenticateWithRedirectCallback redirectUrlComplete="/" />
    </div>
  );
}

export default function SSOCallbackPage() {
  return (
    <Suspense>
      <SSOCallback />
    </Suspense>
  );
}
