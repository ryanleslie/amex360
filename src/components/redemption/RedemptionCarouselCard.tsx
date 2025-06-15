
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export function RedemptionCarouselCard() {
  const destinations = [
    {
      name: "Frankfurt",
      image: "https://www.aman.com/sites/default/files/2022-12/Aman%20New%20York%2C%20USA%2011.jpg",
      description: "Gateway to Europe"
    },
    {
      name: "Phoenix",
      image: "https://www.aman.com/sites/default/files/styles/media_text_side_by_side_portrait_xwide_up/public/2023-08/aman_new_york_usa_-_three-bedroom_home_bathroom.jpg?itok=C3oFbV3i",
      description: "Desert Metropolis"
    },
    {
      name: "Dubai",
      image: "https://www.aman.com/sites/default/files/styles/media_text_side_by_side_x_wide/public/2025-01/aman_residences_dubai_-_external_terrace.jpg?itok=j3HhMH9e",
      description: "Desert Oasis"
    },
    {
      name: "Venice",
      image: "https://www.aman.com/sites/default/files/styles/two_portrait_images_extra_large/public/2022-06/DoNotUse_Meditations_Venice5.jpg?itok=90L2qOTI",
      description: "Floating City"
    },
    {
      name: "Providenciales",
      image: "https://www.aman.com/sites/default/files/2024-05/amanyara_turks_caicos_-_accommodation_villa_33.jpg",
      description: "Turks and Caicos"
    },
    {
      name: "Tokyo",
      image: "https://www.aman.com/sites/default/files/styles/media_text_side_by_side_x_wide/public/2024-04/aman-residences-tokyo-communal-space-lounge-to-private-dining.jpg?itok=SOS7QrYB",
      description: "Modern Metropolis"
    },
    {
      name: "Bodrum",
      image: "https://www.aman.com/sites/default/files/2022-08/Amanruya%2C%20Turkey%20-%20Accommodation%2C%20Garden%20View%20Pavilion%20Portrait%20-%20Pool%20.jpg",
      description: "Turkish Riviera"
    },
    {
      name: "New York",
      image: "https://www.aman.com/sites/default/files/styles/carousel_cards_extra_large/public/2022-11/Aman%20New%20York%2C%20USA%20-%20Spa%20%26%20Wellness%2C%20Pool%202.jpg?itok=DBMc8qlk",
      description: "The Big Apple"
    },
  ];

  return (
    <Card className="bg-gradient-to-b from-white to-gray-100 hidden lg:block">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold" style={{ color: '#00175a' }}>
          Popular destinations
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pt-2">
        <Carousel 
          className="w-full px-6"
          opts={{
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-1 md:-ml-2">
            {destinations.map((destination, index) => (
              <CarouselItem key={index} className="pl-1 md:pl-2 basis-4/5 md:basis-1/4">
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
      </CardContent>
    </Card>
  );
}
