"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { UserButton } from "@clerk/nextjs";
import LandingPage from "@/components/landing-page";

export default function Home() {
  return (
    <>
      <Authenticated>
        <UserButton />
        <p>Hello, World!</p>
      </Authenticated>
      <Unauthenticated>
        <LandingPage />
      </Unauthenticated>
    </>
  );
}
