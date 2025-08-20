"use server";

import prisma from "@/lib/prisma";

export async function getLocationProfile(placeId: string) {
    try {
      const location = await prisma.location.findUnique({
        where: { placeId: placeId },
        select: {
          id: true,
          placeId: true,
          name: true,
          address: true,
          latitude: true,
          longitude: true,
          sumOfRatings: true,
          numberOfRatings: true,
          types: true,
          _count: {
            select: {
                posts: true,
            }
          }
        }
      });
  
      return location;
    } catch (error) {
        console.error("Error fetching location", error);
        throw new Error("Failed to fetch location");
    }
  }

export async function getTrendingLocations(limit: number = 3) {
    try {
      const locations = await prisma.location.findMany({
        orderBy: {
          numberOfRatings: "desc",
        },
        take: limit,
        select: {
          id: true,
          placeId: true,
          name: true,
          address: true,
          sumOfRatings: true,
          numberOfRatings: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });
  
      return locations;
    } catch (error) {
      console.error("Error fetching trending locations:", error);
      return [];
    }
  }

export async function getLocationPosts(locationId: string) {
    try {
      const posts = await prisma.post.findMany({
        where: {
          locationId: locationId,
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
      console.error("Error fetching location posts:", error);
      throw new Error("Failed to fetch location posts");
    }
  }
