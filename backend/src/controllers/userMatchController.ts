import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import zodiacData from "../utils/zodiacData";
import { sendResponse } from "../utils/ApiHandler/ApiResponse";
import { ErrorHandler } from "../utils/errorHandler/errorHandler";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

// Function to get Zodiac Sign from Birthday
export const getZodiacSign = (day: number, month: number) => {
  return (
    zodiacData.find(
      (z) =>
        (day >= z.startDay && month === z.startMonth) ||
        (day <= z.endDay && month === z.endMonth)
    ) || null
  );
};

// Function to get Zodiac sign
export const getUserZodiacs = (req: Request, res: Response) => {
  try {
    const { day, month } = req.body;
    if (!day || !month) {
      return ErrorHandler.badUserInput(res, "Input the right day and month");
    }

    const sign = getZodiacSign(day, month);
    if (!sign) {
      return ErrorHandler.badUserInput(res, "Invalid date");
    }

    return sendResponse(res, 200, "Zodiac Sign successfully fetched!", {
      zodiac: sign.name,
      image: sign.image,
    });
  } catch (error: any) {
    console.error("Zodiac Sign Fetch Error:", error);
    return ErrorHandler.internalServerError(res, error.message);
  }
};

// Route: Check Compatibility Using AI (Gemini)
export const checkCompatibility = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const { userName, loverName, userDOB, loverDOB } = req.body;

    if (!userName || !userDOB || !loverName || !loverDOB) {
      return ErrorHandler.badUserInput(res, "All fields are required");
    }

    // Get Zodiac Signs
    const userZodiac = getZodiacSign(userDOB.day, userDOB.month);
    const loverZodiac = getZodiacSign(loverDOB.day, loverDOB.month);

    if (!userZodiac || !loverZodiac) {
      return ErrorHandler.badUserInput(res, "Invalid date input");
    }

    // AI Prompt
    const prompt = `
      Analyze the romantic compatibility between ${userName} (${userZodiac.name}) and ${loverName} (${loverZodiac.name}).
      Respond in a strict JSON format with the following fields:
      {
          "matchScore": Number (between 0-100),
          "description": String (short explanation),
          "advice": String (relationship advice)
      }
    `;

    const response = await model.generateContent(prompt);

    // Extract AI response text
    let aiResponseText = await response.response.text();
    aiResponseText = aiResponseText.replace(/```json|```/g, "").trim(); // Remove Markdown

    // Parse AI response
    let aiResponse;
    try {
      aiResponse = JSON.parse(aiResponseText);
    } catch (parseError) {
      return ErrorHandler.internalServerError(res, "AI response format is invalid");
    }

    return sendResponse(res, 200, "Match compatibility retrieved successfully", {
      user: { name: userName, zodiac: userZodiac.name },
      lover: { name: loverName, zodiac: loverZodiac.name },
      matchScore: aiResponse.matchScore || Math.floor(Math.random() * 101),
      matchDescription: aiResponse.description || "AI couldn't provide details",
      relationshipAdvice: aiResponse.advice || "No advice provided",
    });
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    return ErrorHandler.internalServerError(res, error.message);
  }
};
