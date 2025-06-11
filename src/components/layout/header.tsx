
"use client";

import Link from 'next/link';
import { Menu, BookOpen, GraduationCap, Lightbulb, Briefcase, HeartHandshake, School2, Globe2, Mail, Library, LogIn, LogOut, UserPlus, LayoutDashboard } from 'lucide-react';
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
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


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
  const { user, userProfile, loading } = useAuth(); // Removed isAdmin, use userProfile.role

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/'); 
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  const NavLinkItem = ({ href, label, icon: Icon, isMobile = false, action, disabled = false }: { href?: string, label: string, icon: React.ElementType, isMobile?: boolean, action?: () => void, disabled?: boolean }) => {
    const isActive = href ? (pathname === href || (href !== '/' && pathname.startsWith(href))) : false;
    const linkClass = cn(
      "flex items-center w-full text-left gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary",
      isActive ? "bg-primary/10 text-primary" : "text-foreground/80 hover:text-foreground",
      isMobile ? "text-base" : "",
      disabled ? "opacity-50 cursor-not-allowed" : ""
    );

    const content = (
      <>
        <Icon className={cn("h-4 w-4", isMobile && "h-5 w-5")} />
        {label}
      </>
    );

    if (action) {
      return (
        <button onClick={action} className={linkClass} disabled={disabled}>
          {content}
        </button>
      );
    }
    
    if (href) {
      if (isMobile) {
        return (
          <SheetClose asChild>
            <Link href={href} className={linkClass}>
              {content}
            </Link>
          </SheetClose>
        );
      }
      return (
        <Link href={href} className={linkClass}>
          {content}
        </Link>
      );
    }
    
    return <div className={linkClass}>{content}</div>; // Fallback for items without href or action
  };

  const getAvatarFallback = () => {
    if (userProfile?.name) return userProfile.name.substring(0, 2).toUpperCase();
    if (userProfile?.email) return userProfile.email.substring(0, 2).toUpperCase();
    return "U";
  };

  const mobileNavLinksConfig = [...mainNavLinks];
  if (!loading) {
    if (user) {
      mobileNavLinksConfig.unshift({ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard });
    } else {
      mobileNavLinksConfig.push({ href: '/auth/login', label: 'Login', icon: LogIn });
      mobileNavLinksConfig.push({ href: '/auth/signup', label: 'Sign Up', icon: UserPlus });
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
            <NavLinkItem key={link.href} href={link.href} label={link.label} icon={link.icon} />
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {loading ? (
             <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6 animate-pulse" />
                </Button>
             </div>
          ) : user && userProfile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={userProfile.photoURL || `https://avatar.iran.run/public/boy?username=${userProfile.email || userProfile.uid}`} alt={userProfile.name || "User"} />
                    <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userProfile.name || userProfile.email?.split('@')[0]}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userProfile.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-1">
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" disabled={loading}>
                  {loading ? <Loader2 className="h-6 w-6 animate-spin"/> : <Menu className="h-6 w-6" />}
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs p-4">
                <nav className="flex flex-col space-y-2 mt-4">
                  {mobileNavLinksConfig.map((link) => (
                     <NavLinkItem 
                        key={link.label} 
                        href={link.href}
                        label={link.label}
                        icon={link.icon}
                        isMobile={true} 
                      />
                  ))}
                   {!loading && user && (
                     <SheetClose asChild>
                        <NavLinkItem 
                            label="Logout"
                            icon={LogOut}
                            action={handleLogout}
                            isMobile={true} 
                        />
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
