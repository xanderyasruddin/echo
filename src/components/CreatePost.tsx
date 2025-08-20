"use client"

import { useUser } from '@clerk/nextjs';
import React, { useState, useRef } from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { ImageIcon, Loader2Icon, SendIcon, Medal, Calendar1 } from 'lucide-react';
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { createPost } from '@/functions/post';
import { Input } from './ui/input';
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import ImageUploader from './ImageUploader';

interface CreatePostOther {
    onSuccess?: () => void;
}

function CreatePost({ onSuccess }: CreatePostOther) {
    const {user}= useUser();
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    // const [showImageUpload, setShowImageUpload] = useState(false);
    const [rating, setRating] = useState(0);
    const [showRating, setShowRating] = useState(false);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const locationInputRef = useRef<HTMLInputElement | null>(null);
    const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
    
    type LocationDetails = {
        placeId: string;
        name: string;
        address: string;
        lat: number;
        lng: number;
      };

      
    // to load google maps api
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ["places"],
    })
    // to handle location autocomplete select
    const handlePlaceChange = () => {
        const place = autocompleteRef.current?.getPlace();
    
        // Ensure place and geometry exist
        if (!place?.geometry?.location) {
            console.warn("Place or geometry is missing", place);
            return;
        }
    
        const location: LocationDetails = {
            placeId: place.place_id ?? "",
            name: place.name || place.formatted_address || "Unknown",
            address: place.formatted_address || "",
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
        };
    
        setLocationDetails(location);
    };

    const router = useRouter();

    const handleSubmit = async () => {
        if (!content.trim() || !locationDetails) {
            toast.error("Content and location are required.");
            return;
        }

        setIsPosting(true);
        try {
            const result = await createPost(
                content, 
                imageUrl, 
                showRating ? rating : null, 
                locationDetails)
            if(result?.success) {
                toast.success("Post created successfully!");
                router.push("/");
            }
        } catch (error) {
            console.error("Failed to create post:", error);
            toast.error("Failed to create post");
        } finally {
            setIsPosting(false);
        }
    };

 
  return (
            <div className='space-y-4 mt-2'>
                <div className='flex items-center'>
                    
                    {isLoaded && (
                        <div className="flex-grow w-full">
                    <Autocomplete
                    onLoad={(auto) => (autocompleteRef.current = auto)}
                    onPlaceChanged={handlePlaceChange}
                    options={{
                        componentRestrictions: { country: "gb" },
                    }}

                    // need to add the option to change the country location

                    >
                    <input
                        ref={locationInputRef}
                        type="text"
                        placeholder="Search location"
                        className="w-full px-3 py-2 border rounded-md text-sm"
                        /> 
                        
                    </Autocomplete>
                    </div>
                    )}
                </div>
                <div className='flex flex-col w-full'>
            <div className='flex space-x-4 w-full'>
                <Avatar className='w-10 h-10'>
                    <AvatarImage src={user?.imageUrl || "/avatar.png"} />
                </Avatar>
                
                <Textarea
                placeholder="Echo your thoughts..."
                className="p-0.5 flex-1 min-h-[100px] resize-none border-none focus-visible:ring-0 text-sm break-words"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isPosting}
                />
                    </div>                    
            </div>

            

            <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center -ml-2 space-x-1">
                    {/* rating button */}
                    <div className="flex items-center space-x-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => setShowRating(!showRating)}
                        disabled={isPosting}
                        >
                        <Medal className="size-4" />
                        </Button>

                        {showRating ? (
                        <div className="flex items-center gap-2">
                            <Input
                            type="number"
                            min={0}
                            max={5}
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="w-14 text-sm"
                            />
                            <span className="text-sm text-muted-foreground">/ 5</span>
                        </div>
                        ) : (
                            <span className="text-sm text-muted-foreground">No Rating</span>
                        )}
                        
                        </div>
                    </div>

                    <Button
                    className="flex items-center"
                    onClick={handleSubmit}
                    disabled={isPosting}
                    >
                    {isPosting ? (
                        <>
                        <Loader2Icon className="size-4 mr-2 animate-spin" />
                        Echoing...
                        </>
                    ) : (
                        <>
                        <SendIcon className="size-4" />
                        Post
                        </>
                    )}
                    </Button>
                </div>
            </div>
  )
} 

export default CreatePost