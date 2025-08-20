import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { getTrendingLocations } from '@/functions/location';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Separator } from '@radix-ui/react-separator';

export default async function TrendingLocations() {
  const locations = await getTrendingLocations(3);

  return (
    <Card>
        <CardHeader>
            <CardTitle>
                Popular Locations
            </CardTitle>
        </CardHeader>
        <CardContent>
        <div className="space-y-4 -mt-3">
          {locations.map((trendylocati) => {
            const avgRating =
            trendylocati.numberOfRatings > 0
                ? (trendylocati.sumOfRatings / trendylocati.numberOfRatings).toFixed(1)
                : "-";

            return (
              <div key={trendylocati.id}>
              <Separator className="mb-3 h-px bg-gray-200" orientation="horizontal"/>
              <Link className="font-semibold text-sm" href={`/location/${trendylocati.placeId}`}>{trendylocati.name}</Link>
                <div className='flex items-center space-x-1'>
                <Star className='size-3'/>
                <p className="text-sm">
                   {avgRating} ({trendylocati.numberOfRatings} reviews, {trendylocati._count.posts} posts)
                </p>
                </div>
              </div>
            );
          })}
        </div>
        </CardContent>

    </Card>
  )
}