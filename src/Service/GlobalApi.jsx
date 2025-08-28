import axios from "axios";
import { config } from "../config.js";

const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

const headers = {
  "Content-Type": "application/json",
  "X-Goog-Api-Key": config.VITE_GOOGLE_MAP_API_KEY,
  "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location,places.types,places.photos,places.rating,places.userRatingCount,places.priceLevel,places.websiteUri,places.regularOpeningHours,places.editorialSummary",
};

export const PHOTO_URL =
  "https://places.googleapis.com/v1/{replace}/media?maxHeightPx=1000&key=" +
  config.VITE_GOOGLE_MAP_API_KEY;

export const getPlaceDetails = (data) =>
  axios.post(BASE_URL, data, { headers });

export const getCityDetails = (data) => 
  axios.post(BASE_URL, data, { headers });

export const getRoute = async (origin, destination) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get-route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ origin, destination }),
    });

    const data = await response.json(); 
    return data;
  } catch (error) {
    console.error("Error fetching route:", error);
    return null;
  }
};
