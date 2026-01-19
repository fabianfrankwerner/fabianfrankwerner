"use client";

import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { UserButton } from "@clerk/nextjs";
import LandingPage from "@/components/landing-page";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const user = useQuery(api.users.current);

  return (
    <>
      <Authenticated>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <UserButton />
            <div className="text-xs text-muted-foreground">
              Convex auth wired to Clerk
            </div>
          </div>

          <pre className="max-w-full overflow-x-auto rounded bg-muted p-3 text-xs">
            {user ? JSON.stringify(user, null, 2) : "Loading user..."}
          </pre>
        </div>
      </Authenticated>
      <Unauthenticated>
        <LandingPage />
      </Unauthenticated>
    </>
  );
}
