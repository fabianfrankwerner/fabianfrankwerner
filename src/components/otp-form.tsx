"use client";

import { useSignIn, useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SimultanIcon } from "@/components/brand/simultan-icon";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function OTPForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const {
    signIn,
    isLoaded: signInLoaded,
    setActive: setSignInActive,
  } = useSignIn();
  const {
    signUp,
    isLoaded: signUpLoaded,
    setActive: setSignUpActive,
  } = useSignUp();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const isLoaded = signInLoaded && signUpLoaded;
  const isSignInFlow =
    signIn?.status === "needs_second_factor" ||
    signIn?.status === "needs_first_factor";

  const needsEmailCode =
    signIn?.status === "needs_first_factor" &&
    signIn.supportedFirstFactors?.some(
      (factor) => factor.strategy === "email_code",
    );

  useEffect(() => {
    if (
      isLoaded &&
      !isSignInFlow &&
      signUp?.status !== "missing_requirements"
    ) {
      router.replace("/");
    }
  }, [isLoaded, isSignInFlow, signUp?.status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || code.length !== 6) return;

    setIsLoading(true);
    setError("");

    try {
      if (isSignInFlow && signIn) {
        let result;
        if (needsEmailCode) {
          result = await signIn.attemptFirstFactor({
            strategy: "email_code",
            code,
          });
        } else {
          result = await signIn.attemptSecondFactor({
            strategy: "totp",
            code,
          });
        }

        if (result.status === "complete") {
          await setSignInActive({ session: result.createdSessionId });
          router.push("/");
        } else {
          setError("Something went wrong. Please try again!");
        }
      } else if (signUp) {
        const result = await signUp.attemptEmailAddressVerification({ code });

        if (result.status === "complete") {
          await setSignUpActive({ session: result.createdSessionId });
          router.push("/");
        } else {
          setError("Something went wrong. Please try again!");
        }
      }
      // eslint-disable-next-line
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to verify code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded) return;

    setIsResending(true);
    setError("");

    try {
      if (isSignInFlow && signIn) {
        const supportedFirstFactors = signIn.supportedFirstFactors;
        const emailFactor = supportedFirstFactors?.find(
          (factor) => factor.strategy === "email_code",
        );
        if (emailFactor && "emailAddressId" in emailFactor) {
          await signIn.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId: emailFactor.emailAddressId,
          });
        }
      } else if (signUp) {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
      }
      // eslint-disable-next-line
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <SimultanIcon className="size-6" />
              </div>
              <span className="sr-only">Home</span>
            </Link>
            <h1 className="text-xl font-bold">Enter verification code</h1>
            <FieldDescription>
              We sent a 6-digit code to your email address.
            </FieldDescription>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              Verification code
            </FieldLabel>
            <InputOTP
              maxLength={6}
              id="otp"
              value={code}
              onChange={setCode}
              required
              containerClassName="justify-center gap-4"
              disabled={isLoading || !isLoaded}
            >
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription className="text-center">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || !isLoaded}
                className="underline disabled:opacity-50"
              >
                {isResending ? "Resending..." : "Resend"}
              </button>
            </FieldDescription>
          </Field>
          <Field>
            <Button
              type="submit"
              disabled={isLoading || !isLoaded || code.length !== 6}
            >
              {isLoading ? (
                <>
                  <Spinner className="size-3" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      {/* <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription> */}
    </div>
  );
}
