import { getUnsplashPhotoUrl } from "@/Service/GlobalApi";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

const AlltripsCard = ({ trip }) => {
  const [Url, setUrl] = useState("");

  const city = trip?.tripData?.location || trip?.userSelection?.location || trip?.location;

  const getCityInfo = async () => {
    try {
      const imgUrl = await getUnsplashPhotoUrl(city + " landmark city landscape");
      setUrl(imgUrl);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    trip && getCityInfo();
  }, [trip]);

  return (
    <>
      <Card className="border-foreground/20 p-1 h-full flex flex-col gap-3 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-primary/20">
        <div className="img relative h-full rounded-lg overflow-hidden duration-500 group cursor-pointer">
          <img
            src={Url || "/logo.png"}
            className="h-56 w-full object-cover group-hover:scale-110 duration-500 transition-all"
            alt={Url || "/logo.png"}
          />
          <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-gradient-to-b text-lg from-primary/90 to-primary/60 bg-clip-text text-transparent font-bold">
              {trip?.userSelection?.location || trip?.location}
            </span>
            <span className="bg-gradient-to-b text-lg from-primary/90 to-primary/60 bg-clip-text text-transparent font-bold">
              {trip?.userSelection?.noOfDays || trip?.days}{" "}
              {(trip?.userSelection?.noOfDays || trip?.days) > 1 ? "Days" : "Day"}
            </span>
            <span className="bg-gradient-to-b text-lg from-primary/90 to-primary/60 bg-clip-text text-transparent font-bold">
              {trip?.userSelection?.Budget || trip?.budget} Budget
            </span>
          </div>
        </div>
      </Card>
    </>
  );
}

export default AlltripsCard;
