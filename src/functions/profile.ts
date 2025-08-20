"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user";

export async function getProfile(username: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { username: username },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          bio: true,
          image: true,
          location: true,
          website: true,
          createdAt: true,
          _count: {
            select: {
              followers: true,
              following: true,
              posts: true,
            },
          },
        },
      });
  
      return user;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw new Error("Failed to fetch profile");
    }
  }

export async function getUserPosts(userId: string) {
    try {
      const posts = await prisma.post.findMany({
        where: {
          authorId: userId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              location: true,
            },
          },
          location:{
            select:{
              id: true,
              name: true,
              placeId: true,
            }
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
          likes: {
            select: {
              userId: true,
            },
          },
          saves: {
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        
        orderBy: {
          createdAt: "desc",
        },
      });
  
      return posts;
    } catch (error) {
      console.error("Error fetching user posts:", error);
      throw new Error("Failed to fetch user posts");
    }
  }

export async function getUserLikedPosts(userId: string) {
    try {
      const likedPosts = await prisma.post.findMany({
        where: {
          likes: {
            some: {
              userId,
            },
          },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          location:{
            select:{
              id: true,
              name: true,
              placeId: true,
            }
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
          likes: {
            select: {
              userId: true,
            },
          },
          saves: {
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
  
      return likedPosts;
    } catch (error) {
      console.error("Error fetching liked posts:", error);
      throw new Error("Failed to fetch liked posts");
    }
  }

export async function getUserSavedPosts(userId: string) {
    try {
      const savedPosts = await prisma.post.findMany({
        where: {
          saves: {
            some: {
              userId,
            },
          },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          location:{
            select:{
              id: true,
              name: true,
              placeId: true,
            }
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
          likes: {
            select: {
              userId: true,
            },
          },
          saves: {
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
  
      return savedPosts;
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      throw new Error("Failed to fetch saved posts");
    }
  }

export async function updateProfile(form: FormData) {
    try {
      const { userId: clerkId } = await auth();
      if (!clerkId) throw new Error("Unauthorized");
  
      const name = form.get("name") as string;
      const bio = form.get("bio") as string;
      const location = form.get("location") as string;
      const website = form.get("website") as string;
  
      const user = await prisma.user.update({
        where: { clerkId },
        data: {
          name,
          bio,
          location,
          website,
        },
      });
  
      revalidatePath("/profile");
      return { success: true, user };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: "Failed to update profile" };
    }
  }

export async function isFollowing(userId: string) {
    try {
      const currentUserId = await getDbUserId();
      if (!currentUserId) return false;
  
      const follow = await prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: userId,
          },
        },
      });
  
      return !!follow;
    } catch (error) {
      console.error("Error checking follow status:", error);
      return false;
    }
  }

export async function getFollowing(dbUserId: string | null): Promise<string[]> {
    if (!dbUserId) return [];
  
    const follows = await prisma.follows.findMany({
      where: { followerId: dbUserId },
      select: { followingId: true },
    });
  
    return follows.map(f => f.followingId);
  }