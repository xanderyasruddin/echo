"use server";
import prisma from "@/lib/prisma";
import { getDbUserId } from "./user";
import { revalidatePath } from "next/cache";

type LocationDetails = {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export async function createPost(
  content: string,
  imageUrl: string,
  rating: number | null,
  location: LocationDetails
) {
  try {
    const userId = await getDbUserId();

    if (!location || !location.placeId) {
      throw new Error("Location is required.");
    }
    if (!userId) return;
    let existingLocation = await prisma.location.findUnique({
      where: { placeId: location.placeId },
    });

    if (!existingLocation) {
      existingLocation = await prisma.location.create({
        data: {
          placeId: location.placeId,
          name: location.name,
          address: location.address,
          latitude: location.lat,
          longitude: location.lng,
          sumOfRatings: rating ?? 0,
          numberOfRatings: rating ? 1 : 0,
        },
      });
    } else if (rating) {
 
      await prisma.location.update({
        where: { id: existingLocation.id },
        data: {
          sumOfRatings: { increment: rating },
          numberOfRatings: { increment: 1 },
        },
      });
    }

    const post = await prisma.post.create({
      data: {
        content,
        image: imageUrl,
        authorId: userId,
        locationId: existingLocation.id,
        rating: rating ?? null,
      },
    });

    revalidatePath("/");

    return { success: true, post };
  } catch (error) {
    console.error("Error to create post:", error);
    return { success: false, error: "Failed to create post" };
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include:{
        author:{
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        comments:{
          orderBy: { createdAt: "asc" },
          include:{
            author:{
              select:{
                id: true,
                name: true,
                image: true,
                username: true,
              },
            },
          },
        },
        likes: {
          select:{
            userId: true
          },
        },
        saves: {
          select:{
            userId: true
          },
        },
        location:{
          select:{
            id: true,
            name: true,
            placeId: true,
            address: true,
          }
        },
        _count:{
          select:{
            likes: true,
            comments: true,
            saves: true,
          }
        },
      }
    });

    return posts;
  } catch (error) {
    console.log("Error in getPosts", error);
    return [];
  }
}

export async function toggleLike(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    // check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          postId,
          userId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found");

    if (existingLike) {
      // to unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            postId,
            userId,
          },
        },
      });
    } else {
      // to like and create notification
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: "LIKE",
                  userId: post.authorId,
                  creatorId: userId,
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle like:", error);
    return { success: false, error: "Failed to toggle like" };
  }
}

export async function toggleSave(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    // check if save exists
    const existingSave = await prisma.save.findUnique({
      where: {
        userId_postId: {
          postId,
          userId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found");

    if (existingSave) {
      // to unsave
      await prisma.save.delete({
        where: {
          userId_postId: {
            postId,
            userId,
          },
        },
      });
    } else {
      // to save and create notification
      await prisma.$transaction([
        prisma.save.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: "SAVE",
                  userId: post.authorId,
                  creatorId: userId,
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle like:", error);
    return { success: false, error: "Failed to toggle like" };
  }
}

export async function createComment(postId: string, content: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;
    if (!content) throw new Error("Content is required");

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found");

    // Create comment and notification in a transaction
    const [comment] = await prisma.$transaction(async (tx) => {
      // Create comment first
      const newComment = await tx.comment.create({
        data: {
          content,
          authorId: userId,
          postId,
        },
      });

      // Create notification if commenting on someone else's post
      if (post.authorId !== userId) {
        await tx.notification.create({
          data: {
            type: "COMMENT",
            userId: post.authorId,
            creatorId: userId,
            postId,
            commentId: newComment.id,
          },
        });
      }

      return [newComment];
    });

    revalidatePath(`/`);
    return { success: true, comment };
  } catch (error) {
    console.error("Failed to create comment:", error);
    return { success: false, error: "Failed to create comment" };
  }
}

export async function deleteComment(commentId: string) {
  try {
    const userId = await getDbUserId();

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true, postId: true },
    });

    if (!comment) throw new Error("Comment not found");
    if (comment.authorId !== userId) throw new Error("Unauthorized - no delete permission");

    await prisma.comment.delete({
      where: { id: commentId }
    });

    await revalidatePath(`/posts/${comment.postId}`)

    return { success: true };
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return { success: false, error: "Failed to delete comment" };
  }
}

export async function deletePost(postId: string) {
  try {
    const userId = await getDbUserId();

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, rating: true, locationId: true},
    });

    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId) throw new Error("Unauthorized");

    if (post.rating) {
      await prisma.location.update({
        where: { id: post.locationId },
        data: {
          sumOfRatings: { decrement: post.rating },
          numberOfRatings: { decrement: 1 },
        },
      });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}