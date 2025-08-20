"use client";

import {
  BellIcon,
  CirclePlus,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth, SignInButton, SignOutButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Link from "next/link";

function MobileNavbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isSignedIn } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex md:hidden items-center space-x-2">
      {/*
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="mr-2"
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      */}
      <div className="flex">
        <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href="/review">
              <CirclePlus className="w-4 h-4" />
              <span className="hidden lg:inline">Review</span>
            </Link>
          </Button>

      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-5 w-5" /> 
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-4">
            <Button 
            variant="ghost" 
            className="flex items-center gap-3 justify-start" 
            onClick={() => setShowMobileMenu(false)}
            asChild>
              <Link href="/">
                <HomeIcon className="w-4 h-4" />
                Home
              </Link>
            </Button>

            {isSignedIn ? (
              <>
                <Button 
                variant="ghost" 
                className="flex items-center gap-3 justify-start"
                onClick={() => setShowMobileMenu(false)}
                asChild>
                  <Link href="/notifications">
                    <BellIcon className="w-4 h-4" />
                    Notifications
                  </Link>
                </Button>
                <Button 
                variant="ghost" 
                className="flex items-center gap-3 justify-start"
                onClick={() => setShowMobileMenu(false)}
                asChild>
                  <Link href="/profile">
                    <UserIcon className="w-4 h-4" />
                    Profile
                  </Link>
                </Button>
                <SignOutButton>
                  <Button 
                  variant="ghost" 
                  className="flex items-center gap-3 justify-start w-full"
                  onClick={() => setShowMobileMenu(false)}
                  >
                    <LogOutIcon className="w-4 h-4" />
                    Logout
                  </Button>
                </SignOutButton>
              </>
            ) : (
              <SignInButton mode="modal">
                <div className="mx-5">
                <Button variant="default" className="w-full ">
                  Sign Up / Log In
                </Button>
                </div>
              </SignInButton>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
    </div>
  );
}

export default MobileNavbar;
