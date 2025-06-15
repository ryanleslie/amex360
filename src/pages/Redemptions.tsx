
import React from "react";
import { useFilterState } from "@/hooks/useFilterState";
import { RedemptionsLoader } from "@/components/redemption/RedemptionsLoader";
import { RedemptionsContent } from "@/components/redemption/RedemptionsContent";

// Destination images to preload - moved outside component to prevent re-creation
const destinationImages = [
  "https://www.aman.com/sites/default/files/2022-12/Aman%20New%20York%2C%20USA%2011.jpg",
  "https://www.aman.com/sites/default/files/styles/media_text_side_by_side_portrait_xwide_up/public/2023-08/aman_new_york_usa_-_three-bedroom_home_bathroom.jpg?itok=C3oFbV3i",
  "https://www.aman.com/sites/default/files/styles/media_text_side_by_side_x_wide/public/2025-01/aman_residences_dubai_-_external_terrace.jpg?itok=j3HhMH9e",
  "https://www.aman.com/sites/default/files/styles/two_portrait_images_extra_large/public/2022-06/DoNotUse_Meditations_Venice5.jpg?itok=90L2qOTI",
  "https://www.aman.com/sites/default/files/2024-05/amanyara_turks_caicos_-_accommodation_villa_33.jpg",
  "https://www.aman.com/sites/default/files/styles/media_text_side_by_side_x_wide/public/2024-04/aman-residences-tokyo-communal-space-lounge-to-private-dining.jpg?itok=SOS7QrYB",
  "https://www.aman.com/sites/default/files/2022-08/Amanruya%2C%20Turkey%20-%20Accommodation%2C%20Garden%20View%20Pavilion%20Portrait%20-%20Pool%20.jpg",
  "https://www.aman.com/sites/default/files/styles/carousel_cards_extra_large/public/2022-11/Aman%20New%20York%2C%20USA%20-%20Spa%20%26%20Wellness%2C%20Pool%202.jpg?itok=DBMc8qlk"
];

const Redemptions = () => {
  const { filters, updateFilter, updateMultipleFilters } = useFilterState("ytd");
  const [isVisible, setIsVisible] = React.useState(false);
  const [numbersKey, setNumbersKey] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [animationData, setAnimationData] = React.useState(null);
  const [showContent, setShowContent] = React.useState(false);
  const [showLottie, setShowLottie] = React.useState(false);

  // Function to preload images
  const preloadImages = React.useCallback(() => {
    console.log('Starting to preload destination images...');
    
    const imagePromises = destinationImages.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          console.log(`Preloaded image: ${src.substring(0, 50)}...`);
          resolve(src);
        };
        img.onerror = () => {
          console.warn(`Failed to preload image: ${src.substring(0, 50)}...`);
          resolve(src); // Resolve anyway to not block the loading
        };
        img.src = src;
      });
    });

    return Promise.all(imagePromises);
  }, []); // Empty dependency array since destinationImages is now stable

  React.useEffect(() => {
    // Load the loading-geo-b animation
    fetch("/loading-geo-b.json")
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error("Failed to load animation:", error));

    // a. delay loading by .5 seconds
    const initialDelay = setTimeout(() => {
      // b. start lottie
      setShowLottie(true);
      
      // Start preloading images immediately when lottie starts
      preloadImages().then(() => {
        console.log('All destination images preloaded successfully');
      });
      
      // c. load page for 2 seconds while lottie plays
      // d. only render page after lottie plays for 2 seconds
      const lottieTimer = setTimeout(() => {
        setIsLoading(false);
        setIsVisible(true);
        // Start showing content with staggered animations
        setTimeout(() => setShowContent(true), 100);
      }, 2000);

      return () => clearTimeout(lottieTimer);
    }, 500);

    return () => clearTimeout(initialDelay);
  }, [preloadImages]);

  React.useEffect(() => {
    setNumbersKey(prev => prev + 1);
  }, [filters.selectedTimeRange, filters.selectedDate, filters.selectedCard]);

  if (isLoading) {
    return (
      <RedemptionsLoader 
        animationData={animationData}
        showLottie={showLottie}
      />
    );
  }

  return (
    <div className="flex-1">
      <RedemptionsContent
        filters={filters}
        updateFilter={updateFilter}
        updateMultipleFilters={updateMultipleFilters}
        isVisible={isVisible}
        numbersKey={numbersKey}
        showContent={showContent}
      />
    </div>
  );
};

export default Redemptions;
