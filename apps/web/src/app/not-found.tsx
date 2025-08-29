import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@tencoder/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-muted-foreground">
            404 - Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium transition-colors inline-flex items-center justify-center"
            >
              Go Home
            </Link>
            <Link
              href="/projects"
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md font-medium transition-colors inline-flex items-center justify-center"
            >
              View Projects
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
