
"use client";

import Link from 'next/link';
import { Menu, BookOpen, GraduationCap, Lightbulb, Briefcase, HeartHandshake, School2, Globe2, Mail, Library, LogIn, LogOut, UserPlus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const mainNavLinks = [
  { href: '/', label: 'Home', icon: BookOpen },
  { href: '/tips', label: 'Study Tips', icon: Lightbulb },
  { href: '/scholarships', label: 'Scholarships', icon: GraduationCap },
  { href: '/exchange-programs', label: 'Exchange Programs', icon: Globe2 },
  { href: '/programs', label: 'Summer Programs', icon: Briefcase },
  { href: '/volunteer', label: 'Volunteer', icon: HeartHandshake },
  { href: '/pre-college', label: 'Pre-College', icon: School2 },
  { href: '/resources', label: 'Resources', icon: Library },
  { href: '/contact', label: 'Contact', icon: Mail },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redirect to homepage after logout
    } catch (error) {
      console.error("Logout error:", error);
      // Handle logout error (e.g., show a toast notification)
    }
  };
  
  const NavLinkItem = ({ href, label, icon: Icon, isMobile = false, onClick }: { href: string, label: string, icon: React.ElementType, isMobile?: boolean, onClick?: () => void }) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    const linkClass = cn(
      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary",
      isActive ? "bg-primary/10 text-primary" : "text-foreground/80 hover:text-foreground",
      isMobile ? "text-base" : ""
    );

    if (isMobile) {
      return (
        <SheetClose asChild>
          <Link href={href} className={linkClass} onClick={onClick}>
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        </SheetClose>
      );
    }
    
    if (onClick) {
         return (
            <button onClick={onClick} className={linkClass}>
                <Icon className="h-4 w-4" />
                {label}
            </button>
        );
    }

    return (
      <Link href={href} className={linkClass}>
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
  };

  const getAvatarFallback = (email: string | null | undefined) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  const mobileNavLinks = [...mainNavLinks];
  if (!loading) {
    if (user) {
      if (isAdmin) {
        mobileNavLinks.push({ href: '/admin', label: 'Admin Dashboard', icon: ShieldCheck });
      }
      // mobileNavLinks.push({ href: '#logout', label: 'Logout', icon: LogOut, onClick: handleLogout });
    } else {
      mobileNavLinks.push({ href: '/login', label: 'Login', icon: LogIn });
      mobileNavLinks.push({ href: '/signup', label: 'Sign Up', icon: UserPlus });
    }
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-primary font-headline">
          LISGE
        </Link>
        <nav className="hidden items-center space-x-1 md:flex">
          {mainNavLinks.map((link) => (
            <NavLinkItem key={link.href} {...link} />
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {loading ? (
            <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6 animate-pulse" />
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || "User"} />
                    <AvatarFallback>{getAvatarFallback(user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.displayName || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-1">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs p-6">
                <nav className="flex flex-col space-y-4">
                  {mobileNavLinks.map((link) => (
                     <NavLinkItem 
                        key={link.href} 
                        href={link.href}
                        label={link.label}
                        icon={link.icon}
                        // @ts-ignore next-line
                        onClick={link.onClick}
                        isMobile={true} 
                      />
                  ))}
                  {/* Specific handling for logout in mobile if not part of mobileNavLinks logic */}
                   {!loading && user && (
                     <SheetClose asChild>
                        <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-primary/10">
                            <LogOut className="h-5 w-5" />
                            Logout
                        </Button>
                     </SheetClose>
                   )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
