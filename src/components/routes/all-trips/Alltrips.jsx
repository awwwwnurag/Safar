import { LogInContext } from "@/Context/LogInContext/Login";
import { db } from "@/Service/Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import AlltripsCard from "./AlltripsCard";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

function Alltrips() {
  const { user } = useContext(LogInContext);
  const [allTrips, setAllTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllTrips = async () => {
    setIsLoading(true);
    try {
      const Query = query(
        collection(db, "Trips"),
        where("userId", "==", user?.sub)
      );
      const querySnapshot = await getDocs(Query);
      const trips = [];
      querySnapshot.forEach((doc) => {
        trips.push({ ...doc.data(), tripId: doc.id });
      });

      const reversedTrips = trips.reverse();
      setAllTrips(reversedTrips);
      console.log("Trips fetched from Firebase:", reversedTrips);
    } catch (error) {
      console.error("Error fetching trips from Firebase:", error);
      setAllTrips([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAllTrips();
  }, [user]);

  return (
    <div className="mb-10">
      <h1 className="text-3xl md:text-5xl font-bold text-center my-5 md:my-10 bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
        All Trips
      </h1>
      <div className="flex gap-4 flex-wrap justify-center md:justify-evenly items-center w-full">
        {isLoading ? (
          [1, 2, 3, 4].map((item, index) => (
            <div
              key={index}
              className="w-full md:w-[45%] h-56 rounded-xl border border-border bg-secondary/50 animate-pulse"
            ></div>
          ))
        ) : allTrips?.length > 0 ? (
          allTrips.map((trip, idx) => (
            <Link
              key={idx}
              to={"/my-trips/" + trip.tripId}
              className="w-full md:w-[45%]"
            >
              <AlltripsCard trip={trip} />
            </Link>
          ))
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center p-10 md:p-20 text-center w-full max-w-2xl mx-auto rounded-2xl border border-dashed border-primary/20 bg-secondary/10"
          >
            <Compass className="w-20 h-20 text-blue-500 mb-6 drop-shadow-lg opacity-80" />
            <h2 className="text-3xl font-black bg-gradient-to-b from-primary/90 to-primary/40 bg-clip-text text-transparent mb-4">
              Your Safar Awaits!
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Looks like you haven't planned any trips yet. The world is full of incredible destinations waiting to be explored.
            </p>
            <Link to="/plan-a-trip">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all font-semibold">
                Generate Your First Trip
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Alltrips;
