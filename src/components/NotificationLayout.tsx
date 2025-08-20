import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BellIcon } from "lucide-react";

export function NotificationLayout({
  children,
  rightElement,
}: {
  children: React.ReactNode;
  rightElement?: React.ReactNode;
}) {
  return (
    <div className="flex justify-center mx-10">
      <Card className="relative w-full max-w-[550px] rounded-lg shadow-l">
        <CardHeader className="border-b  ">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center -mb-2 gap-3 justify-start">
              <BellIcon className="w-4 h-4" />
              Notifications
            </CardTitle>
            {rightElement}
          </div>
        </CardHeader>
        <CardContent className="p-0 -mt-6">{children}</CardContent>
      </Card>
    </div>
  );
}
