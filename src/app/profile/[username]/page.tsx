import { getProfile, getUserLikedPosts, getUserPosts, getUserSavedPosts, isFollowing } from '@/functions/profile';
import { notFound } from 'next/navigation';
import React from 'react'
import ProfilePageComponent from './ProfilePageComponent';

async function ProfilePage({ params }: { params: { username: string} }) {
  const user = await getProfile(params.username);

  if (!user) notFound();

  const [posts, likedPosts, savedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    getUserSavedPosts(user.id),
    isFollowing(user.id),
  ]);
  
  return (
  <ProfilePageComponent
    user={user}
    posts={posts}
    likedPosts={likedPosts}
    savedPosts={savedPosts}
    isFollowing={isCurrentUserFollowing}
  />
  );
}

export default ProfilePage