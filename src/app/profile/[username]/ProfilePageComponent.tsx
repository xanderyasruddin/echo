"use client"

import PostCard from '@/components/PostCard';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { getProfile, getUserPosts, updateProfile } from '@/functions/profile';
import { toggleFollow } from '@/functions/user';
import { SignInButton, useUser } from '@clerk/nextjs';
import { format } from 'date-fns';
import { Bookmark, CalendarIcon, EditIcon, FileTextIcon, HeartIcon, LinkIcon, MapPinIcon } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

type PostWithRelations = NonNullable<Awaited<ReturnType<typeof getUserPosts>>>[number];
type User = Awaited<ReturnType<typeof getProfile>>;

interface ProfilePageProps {
  user: NonNullable<User>;
  posts: PostWithRelations[];
  likedPosts: PostWithRelations[];
  savedPosts: PostWithRelations[];
  isFollowing: boolean;
}

function ProfilePageComponent({user,posts,likedPosts,savedPosts,isFollowing:initialIsFollowing,}:ProfilePageProps) {
    const { user: currentUser} = useUser();
    const [showEdit, setShowEdit] = useState(false);
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

  // set default bio stats
  const [editForm, setEditForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
  });

  const formattedDate = format(new Date(user.createdAt), "MMMM yyyy")

  const handleEditProfileSubmit = async () => {
    const form = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      form.append(key, value);
    });

    const result = await updateProfile(form);
    if (result.success) {
      setShowEdit(false);
      toast.success("Profile updated successfully!");
    }
  }

  const handleFollow = async () => {
    if (!currentUser) return;

    try {
      setIsUpdatingFollow(true);
      await toggleFollow(user.id);
      setIsFollowing(!isFollowing);
    } catch (error) {
      toast.error("Failed to update follow status");
    } finally {
      setIsUpdatingFollow(false);
    }
  };

  const isOwnProfile =
    currentUser?.username === user.username

  return (
    <div className="mx-auto px-8 max-w-[550px]">
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full max-w-lg mx-auto">
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                {/* avatar */}
                <Avatar className="w-18 h-18">
                  <AvatarImage src={user.image ?? "/avatar.png"} />
                </Avatar>

                {/* username and @ */}
                <h1 className="mt-4 text-2xl font-bold">{user.name ?? user.username}</h1>
                <p className="text-muted-foreground">@{user.username}</p>

                {!currentUser ? (
                  <SignInButton mode="modal">
                    <Button className="w-35 mt-3">Follow</Button>
                  </SignInButton>
                ) : isOwnProfile ? (
                  <Button className="w-35 mt-3" onClick={() => setShowEdit(true)}>
                    <EditIcon className="size-4 mr-1" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    className="w-35 mt-3"
                    onClick={handleFollow}
                    variant={isFollowing ? "outline" : "default"}
                    disabled={isUpdatingFollow}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}

                <div className="w-[80%]">
                    <div className="w-full">
                      <Separator className="my-4" />
                      <div className="flex h-8 items-center space-x-1">
                        <div className="flex-1 text-center">
                          <p className="font-medium">{user._count.following}</p>
                          <p className="text-xs text-muted-foreground">Following</p>
                        </div>
                        <Separator orientation="vertical" />
                        <div className="flex-1 text-center">
                          <p className="font-medium">{user._count.followers}</p>
                          <p className="text-xs text-muted-foreground">Followers</p>
                        </div>
                        <Separator orientation="vertical" />
                        <div className="flex-1 text-center">
                          <p className="font-medium">{user._count.posts}</p>
                          <p className="text-xs text-muted-foreground">Posts</p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                    </div>
                </div>
                
                
                
                {/* under stats info like location website date */}
                <div className="w-[80%] space-y-2 text-sm">
                <p className="flex items-center mb-5">{user.bio}</p>
                  {user.location && (
                    <div className="flex items-center text-muted-foreground mb-4 -mt-2">
                      <MapPinIcon className="size-4 mr-2" />
                      {user.location}
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center text-muted-foreground -mt-2">
                      <LinkIcon className="size-4 mr-2" />
                      <a
                        href={
                          user.website.startsWith("http") ? user.website : `https://${user.website}`
                        }
                        className="hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {user.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center text-muted-foreground">
                    <CalendarIcon className="size-4 mr-2" />
                    Joined {formattedDate}

                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-start rounded-b-xl h-10 -mb-1 -p-2 bg-black">

          {/* profile tab  */}
          <TabsTrigger
            value="posts"
            className="flex rounded-b-l items-center gap-2 border-b-2 border-transparent 
                      data-[state=active]:border-black data-[state=active]:text-black 
                      text-white px-6 font-semibold"
          >
            <FileTextIcon className="size-4" />
            Posts
          </TabsTrigger>

          {/* likes tab  */}
          <TabsTrigger
            value="likes"
            className="flex rounded-b-l items-center gap-2 border-b-2 border-transparent 
                      data-[state=active]:border data-[state=active]:text-black 
                      text-white px-6 font-semibold"
          >
            <HeartIcon className="size-4" />
            Likes
          </TabsTrigger>

          {/* saved locations tab  */}
          <TabsTrigger
            value="saves"
            className="flex rounded-b-l items-center gap-2 border-b-2 border-transparent 
                      data-[state=active]:border data-[state=active]:text-black 
                      text-white px-6 font-semibold"
          >
            <Bookmark className="size-4" />
            Saved
          </TabsTrigger>
        </TabsList>
          <TabsContent value="posts" className="mt-6">
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.id} post={post} dbUserId={user.id} />)
              ) : (
                <div className="text-center py-8 text-muted-foreground">No posts yet</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="likes" className="mt-6">
            <div className="space-y-6">
              {likedPosts.length > 0 ? (
                likedPosts.map((post) => <PostCard key={post.id} post={post} dbUserId={user.id} />)
              ) : (
                <div className="text-center py-8 text-muted-foreground">No liked posts to show</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="saves" className="mt-6">
            <div className="space-y-6">
              {savedPosts.length > 0 ? (
                savedPosts.map((post) => <PostCard key={post.id} post={post} dbUserId={user.id} />)
              ) : (
                <div className="text-center py-8 text-muted-foreground">No saved posts to show</div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        
        {/* edit profile form */}
        <Dialog open={showEdit} onOpenChange={setShowEdit}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  name="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="min-h-[100px]"
                  placeholder="Tell us about yourself"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  name="location"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  placeholder="Where are you based?"
                />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input
                  name="website"
                  value={editForm.website}
                  onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                  placeholder="Your personal website"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleEditProfileSubmit}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
export default ProfilePageComponent;