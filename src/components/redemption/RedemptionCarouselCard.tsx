
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export function RedemptionCarouselCard() {
  const destinations = [
    {
      name: "Frankfurt",
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6d36b3c?w=400&h=300&fit=crop",
      description: "Gateway to Europe"
    },
    {
      name: "New York",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
      description: "The Big Apple"
    },
    {
      name: "Los Angeles",
      image: "https://images.unsplash.com/photo-1534190239940-9ba8944ea261?w=400&h=300&fit=crop",
      description: "City of Angels"
    },
    {
      name: "Phoenix",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      description: "Desert Metropolis"
    },
    {
      name: "Barcelona",
      image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop",
      description: "Mediterranean Charm"
    }
  ];

  return (
    <Card className="bg-gradient-to-b from-white to-gray-100">
      <CardHeader>
        <CardTitle className="text-xl font-semibold" style={{ color: '#00175a' }}>
          Popular Destinations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full max-w-xs mx-auto">
          <CarouselContent>
            {destinations.map((destination, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <img 
                        src={destination.image} 
                        alt={destination.name}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-lg font-semibold mb-2" style={{ color: '#00175a' }}>
                        {destination.name}
                      </h3>
                      <p className="text-sm text-gray-600 text-center">
                        {destination.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
    </Card>
  );
}
