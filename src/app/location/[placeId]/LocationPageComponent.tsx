'use client';

import React, { useMemo, useState } from 'react';
// import PostCard from '@/components/PostCard';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Bookmark, FileTextIcon } from 'lucide-react';
import { SignInButton, useUser } from '@clerk/nextjs';
import { toggleSave } from '@/functions/location';
import { Button } from '@/components/ui/button';

interface Location {
  id: string;
  name: string;
  address: string;
  numberOfRatings: number;
  sumOfRatings: number;
  saves?: { userId: string }[];
  _count?: { posts?: number };
}

interface LocationPageProps {
  location: Location;
  dbUserSaves: Save[];
}

interface Save {
  locationId: string;
}


function LocationPageComponent({ location, dbUserSaves }: LocationPageProps) {
  const { user } = useUser();
  const alreadySaved = useMemo(
    () => !!dbUserSaves?.some(save => save.locationId === location.id),
    [dbUserSaves, location.id]
  );

  const [hasSaved, setHasSaved] = useState(alreadySaved);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
  if (!user || isSaving) return;
  }
  setIsSaving(true);
  return (
    <div className="mx-auto px-8 max-w-[550px]">
      <div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full max-w-lg mx-auto">
          <Card>
            <CardContent className="pt-2">
              {/* title and address */}
              <div className="flex flex-col items-center text-center">
                <div className="inline-block text-left w-[80%]">
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
                          : '-'}
                      </p>
                      <p className="text-xs text-muted-foreground">Overall Rating</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                </div>

                {/* bookmark icon */}
                {/* <div className="flex items-center pt-2 ml-8.5">
                        {user ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`text-muted-foreground gap-2 ${
                              hasSaved ? "text-red-500 hover:text-red-600" : "hover:text-red-500"
                            }`}
                            onClick={handleSave}
                          >
                            {hasSaved ? (
                              <Bookmark className="size-5 fill-current" />
                            ) : (
                              <Bookmark className="size-5" />
                            )}
                          </Button>
                        ) : (
                          <SignInButton mode="modal">
                            <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
                              <Bookmark className="size-5" />
                            </Button>
                          </SignInButton>
                        )}
                </div> */}

              </div>
            </CardContent>
          </Card>

          {/* <div className="w-full flex justify-center rounded-xl h-10 -p-2 bg-white mt-7">
            <div className="flex items-center space-x-2 font-semibold">
              <FileTextIcon className="size-4" />
              <p>Posts</p>
            </div>
          </div>

          <div className="space-y-6 mt-7">
            {posts.length > 0 ? (
              posts.map(post => <PostCard key={post.id} post={post} dbUserId={post.author.id} />)
            ) : (
              <div className="text-center py-8 text-muted-foreground">No posts yet</div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default LocationPageComponent;