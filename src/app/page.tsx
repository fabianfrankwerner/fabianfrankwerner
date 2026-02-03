"use client";

import { useClerk } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";

import { AuthWrapper } from "@/components/auth-wrapper";
import { DevToConnection } from "@/components/devto-connection";
import LandingPage from "@/components/landing-page";
import { PostWriter } from "@/components/post-writer";
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

          <main className="container mx-auto flex-1 p-4 md:p-8">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left Column: Connection Settings */}
              <div className="space-y-6 lg:col-span-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Connections</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your social media and blog platforms.
                  </p>
                </div>
                <DevToConnection />
              </div>

              {/* Right Column: Content Creation */}
              <div className="space-y-6 lg:col-span-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Compose</h2>
                  <p className="text-sm text-muted-foreground">
                    Create content once, publish everywhere.
                  </p>
                </div>
                <PostWriter />
              </div>
            </div>
          </main>

          <footer className="border-t py-6 md:py-0">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:h-16 md:flex-row">
              <p className="text-sm text-muted-foreground">
                Built for the modern developer.
              </p>
            </div>
          </footer>
        </div>
      </Authenticated>
      <Unauthenticated>
        <LandingPage />
      </Unauthenticated>
    </AuthWrapper>
  );
}
