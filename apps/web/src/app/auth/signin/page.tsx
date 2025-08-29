"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@tencoder/ui";
import { config } from "@/lib/config";

export default function SignInPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome Back!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-muted-foreground">You are signed in as:</p>
              <p className="font-medium">{session.user?.email}</p>
              {session.user?.name && (
                <p className="text-sm text-muted-foreground">
                  {session.user.name}
                </p>
              )}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2 rounded-md font-medium transition-colors"
            >
              Sign Out
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In to _tencoder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.singleUserMode ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Single user mode is enabled. Click to continue as the default
                  user.
                </p>
              </div>
              <button
                onClick={() => signIn("credentials", { callbackUrl: "/" })}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Continue as Admin
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Choose your sign-in method
                </p>
              </div>
              <button
                onClick={() => signIn("github", { callbackUrl: "/" })}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Sign in with GitHub
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
