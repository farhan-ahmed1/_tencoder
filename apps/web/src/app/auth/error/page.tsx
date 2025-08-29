"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@tencoder/ui";

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "Unable to sign in.",
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-destructive">
          Authentication Error
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-muted-foreground">
            {error && errorMessages[error]
              ? errorMessages[error]
              : errorMessages.Default}
          </p>
        </div>
        <Link
          href="/auth/signin"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium transition-colors inline-flex items-center justify-center"
        >
          Try Again
        </Link>
      </CardContent>
    </Card>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense
        fallback={
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Loading...</CardTitle>
            </CardHeader>
          </Card>
        }
      >
        <AuthErrorContent />
      </Suspense>
    </div>
  );
}
