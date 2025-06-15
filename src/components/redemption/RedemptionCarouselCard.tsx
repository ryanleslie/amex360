
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { parseRedemptions, getTopDestinations } from "@/utils/redemptionParser";

export function RedemptionCarouselCard() {
  const redemptions = parseRedemptions();
  const topDestinations = getTopDestinations(redemptions);
  
  // Enhanced destination images for carousel
  const destinationImages: Record<string, string> = {
    'New York': 'https://www.aman.com/sites/default/files/2022-12/Aman%20New%20York%2C%20USA%2011.jpg',
    'Los Angeles': 'https://www.aman.com/sites/default/files/styles/carousel_cards_extra_large/public/2022-11/Aman%20New%20York%2C%20USA%20-%20Spa%20%26%20Wellness%2C%20Pool%202.jpg?itok=DBMc8qlk',
    'Phoenix': 'https://www.aman.com/sites/default/files/styles/media_text_side_by_side_portrait_xwide_up/public/2023-08/aman_new_york_usa_-_three-bedroom_home_bathroom.jpg?itok=C3oFbV3i',
    'Stuttgart': 'https://www.aman.com/sites/default/files/2023-08/aman-ny-vignettes-6754.jpg',
    'Frankfurt': 'https://www.aman.com/sites/default/files/2022-12/Aman%20New%20York%2C%20USA%2011.jpg'
  };

  const destinationDescriptions: Record<string, string> = {
    'New York': 'The Big Apple',
    'Los Angeles': 'City of Angels',
    'Phoenix': 'Desert Metropolis',
    'Stuttgart': 'Gateway to Europe',
    'Frankfurt': 'Financial Hub'
  };

  const destinations = topDestinations.map(dest => ({
    name: dest.name,
    image: destinationImages[dest.name] || destinationImages['Phoenix'],
    description: destinationDescriptions[dest.name] || 'Travel Destination'
  }));

  return (
    <Card className="bg-gradient-to-b from-white to-gray-100">
      <CardHeader>
        <CardTitle className="text-xl font-semibold" style={{ color: '#00175a' }}>
          Popular Destinations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-6">
          <Carousel 
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {destinations.map((destination, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-4/5 md:basis-1/4">
                  <div className="p-1">
                    <Card className="relative overflow-hidden h-48 group cursor-pointer">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                        style={{ 
                          backgroundImage: `url(${destination.image})`,
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50" />
                      <CardContent className="relative z-10 flex flex-col justify-end items-start h-full p-4">
                        <div className="text-left">
                          <h3 className="text-xl font-bold text-white drop-shadow-lg leading-tight">
                            {destination.name}
                          </h3>
                          <p className="text-sm text-white/90 drop-shadow-md leading-tight mt-0.5">
                            {destination.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </CardContent>
    </Card>
  );
}
