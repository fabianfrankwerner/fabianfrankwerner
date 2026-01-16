"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <Authenticated>
        <UserButton />
        <Content />
      </Authenticated>
      <Unauthenticated>
        <SignInButton />
        <SignUpButton />
      </Unauthenticated>
    </>
  );
}

function Content() {
  const { user } = useUser();
  return <div>Good morning {user?.fullName}!</div>;
}