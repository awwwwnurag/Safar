import React, { useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { LogInContext } from "@/Context/LogInContext/Login";
import PlaceCards from "../Cards/PlaceCards";
import { useRefContext } from "@/Context/RefContext/RefContext";

function Placescard() {
  // const isMobile = useMediaQuery({ query: "(max-width: 445px)" });
  // const isSmall = useMediaQuery({ query: "(max-width: 640px)" });

  const { trip } = useContext(LogInContext);
  const city = trip?.tripData?.location || trip?.userSelection?.location || trip?.location;

  // Extract the summary conditionally
  const summary = trip?.tripData?.itinerary?.summary || 
                  trip?.itinerary?.summary || 
                  trip?.summary;

  // Safely extract itinerary from various possible JSON structures
  let itinerary = 
    trip?.tripData?.itinerary?.itinerary || 
    trip?.tripData?.itinerary || 
    trip?.itinerary?.itinerary || 
    trip?.itinerary;

  if (itinerary && !Array.isArray(itinerary) && typeof itinerary === 'object') {
    itinerary = Object.values(itinerary.itinerary || itinerary);
  }

  // Prevent crashes if AI returned a markdown string instead of JSON
  const isItineraryArray = Array.isArray(itinerary);
  const summaryText = typeof summary === "string" ? summary : null;

  const { placesRef } = useRefContext();

  return (
    <>
      {summaryText && (
        <div className="w-full p-8 bg-secondary/10 rounded-2xl mb-8 border border-border">
          <p className="text-xl opacity-80 whitespace-pre-line text-left max-w-4xl mx-auto leading-relaxed">
            {summaryText}
          </p>
        </div>
      )}
      
      {!isItineraryArray && typeof itinerary === 'string' && !summaryText && (
        <div className="w-full text-center p-10 bg-secondary/30 rounded-lg mt-5">
          <p className="text-xl opacity-80 whitespace-pre-line text-left max-w-4xl mx-auto leading-relaxed">
            {itinerary}
          </p>
        </div>
      )}
      
      {isItineraryArray && itinerary.length > 0 && (
        <div className="w-full p-6 md:p-8 bg-secondary/10 rounded-2xl my-8 border border-border max-w-4xl mx-auto shadow-sm">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            Itinerary Overview
          </h3>
          <ul className="space-y-3">
            {itinerary.map((day, idx) => (
              <li key={idx} className="text-muted-foreground leading-relaxed text-base md:text-lg">
                <span className="font-semibold text-foreground">Day {day.day}: {day.title}</span> — 
                Featuring {day.places.map(p => p.name).join(", ")}.
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {isItineraryArray && itinerary.map((day, idx) => {
        return (
          <div ref={placesRef} key={idx} className="main-container mt-5 sm:mt-10">
            <div className="places-heading text-center my-5">
              <h3 className="md:text-4xl font-black bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-center text-transparent">
                Day {day.day}
              </h3>
              <h4 className="md:text-3xl text-center text-primary/80">
                {day.title}
              </h4>
            </div>
            <div className="cards flex flex-col md:flex-row flex-wrap gap-5">
              {day.places.map((place, idx) => {
                return (
                  <div key={idx} className="md:w-[48%]">
                    <PlaceCards className="place-card" place={place} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default Placescard;
