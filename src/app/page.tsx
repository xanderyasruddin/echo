import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import TrendingLocations from "@/components/TrendingLocations";
import TrendingUsers from "@/components/TrendingUsers";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getPosts } from "@/functions/post";
import { getFollowing } from "@/functions/profile";
import { getDbUserId, getUserAvatar } from "@/functions/user";
import { currentUser } from "@clerk/nextjs/server";
import { AvatarImage } from "@radix-ui/react-avatar";
import { HeartIcon, MessageCircleIcon } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const user = await currentUser();
  const posts = await getPosts();
  const dbUserId = await getDbUserId();
  const followingUserIds = await getFollowing(dbUserId);
  const followingPosts = posts.filter(
    post => followingUserIds.includes(post.authorId) || post.authorId === dbUserId);
  const meTheOwnerWow = await getUserAvatar("xanderyas");

  return (
    <div className="grid grid-cols-1 md:grid-cols-14 gap-0.5 ">
      <div className="hidden md:block md:col-span-5 xl:col-span-3 pl-8">
        <div className="sticky top-20">
        <Sidebar />
        </div>
      </div>
      <div className="md:col-span-9 xl:col-span-11 ">

    <div className="grid grid-cols-1 xl:grid-cols-10 ">
      <div className="lg:col-span-6 md:col-span-8 xl:col-span-7">
        <div className="max-w-3xl mx-auto px-8">

          <div className="space-y-6 ">
            {!user ? (
              // owners note
            <Card className='overflow-hidden'>
            <CardContent className='px-6'>
                <div className="space-y-3">
                    <div className='flex'>
                        <div className="flex-1 min-w-0">
    
                          {/* top section div */}
                            <div className="flex items-start justify-between">
    
                              {/* profile, username date */}
                              <div className="flex flex-row space-x-2">
                                 <Link href={`/profile/xanderyas`}>
                                  <Avatar className='w-8 h-8 mr-1'>
                                      <AvatarImage src={meTheOwnerWow.image || "/avatar.png"}  />
                                  </Avatar>
                                </Link>
                                <Link className="text-s mt-0.5 duration-200 hover:text-gray-500" href={`/profile/xanderyas`}>xanderyas</Link>
                                </div>
                              </div>
                              </div>
                            </div>
                            <div className='ml-11 mr-10'>
                            {/* title */}
                            <div className='text-xl font-bold'>The Echo Group</div>
                            
                            {/* content */}
                            <p className="mt-2 mb-4 text-sm text-foreground break-words">
                              Welcome to Echo! 
                              <br />
                              <br />
                              Hey there, I'm Xander, the owner of Echo. I developed this platform because 
                              I got tired of going through my friends' Notes apps to see reviews of
                              their unemployed activities. I hope you enjoy our community, full of curious 
                              people who love sharing their favourite spots, whether it's a Michelin-star 
                              restaurant, a cozy local pub, or one of those hidden gems only you and your 
                              friends know.
                              <br />
                              <br />
                              Thank you for visiting and and I can't wait to hear your Echoes!</p>
                          
                            {/* rating */}
                            <p className="text-xs text-muted-foreground">Rating</p>
                              <div className='text-2xl font-bold mb-4'>5
                                <span className='text-sm font-normal text-muted-foreground'> / 5</span>
                              </div>
                            </div>
                            {/* image */}   
                            
                            <Separator className="mt-3 mb-2" orientation="horizontal"/>
                            
                            {/* like and comment buttons */}
                            <div className="flex items-center pt-2 ml-11 space-x-3">
                              <HeartIcon className="size-5 fill-red-500 text-red-500" />
                            </div>                      
                    </div>
            </CardContent>
        </Card>
            ) : followingPosts.length > 0 ? (
              followingPosts.map((post) => (
                <PostCard key={post.id} post={post} dbUserId={dbUserId} />
              ))
            ) : (
              // card that occurs when user follows no one
              <Card className='overflow-hidden'>
                <CardContent className='px-6'>
                  <div className="space-y-3">
                    <div className='flex'>
                        <div className="flex-1 min-w-0">
    
                          {/* top section div */}
                              </div>
                            </div>
                            <div className='ml-11 mr-10'>
                            {/* title */}
                            <div className='text-xl font-bold'>Make a Review!</div>
                            
                            {/* content */}
                            <p className="mt-2 mb-4 text-sm text-foreground break-words">
                            Make sure to follow people as well, so you can discover new spots and experiences!
                            </p>

                            </div>
                            {/* image */}   
                            
                  
                    </div>
                </CardContent>
              </Card>
            )}
            
          </div>
        </div>
      </div>

      <div className="hidden xl:flex xl:flex-col xl:col-span-3 sticky top-20 mr-10">
        <TrendingUsers />
        <TrendingLocations />
      </div>
    </div>                    
    </div>
    </div>
  );
}
