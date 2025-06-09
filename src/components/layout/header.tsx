
"use client";

import Link from 'next/link';
import { Menu, BookOpen, GraduationCap, Lightbulb, Users, UserCircle, Mail, Briefcase, HeartHandshake, School2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', icon: BookOpen },
  { href: '/scholarships', label: 'Scholarships', icon: GraduationCap },
  { href: '/tips', label: 'Study Tips', icon: Lightbulb },
  { href: '/programs', label: 'Summer Programs', icon: Briefcase },
  { href: '/volunteer', label: 'Volunteer', icon: HeartHandshake },
  { href: '/pre-college', label: 'Pre-College', icon: School2 },
  { href: '/about', label: 'About', icon: UserCircle },
  { href: '/contact', label: 'Contact', icon: Mail },
];

export function Header() {
  const pathname = usePathname();

  const NavLinkItem = ({ href, label, icon: Icon, isMobile = false }: { href: string, label: string, icon: React.ElementType, isMobile?: boolean }) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    const linkClass = cn(
      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary",
      isActive ? "bg-primary/10 text-primary" : "text-foreground/80 hover:text-foreground",
      isMobile ? "text-base" : ""
    );

    if (isMobile) {
      return (
        <SheetClose asChild>
          <Link href={href} className={linkClass}>
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        </SheetClose>
      );
    }

    return (
      <Link href={href} className={linkClass}>
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-primary font-headline">
          LISGE
        </Link>
        <nav className="hidden items-center space-x-1 md:flex">
          {navLinks.map((link) => (
            <NavLinkItem key={link.href} {...link} />
          ))}
        </nav>
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
                {navLinks.map((link) => (
                   <NavLinkItem key={link.href} {...link} isMobile={true} />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
