import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
 
export default function NotFound() {
  return (
    <div className="fixed inset-0 flex justify-center items-center overflow-hidden bg-gradient-to-r from-gray-600 to-black">
      <div className='m10 '>
      <p className='font-bold text-xl mb-3 text-white'>404 Not Found</p>
        <Button className="hover:bg-gray-600">
            <Link href="/">
                <div className="flex space-x-2">
                    <HomeIcon className="flex w-4 h-4 mt-0.5" />
                    <span>Return Home</span>
                </div>
            </Link>
        </Button>
        </div>
    </div>
  )
}