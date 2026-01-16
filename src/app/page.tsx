"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { UserButton, useUser } from "@clerk/nextjs";
import LandingPage from "@/components/landing-page";

export default function Home() {
  return (
    <>
      <Authenticated>
        <UserButton />
        <Content />
      </Authenticated>
      <Unauthenticated>
        <LandingPage />
      </Unauthenticated>
    </>
  );
}

function Content() {
  const { user } = useUser();
  return <div>Good morning {user?.fullName}!</div>;
}