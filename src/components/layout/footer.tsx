
export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} LISGE. All rights reserved.</p>
        <p className="mt-1">
          Local and International Scholars' Guide to Excellence.
        </p>
        {/* Placeholder for social media links if needed in the future */}
        {/* <div className="mt-2 space-x-4">
          <a href="#" className="hover:text-primary">Facebook</a>
          <a href="#" className="hover:text-primary">LinkedIn</a>
          <a href="#" className="hover:text-primary">Instagram</a>
        </div> */}
      </div>
    </footer>
  );
}
