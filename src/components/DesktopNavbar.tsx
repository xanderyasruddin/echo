import { BellIcon, HomeIcon, UserIcon, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import ModeToggle from "./ModeToggle";
import { currentUser } from "@clerk/nextjs/server";

async function DesktopNavbar() {
  const user = await currentUser();
  
  return (
    <div className="hidden md:flex items-center space-x-4">
     {/* <ModeToggle /> */}

      {user ? (
          <>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href="/review">
              <CirclePlus className="w-4 h-4" />
              <span className="hidden lg:inline">Review</span>
            </Link>
          </Button>

          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href="/notifications">
              <BellIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Notifications</span>
            </Link>
          </Button>
          
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link
              href={`/profile/${
                user.username ?? user.emailAddresses[0].emailAddress.split("@")[0]
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Profile</span>
            </Link>
          </Button>
          <UserButton />
        </>
      ) : (
        <SignInButton mode="modal">
          <Button variant="default">Sign Up / Log In</Button>
        </SignInButton>
      )}
    </div>
  );
}
export default DesktopNavbar;
