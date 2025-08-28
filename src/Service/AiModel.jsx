import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { config } from "../config.js";

const apiKey = config.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Create a function that returns a fresh chat session for each request
export const createChatSession = () => {
  return model.startChat({
    generationConfig,
    // No history - fresh conversation each time
  });
};

// Keep the old export for backward compatibility, but it's better to use createChatSession()
export const chatSession = createChatSession();
