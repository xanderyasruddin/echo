"use client";

import { NotificationLayout } from "@/components/NotificationLayout";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getNotifications, markNotificationsAsRead } from "@/functions/notification";
import { sincePosted } from "@/functions/time";
import { HeartIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NotificationsSkeleton } from "@/components/NotificationSkeleton";
import Link from "next/link";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "LIKE":
      return <HeartIcon className="size-4 text-red-500 fill-red-500" />;
    case "COMMENT":
      return <MessageCircleIcon className="size-4 text-blue-500 fill-blue-500" />;
    case "FOLLOW":
      return <UserPlusIcon className="size-4 text-green-500 fill-green-500" />;
    default:
      return null;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await getNotifications();
        setNotifications(data);

        const unreadIds = data.filter((n) => !n.read).map((n) => n.id);
        if (unreadIds.length > 0) await markNotificationsAsRead(unreadIds);
      } catch {
        toast.error("Failed to fetch notifications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (isLoading) return <NotificationsSkeleton />;

  return (
    <NotificationLayout rightElement={<span className="text-sm text-muted-foreground">
      {notifications.filter((n) => !n.read).length} unread
    </span>}>
    {/* no notification message */}
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
        ) : (
          // map over notifications
          notifications.map((n) => (
            <div key={n.id} className={`flex p-4 border-b hover:bg-muted/25 transition-colors ${!n.read ? "bg-muted/50" : ""}`}>
              
              <div className="flex items-center gap-2 p-2">
              <Link href={`/profile/${n.creator.username}`}>
              <Avatar className="">
                <AvatarImage src={n.creator.image ?? "/avatar.png"} />
              </Avatar>
              </Link>
                {/* icon */}
                  {getNotificationIcon(n.type)}
                  <span>

                    {n.type === "FOLLOW"
                      ? <div className="font-bold">
                          <Link href={`/profile/${n.creator.username}`}>
                          {n.creator.username}  
                          </Link>
                          <span className="font-normal"> started following you</span>
                        </div> 
                      : n.type === "LIKE"
                      ? <div className="font-bold">
                      <Link href={`/profile/${n.creator.username}`}>
                      {n.creator.username}  
                      </Link>
                      <span className="font-normal"> liked</span>
                    </div> 
                      : <div className="font-bold">
                      <Link href={`/profile/${n.creator.username}`}>
                      {n.creator.username}  
                      </Link>
                      <span className="font-normal"> commented:</span>
                    </div> }
                  </span>
                  
                  {/* print comment  */}
                  {n.post && n.type === "COMMENT" && n.comment && (
                      <div className="text-md bg-accent/50">
                        {n.comment.content}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                  {sincePosted(new Date(n.createdAt))}
                </p>
                  </div>
      
                
                </div>

          ))
        )}
    </NotificationLayout>
  );
}
