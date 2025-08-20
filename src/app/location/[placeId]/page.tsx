import PostCard from '@/components/PostCard';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getLocationPosts, getLocationProfile } from '@/functions/location';
import { Bookmark, FileTextIcon } from 'lucide-react';
import React from 'react'

type Posts = Awaited<ReturnType<typeof getLocationPosts>>;

async function LocationPage({ params }: { params: { placeId: string } }) {
  const { placeId } = params;
  const location = await getLocationProfile(placeId);
  
  if (!location) {
    return <div>Location not found</div>;
  }

  const posts: Posts = await getLocationPosts(location.id);

  return (
    <div className="mx-auto px-8 max-w-[550px]">
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full max-w-lg mx-auto">
    <Card>
      <CardContent className='pt-2'>

        {/* title and address */}
        <div className="flex flex-col items-center text-center">
          <div className='inline-block text-left w-[80%]'>
            <h3 className="mt-4 text-2xl font-bold">{location.name}</h3>
            <p className="text-sm text-muted-foreground">{location.address}</p>
            </div>
          <div className="w-[80%]">
            <Separator className="my-4" />

            <div className="flex h-8 items-center space-x-1">
              <div className="flex-1 text-center">
                <p className="font-medium">{location._count?.posts || 0}</p>
                <p className="text-xs text-muted-foreground">Reviews</p>
              </div>

              <Separator orientation="vertical" />

              <div className="flex-1 text-center">
                <p className="font-medium">
                  {location.numberOfRatings > 0
                  ? (location.sumOfRatings / location.numberOfRatings).toFixed(1)
                : '-'}</p>
                <p className="text-xs text-muted-foreground">Overall Rating</p>
              </div>
            </div>
            <Separator className="my-4" />
          </div>

          {/* <div className='m-2'>< Bookmark /></div> */}
        </div>
      </CardContent>
    </Card>
    <div className='w-full flex justify-center rounded-xl h-10 -p-2 bg-white mt-7'>
        <div className='flex items-center space-x-2 font-semibold'>
          <FileTextIcon className="size-4" />
          <p>Posts</p>
        </div>
    </div>

    <div>
    <div className="space-y-6 mt-7">
              {posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.id} post={post} dbUserId={post.author.id} />)
              ) : (
                <div className="text-center py-8 text-muted-foreground">No posts yet</div>
              )}
            </div>
    </div>
    </div>
    </div> 
    </div>   
  );
}

export default LocationPage;