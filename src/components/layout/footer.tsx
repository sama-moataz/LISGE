
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} LISGE. All rights reserved.</p>
        <p className="mt-1">
          Local and International Scholars' Guide to Excellence.
        </p>
        <div className="mt-4 space-x-4">
          <Link href="/privacy-policy" className="hover:text-primary">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:text-primary">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
