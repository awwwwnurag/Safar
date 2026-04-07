import axios from "axios";
import { config } from "../config.js";

// Fetch an image from Unsplash
export const getUnsplashPhotoUrl = async (query) => {
  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query: query,
        per_page: 1,
        orientation: "landscape",
      },
      headers: {
        Authorization: `Client-ID ${config.VITE_UNSPLASH_API_KEY}`,
      },
    });

    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].urls.regular;
    }
    // Fallback image if no results
    return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1000";
  } catch (error) {
    console.error("Error fetching Unsplash photo:", error);
    // Fallback generic travel image
    return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1000";
  }
};

// Geocoding using free Nominatim (OpenStreetMap) API
export const getNominatimCoordinates = async (query) => {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: query,
        format: "json",
        limit: 1,
      },
    });

    if (response.data && response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon),
        address: response.data[0].display_name
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
    return null;
  }
};

export const getRoute = async (origin, destination) => {
  try {
    // If backend route requires Google Maps, this will fail. We should ideally use OSRM here if possible,
    // but we'll try to preserve the existing backend call for now just in case the backend uses something else.
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
