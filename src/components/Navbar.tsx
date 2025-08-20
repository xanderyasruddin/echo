import Link from "next/link";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/functions/user";

async function Navbar() {
  const user = await currentUser();

  if(user) await syncUser();

  return (
    <nav className="fixed top-0 w-full border-b bg-background/100 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary font-mono m-10 tracking-wider">
              Echo
            </Link>
          </div>

          <div className="m-10">
            <DesktopNavbar />
            <MobileNavbar />
          </div>
          
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
