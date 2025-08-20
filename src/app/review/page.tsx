"use client";

import CreatePost from "@/components/CreatePost";
import { useRouter } from "next/navigation";

export default function ReviewPage() {
  const router = useRouter();

  const backToHomie = () => {
    router.push("/");
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-black" />
  
      <div className="relative w-full max-w-[550px] rounded-lg shadow-xl bg-white p-6 m-10">
        <h1 className="text-xl font-bold mb-4">New Review</h1>
        <CreatePost onSuccess={backToHomie} />
      </div>
    </div>
  );  
}