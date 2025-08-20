"use client";

import { createComment, deleteComment, deletePost, getPosts, toggleLike, toggleSave } from '@/functions/post';
import { SignInButton, useUser } from '@clerk/nextjs';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Card, CardContent } from './ui/card';
import Link from 'next/link';
import { Avatar, AvatarImage } from './ui/avatar';
import { DeleteAlertDialog } from './DeleteAlertDialog';
import { Separator } from './ui/separator';
import { sincePosted } from '@/functions/time';
import { Button } from './ui/button';
import { Bookmark, HeartIcon, LogInIcon, MessageCircleIcon, MessageSquare, SendIcon } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { es } from 'date-fns/locale';

// this defines a type alias called Posts, in Posts is resolved data from getPosts
type Posts = Awaited<ReturnType<typeof getPosts>>

// returns the type of one item in Posts
type Post = Posts[number]

function PostCard({post,dbUserId} : {post:Post; dbUserId: string | null}) {
    const { user } = useUser();
    const [newComment, setNewComment] = useState("");
    const [isCommenting, setIsCommenting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [hasLiked, setHasLiked] = useState(post.likes.some(like => like.userId === dbUserId));
    const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);
    const [isSaving, setIsSaving] = useState(false);
    const [hasSaved, setHasSaved] = useState(post.saves?.some(save => save.userId === dbUserId) ?? false);
    const [optimisticSaves, setOptimisticSaves] = useState(post._count.saves);
    const [showComments, setShowComments] = useState(false);

    const handleLike = async () => {
        if(isLiking) return
        
        try {
            setIsLiking(true)
            setHasLiked(prev => !prev)
            setOptimisticLikes(prev => prev + (hasLiked ? -1 : 1))
            await toggleLike(post.id)
        } catch (error) {
            // likes dont change if error thrown
            setOptimisticLikes(post._count.likes)

            // sets the function if user (verified by dB) has already liked it
            setHasLiked(post.likes.some(like => like.userId === dbUserId))
            
        }   finally {
            setIsLiking(false)
        }
    }

    const handleSave = async () => {
      if(isSaving) return
      
      try {
          setIsSaving(true)
          setHasSaved(prev => !prev)
          setOptimisticSaves(prev => prev + (hasSaved ? -1 : 1))
          await toggleSave(post.id)
      } catch (error) {
          setOptimisticSaves(post._count.saves)

          // sets the function if user (verified by dB) has already liked it
          setHasSaved(post.saves.some(save => save.userId === dbUserId))
          
      }   finally {
          setIsSaving(false)
      }
  }
    
    const handleAddComment = async () => {
        if (!newComment.trim() || isCommenting) return;
        try {
          setIsCommenting(true);
          const result = await createComment(post.id, newComment);
          if (result?.success) {
            toast.success("Comment posted successfully");
            setNewComment("");
          }
        } catch (error) {
          toast.error("Failed to add comment");
        } finally {
          setIsCommenting(false);
        }
      };

      const handleDeletePost = async () => {
        if (isDeleting) return;
        try {
          setIsDeleting(true);
          const result = await deletePost(post.id);
          if (result.success) toast.success("Post deleted successfully");
          else throw new Error(result.error);
        } catch (error) {
          toast.error("Failed to delete post");
        } finally {
          setIsDeleting(false);
        }
      };

      const handleDeleteComment = async (commentId: string) => {
        if (isDeleting) return;
        try {
          setIsDeleting(true);
          const result = await deleteComment(commentId);
          if (result.success) toast.success("Comment deleted successfully");
          else throw new Error(result.error);
        } catch (error) {
          toast.error("Failed to delete comment");
        } finally {
          setIsDeleting(false);
        }
      };



    return (
    <Card className='overflow-hidden'>
        <CardContent className='px-6'>
            <div className="space-y-7">
                <div className='flex'>
                    <div className="flex-1 min-w-0">

                      {/* top section div */}
                        <div className="flex items-start justify-between">

                          {/* profile, username date */}
                          <div className="flex flex-row space-x-2">
                             <Link href={`/profile/${post.author.username}`}>
                              <Avatar className='w-8 h-8 mr-1'>
                                  <AvatarImage src={post.author.image || "/avatar.png"} />
                              </Avatar>
                            </Link>
                            <Link className=
                            "text-s mt-0.5 duration-200 hover:text-gray-500" 
                            href={`/profile/${post.author.username}`}
                            >{post.author.username}
                            </Link>
                            <div className="text-xs mt-1.5 text-muted-foreground space-x-2">
                              <span>•</span>                 
                              <span>{sincePosted(new Date(post.createdAt))} </span>
                            </div>
                          </div>

                          {/* remove post icon */}
                          <div className='mt-1'>
                            {dbUserId === post.author.id && (
                            <DeleteAlertDialog
                            id={post.id}
                            isDeleting={isDeleting}
                            onDelete={() => handleDeletePost()}
                            title="Delete Post"
                            description="This action cannot be undone."
                          />
                            )}
                            </div>
                        </div>
                        <div className='ml-11 mr-10'>
                          <div className='flex flex-col'>
                          
                        {/* location */}
                        <Link 
                        className="text-xl font-bold mt-2 duration-200 hover:text-gray-500" 
                        href={`/location/${post.location.placeId}`}>
                        {post.location.name}
                        </Link>
                        
                        {/* address */}
                        <Link className="text-sm text-muted-foreground duration-200 hover:text-gray-500" href={`/location/${post.location.placeId}`}>{post.location.address}</Link>
                        </div>
                        {/* content */}
                        <p className="mt-4 mb-6 text-sm text-foreground break-words">{post.content}</p>

                        
                      
                        {/* rating */}
                        <p className="text-xs text-muted-foreground">Rating</p>
                        <div className='text-2xl font-bold mb-4'>
                        {post.rating !== null && post.rating !== undefined ? (
                          post.rating
                        ) : (
                          <span className="font-normal">-</span>
                        )}
                            <span className='text-sm font-normal text-muted-foreground'> / 5</span>
                          </div>
                        </div>
                        {/* image */}
                        {post.image && (
                            <div className='rounded-lg overflow-hidden'>
                              <img src={post.image} alt="Post ccontent" className='w-full h-auto object-cover' />

                            </div>
                          )}
                        
                        
                        <Separator className="mt-3 mb-2" orientation="horizontal"/>
                        
                        {/* like and comment buttons */}
                        <div className='flex justify-between items center'>
                        <div className="flex items-center pt-2 ml-8.5">
                        {user ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`text-muted-foreground gap-2 ${
                              hasLiked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"
                            }`}
                            onClick={handleLike}
                          >
                            {hasLiked ? (
                              <HeartIcon className="size-5 fill-current" />
                            ) : (
                              <HeartIcon className="size-5" />
                            )}
                            <span>{optimisticLikes}</span>
                          </Button>
                        ) : (
                          <SignInButton mode="modal">
                            <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
                              <HeartIcon className="size-5" />
                              <span>{optimisticLikes}</span>
                            </Button>
                          </SignInButton>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground gap-2 hover:text-blue-500"
                          onClick={() => setShowComments((prev) => !prev)}
                        >
                          <MessageCircleIcon
                            className={`size-5 ${showComments ? "fill-blue-500 text-blue-500" : ""}`}
                          />
                          <span>{post.comments.length}</span>
                        </Button>

                        
                        </div>
                        <div className="flex items-center pt-2 ml-8.5">
                        {user ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`text-muted-foreground gap-2 ${
                              hasSaved ? "text-black hover:text-black" : "hover:text-black"
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
                        </div>
                        </div>

                        
                          
                  {/* comments */}
                    {showComments && (
                    <div className="space-y-4">
                      <div className="space-y-4">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex space-x-3 mt-3">
                            <div className="flex-1 min-w-0">
                            <div className="flex flex-row space-x-2">

                              {/* comment's avatar, username and time */}
                             <Link href={`/profile/${post.author.username}`}>
                                <Avatar className='w-8 h-8 mr-1'>
                                    <AvatarImage src={comment.author.image || "/avatar.png"} />
                                </Avatar>
                              </Link>
                              <div className='flex flex-col'>
                                <div>
                                  <Link className="text-xs" href={`/profile/${comment.author.username}`}>{comment.author.username}</Link>
                                  <span className='ml-1.5'>•</span> 
                                </div>           
                                <span className="text-xs text-muted-foreground space-x-2 -mt-1">{sincePosted(new Date(comment.createdAt))} </span>
                              </div>

                            <div className='flex justify-between w-full'>
                              
                              {/* comment content */}
                              <p className="text-xs mt-1.25 break-words">{comment.content}</p>
                              
                              {/* remove comment icon */}
                              <div className='mt-1'>
                                {dbUserId === post.author.id && (
                                <DeleteAlertDialog
                                id={comment.id}
                                isDeleting={isDeleting}
                                onDelete={handleDeleteComment}
                                title="Delete Comment"
                                description="This action cannot be undone."
                                />
                                )}
                              </div>

                            </div>
                          </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {user ? (
                        <div className="flex space-x-3">
                          <Avatar className="size-8 flex-shrink-0">
                            <AvatarImage src={user?.imageUrl || "/avatar.png"} />
                          </Avatar>
                            <Textarea
                              placeholder="Write a comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="p-0.5 mt-1 min-h-[5px] resize-none border-none focus-visible:ring-0 text-xs"
                            />
                              <Button
                                size="sm"
                                onClick={handleAddComment}
                                className="flex items-center gap-1.5 text-xs"
                                disabled={!newComment.trim() || isCommenting}
                              >
                                {isCommenting ? (
                                  "Commenting..."
                                ) : (
                                  <>
                                    <MessageSquare className="size-4" />
                                    Comment
                                  </>
                                )}
                              </Button>
                        </div>
                      ) : (
                        <div className="flex justify-center p-4 border rounded-lg bg-muted/50">
                          <SignInButton mode="modal">
                            <Button variant="outline" className="gap-2">
                              <LogInIcon className="size-4" />
                              Sign in to comment
                            </Button>
                          </SignInButton>
                        </div>
                      )}
                    </div>
                    )}
                </div>  
                </div>
                </div>
        </CardContent>
    </Card>
  );
}

export default PostCard