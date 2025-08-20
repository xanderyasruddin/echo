import { getRandomUsers } from '@/functions/user'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';
import { Avatar, AvatarImage } from './ui/avatar';
import FollowButton from './FollowButton';
import { Separator } from './ui/separator';

async function TrendingUsers() {

    const users = await getRandomUsers();

    if(users.length === 0) return null;

  return (
    <div className='mb-8'>
    <Card>
        <CardHeader>
            <CardTitle>
                Users to Follow
            </CardTitle>
        </CardHeader>
        <CardContent>
        <Separator className="-mt-3 mb-5 h-px bg-gray-200" orientation="horizontal"/>
        <div className="space-y-4 ">
          
          {users.map((user) => (
            <div key={user.id} className="flex gap-2 items-center justify-between">
              <div className="flex items-center gap-2 w-1">
              
                <Link href={`/profile/${user.username}`}>
                  <Avatar>
                    <AvatarImage src={user.image ?? "/avatar.png"} />
                  </Avatar>
                </Link>
                <div className="text-xs">
                <Link href={`/profile/${user.username}`}>
                  <p className="font-medium cursor-pointer">{user.username}</p>
                  </Link>
                  <p className="text-muted-foreground">{user._count.posts} posts</p>
                </div>
              </div>
              <FollowButton userId={user.id} />
            </div>
          ))}
        </div>
        </CardContent>

    </Card>
    </div>
  )
}

export default TrendingUsers