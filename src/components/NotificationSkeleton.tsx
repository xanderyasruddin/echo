// components/NotificationsSkeleton.tsx
import { NotificationLayout } from "./NotificationLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export function NotificationsSkeleton() {
  const skeletonItems = Array.from({ length: 5 }, (_, i) => i);

  return (
    <NotificationLayout rightElement={<Skeleton className="h-4 w-20" />}>
        {skeletonItems.map((index) => (
          <div key={index} className="flex items-start gap-4 p-4 border-b">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="pl-6 space-y-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        ))}
    </NotificationLayout>
  );
}
