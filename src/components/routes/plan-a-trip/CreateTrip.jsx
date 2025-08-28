import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { LogInContext } from "../../../Context/LogInContext/Login.jsx";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { config } from "../../../config.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../../ui/dialog";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createChatSession } from "../../../Service/AiModel";
import { db } from "../../../Service/Firebase";
import { doc, setDoc } from "firebase/firestore";

const CreateTrip = ({ createTripPageRef }) => {
  const { user, isAuthenticated } = useContext(LogInContext);
  const [place, setPlace] = useState("");
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const SignIn = () => {
    // This will be handled by the custom auth component
    navigate("/auth");
  };

  const generateTrip = async () => {
    if (!isAuthenticated) {
      setIsDialogOpen(true);
      return;
    }

    // Debug: Log form data
    console.log("Form Data:", formData);

    // Check all required fields
    if (!formData.location || !formData.noOfDays || !formData.Budget || !formData.People) {
      console.log("Missing fields:", {
        location: !!formData.location,
        noOfDays: !!formData.noOfDays,
        Budget: !!formData.Budget,
        People: !!formData.People
      });
      toast.error("Please fill in all fields");
      return;
    }

    // Validate number of days
    if (formData.noOfDays < 1 || formData.noOfDays > 5) {
      toast.error("Please enter a valid number of days (1-5)");
      return;
    }

    setIsLoading(true);
    toast.loading("Generating your perfect trip...");

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("AI request timed out")), 30000); // 30 seconds
    });

    try {
      const prompt = `Create a detailed ${formData.noOfDays}-day trip itinerary for ${formData.location} with a budget of ₹${formData.Budget} for ${formData.People} people. Include specific places to visit, activities, and recommendations.`;

      console.log("Sending prompt to AI:", prompt);
      console.log("Gemini API Key:", config.VITE_GEMINI_API_KEY ? "Present" : "Missing");
      
      let response;
      
      try {
        // Try AI generation with timeout
        console.log("Attempting AI generation...");
        console.log("Gemini API Key:", config.VITE_GEMINI_API_KEY ? "Present" : "Missing");
        console.log("API Key length:", config.VITE_GEMINI_API_KEY?.length);
        
        // Create a fresh chat session for this request
        const freshChatSession = createChatSession();
        console.log("Fresh ChatSession created:", freshChatSession);
        
        // Test if chatSession is working
        if (!freshChatSession || typeof freshChatSession.sendMessage !== 'function') {
          throw new Error("ChatSession is not properly initialized");
        }
        
        // Test with a simple message first
        console.log("Testing simple AI message...");
        const testPrompt = "Hello, can you respond with 'AI is working'?";
        const testResult = await freshChatSession.sendMessage(testPrompt);
        console.log("Test result:", testResult);
        console.log("Test response:", testResult.response.text());
        
        // Now try the actual trip generation
        console.log("AI test successful, now generating trip...");
        const aiPromise = freshChatSession.sendMessage(prompt);
        const result = await Promise.race([aiPromise, timeoutPromise]);
        console.log("AI Result:", result);
        response = result.response.text();
        console.log("AI Response Text:", response);
      } catch (aiError) {
        console.log("AI failed or timed out, using fallback:", aiError);
        console.error("AI Error Details:", aiError);
        console.error("AI Error Stack:", aiError.stack);
        
        // Check if it's an API key issue
        if (aiError.message.includes("API_KEY")) {
          console.error("API Key issue detected");
          toast.error("Gemini API key issue. Check configuration.");
        } else if (aiError.message.includes("quota")) {
          console.error("API quota exceeded");
          toast.error("Gemini API quota exceeded. Using fallback.");
        } else if (aiError.message.includes("network")) {
          console.error("Network error");
          toast.error("Network error. Using fallback.");
        }
        
        // Fallback: Create a basic itinerary
        response = createFallbackItinerary(formData);
        console.log("Fallback response generated");
      }
      
      if (response) {
        console.log("Response received, saving to Firebase...");
        // Save to Firebase
        const tripData = {
          userId: user.sub,
          location: formData.location,
          days: formData.noOfDays,
          budget: formData.Budget,
          people: formData.People,
          itinerary: response,
          createdAt: new Date().toISOString(),
        };

        console.log("Trip data to save:", tripData);

        const tripRef = doc(db, "Trips", `${user.sub}_${Date.now()}`);
        await setDoc(tripRef, tripData);
        console.log("Trip saved to Firebase successfully");

        toast.success("Trip generated successfully!");
        
        // Navigate to all-trips page since my-trips requires a specific trip ID
        console.log("Attempting to navigate to /all-trips");
        setTimeout(() => {
          console.log("Executing navigation...");
          navigate("/all-trips");
        }, 100);
        
      } else {
        throw new Error("No response generated");
      }
    } catch (error) {
      console.error("Trip generation error:", error);
      console.error("Error stack:", error.stack);
      toast.dismiss();
      
      if (error.message.includes("timed out")) {
        toast.error("AI request timed out. Using fallback itinerary.");
        // Generate fallback itinerary
        const fallbackResponse = createFallbackItinerary(formData);
        await saveTripToFirebase(fallbackResponse);
      } else {
        toast.error(`Failed to generate trip: ${error.message}`);
      }
    } finally {
      console.log("Setting loading to false");
      setIsLoading(false);
    }
  };

  // Fallback function to create basic itinerary when AI fails
  const createFallbackItinerary = (data) => {
    const days = parseInt(data.noOfDays);
    const budget = parseInt(data.Budget);
    const people = parseInt(data.People);
    
    let itinerary = `# ${data.location} Trip Itinerary\n\n`;
    itinerary += `**Duration:** ${days} days\n`;
    itinerary += `**Budget:** ₹${budget}\n`;
    itinerary += `**Travelers:** ${people} people\n\n`;
    
    for (let day = 1; day <= days; day++) {
      itinerary += `## Day ${day}\n`;
      itinerary += `- Morning: Explore local attractions\n`;
      itinerary += `- Afternoon: Visit popular landmarks\n`;
      itinerary += `- Evening: Enjoy local cuisine\n\n`;
    }
    
    itinerary += `## Budget Breakdown\n`;
    itinerary += `- Accommodation: ₹${Math.floor(budget * 0.4)}\n`;
    itinerary += `- Food: ₹${Math.floor(budget * 0.3)}\n`;
    itinerary += `- Activities: ₹${Math.floor(budget * 0.2)}\n`;
    itinerary += `- Transportation: ₹${Math.floor(budget * 0.1)}\n\n`;
    
    itinerary += `## Tips\n`;
    itinerary += `- Book accommodations in advance\n`;
    itinerary += `- Try local street food\n`;
    itinerary += `- Use public transportation when possible\n`;
    
    return itinerary;
  };

  // Helper function to save trip to Firebase
  const saveTripToFirebase = async (itinerary) => {
    try {
      const tripData = {
        userId: user.sub,
        location: formData.location,
        days: formData.noOfDays,
        budget: formData.Budget,
        people: formData.People,
        itinerary: itinerary,
        createdAt: new Date().toISOString(),
      };

      const tripRef = doc(db, "Trips", `${user.sub}_${Date.now()}`);
      await setDoc(tripRef, tripData);

      toast.success("Fallback trip generated successfully!");
      
      // Navigate to all-trips page since my-trips requires a specific trip ID
      console.log("Attempting to navigate to /all-trips (fallback)");
      setTimeout(() => {
        console.log("Executing fallback navigation...");
        navigate("/all-trips");
      }, 100);
      
    } catch (firebaseError) {
      console.error("Firebase save error:", firebaseError);
      toast.error("Failed to save trip. Please try again.");
    }
  };

  return (
    <div ref={createTripPageRef} className="mt-10 text-center">
      <div className="text">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-5 flex items-center justify-center">
          <span className="hidden md:block">🚀</span>{" "}
          <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
            Share Your Travel Preferences{" "}
          </span>{" "}
          <span className="hidden md:block">🚀</span>
        </h2>
        <p className="opacity-90 mx-auto text-center text-lg md:text-2xl lg:text-3xl font-medium tracking-tight text-primary/80">
          Embark on your dream adventure with just a few simple details. <br />
          <span className="bg-gradient-to-b text-4xl md:text-5xl lg:text-6xl from-blue-400 to-blue-700 bg-clip-text text-center text-transparent">
            Safar
          </span>{" "}
          <br /> will curate a personalized itinerary, crafted to match your
          unique preferences!
        </p>
      </div>

      <div className="form mt-14 flex flex-col gap-16 md:gap-20 ">
        <div className="place">
          <h2 className="font-semibold text-xl md:text-2xl lg:text-3xl mb-3 ">
            <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
              Where do you want to Explore?
            </span>{" "}
            🏖️
          </h2>

          <Input
            className="w-full text-center"
            placeholder="Enter city or destination "
            value={place || ""}
            onChange={(e) => {
              setPlace(e.target.value);
              handleInputChange("location", e.target.value);
            }}
          />
        </div>

        <div className="day">
          <h2 className="font-semibold text-xl md:text-2xl lg:text-3xl mb-3 ">
            <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
              How long is your Trip?
            </span>{" "}
            🕜
          </h2>
          <Input
            className="text-center"
            placeholder="Ex: 2"
            type="number"
            min="1"
            max="5"
            name="noOfDays"
            required
            onChange={(day) => handleInputChange("noOfDays", day.target.value)}
          />
        </div>

        <div className="budget">
          <h2 className="font-semibold text-xl md:text-2xl lg:text-3xl mb-3 ">
            <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
              {" "}
              What is your Budget?
            </span>{" "}
            💳
          </h2>
          <Input
            className="text-center"
            placeholder="₹ 5000"
            type="number"
            min="1000"
            max="100000"
            required
            onChange={(budget) => handleInputChange("Budget", budget.target.value)}
          />
        </div>

        <div className="people">
          <h2 className="font-semibold text-xl md:text-2xl lg:text-3xl mb-3 ">
            <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
              Who are you traveling with?{" "}
            </span>{" "}
            🚗
          </h2>
          <Input
            className="text-center"
            placeholder="Ex: 2"
            type="number"
            min="1"
            max="10"
            name="people"
            required
            onChange={(people) => handleInputChange("People", people.target.value)}
          />
        </div>
      </div>

      <div className="create-trip-btn w-full flex items-center justify-center h-32">
        <Button disabled={isLoading} onClick={generateTrip} className="text-lg md:text-xl px-8 py-4 h-auto">
          {isLoading ? (
            <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
          ) : (
            "Let's Go 🌏"
          )}
        </Button>
      </div>

      <Dialog
        className="m-4"
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
              {user ? "Thank you for LogIn" : "Sign In to Continue"}
            </DialogTitle>
            <DialogDescription>
              <span className="flex gap-2">
                <span className="text-center w-full opacity-90 mx-auto tracking-tight text-primary/80">
                  {user
                    ? "Logged In Securely to Safar with Google Authentication"
                    : "Sign In to Safar with Google Authentication Securely"}
                </span>
              </span>
              {user ? (
                ""
              ) : (
                <Button
                  onClick={SignIn}
                  className="w-full mt-5 flex gap-2 items-center justify-center text-lg md:text-xl px-6 py-3 h-auto"
                >
                  Sign In with <FcGoogle className="h-5 w-5" />
                </Button>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose className="w-full">
              <Button variant="outline" className="w-full text-lg md:text-xl px-6 py-3 h-auto">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTrip;