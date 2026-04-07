import React, { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogInContext } from "@/Context/LogInContext/Login";
import { getUnsplashPhotoUrl, getNominatimCoordinates } from "@/Service/GlobalApi";
import { useCache } from "@/Context/Cache/CacheContext";

function PlaceCards({ place }) {
  const { trip } = useContext(LogInContext);
  const itinerary = trip?.tripData?.itinerary;
  const city = trip?.tripData?.location || trip?.userSelection?.location || trip?.location;

  const [Url, setUrl] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");

  const [rating, setRating] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [currentPlace, setCurrentPlace] = useState(null);

  const { setSelectedPlace } = useCache();

  const getPlaceInfo = async () => {
    try {
      const imgUrl = await getUnsplashPhotoUrl(place.name + " " + city + " tourist attraction");
      setUrl(imgUrl);

      const geoResult = await getNominatimCoordinates(place.name + " " + city);

      let info = {
        lat: geoResult ? geoResult.lat : 0,
        lng: geoResult ? geoResult.lng : 0,
        name: place.name,
        city: city,
        address: place.address || (geoResult ? geoResult.address : ""),
        rating: place.rating || 4.5, // AI gives rating usually
        location: geoResult ? `https://www.openstreetmap.org/?mlat=${geoResult.lat}&mlon=${geoResult.lng}#map=18/${geoResult.lat}/${geoResult.lng}` : "",
        photos: imgUrl,
      };

      setAddress(info.address);
      setLocation(info.location);
      setRating(info.rating);
      setLatitude(info.lat);
      setLongitude(info.lng);

      setCurrentPlace(info);
    } catch (err) {
      console.log("Error fetching place details:", err);
    }
  };

  useEffect(() => {
    if (trip && place) getPlaceInfo();
  }, [trip, place]);

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const mapCenter = {
    lat: latitude || 0,
    lng: longitude || 0,
  };

  const handleSelectPlace = () => {
    let combinedHotel = { ...place, ...currentPlace };
    setSelectedPlace(combinedHotel);
  };

  return (
    <Link
      to={`/details-for-place/${latitude}/${longitude}`}
      onClick={handleSelectPlace}
    >
      <Card className="border-foreground/20 p-1 h-full flex flex-col gap-3 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-primary/20">
        <div className="img h-full rounded-lg">
          <img
            src={Url || "/logo.png"}
            // src={place.image_url}
            className="h-80 w-full object-cover"
            alt=""
          />
        </div>
        <div className="text-content w-full flex items-center gap-3 justify-between flex-col h-full">
          <CardHeader className="w-full">
            <CardTitle className="opacity-90 w-full text-center text-xl font-black text-primary/80 md:text-3xl">
              {place.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 tracking-wide opacity-90 w-full text-center text-sm text-primary/80 md:text-md">
              {place.details}
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <div className="places-details">
              <span className="font-medium text-primary/80 opacity-90 text-sm md:text-base tracking-wide">
                🕒 Timings: {place.timings}{" "}
              </span>
              <br />
              <span className="font-medium text-primary/80 opacity-90 text-sm md:text-base tracking-wide">
                💵 Price:
                {place.pricing}{" "}
              </span>{" "}
              <br />
              <span className="font-medium text-primary/80 opacity-90 text-sm md:text-base tracking-wide line-clamp-1">
                📍 Location: {address ? address : place.address}
              </span>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}

export default PlaceCards;
