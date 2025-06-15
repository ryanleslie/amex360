
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const destinations = [
  {
    name: "Frankfurt",
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&q=80",
    desc: "Historic and modern city",
  },
  {
    name: "New York",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&q=80",
    desc: "The city that never sleeps",
  },
  {
    name: "Los Angeles",
    image: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=400&q=80",
    desc: "Beaches and glamour",
  },
  {
    name: "Phoenix",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80",
    desc: "Sunny desert escape",
  },
  {
    name: "Barcelona",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&q=80",
    desc: "Vibrant Spanish culture",
  },
  {
    name: "Edmonton",
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&q=80",
    desc: "Gateway to the north",
  },
];

export function RedemptionCarouselCard() {
  return (
    <Card className="bg-gradient-to-b from-white to-gray-100">
      <CardHeader className="flex flex-col space-y-4 pb-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold">Featured destinations</CardTitle>
          <CardDescription>Sample redemptions and top travel spots</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-0 sm:px-6 pt-4 sm:pt-6 relative">
        <div className="relative w-full">
          <Carousel className="w-full relative">
            <CarouselContent>
              {destinations.map((dest, i) => (
                <CarouselItem key={i}>
                  <div className="flex flex-col items-center gap-2 py-2 select-none">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="rounded-lg object-cover w-full max-w-[410px] h-40 mb-2 shadow"
                      style={{ backgroundColor: "#eee" }}
                    />
                    <div className="font-semibold text-base text-center">{dest.name}</div>
                    <div className="text-xs text-muted-foreground text-center">{dest.desc}</div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </CardContent>
    </Card>
  );
}
