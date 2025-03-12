import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from "fs";
import libphonenumber from "google-libphonenumber";
import cloudinary from "../middleware/cloudinary";
import { VerifyTokenResult } from "../interfaces/interface";
import ms, { StringValue } from 'ms';
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY: string = process.env.JWT_SECRET || 'your_secret_key';


// Helps mask the email
export const maskEmail = (email: string): string => {
    const [name, domain] = email.split("@");
    
    if (!name || !domain) {
        throw new Error("Invalid email format");
    }
  
    const visiblePart = name.slice(0, 5); // Keep the first 5 characters visible
    const maskedPart = "*".repeat(name.length - 5); // Mask the remaining characters
  
    return `${visiblePart}${maskedPart}@${domain}`;
  }
  
  interface ValidationResult {
    success: boolean;
    phoneNumber?: string;
    countryCode?: number;
    region?: string;
    formatted?: string;
    message?: string;
  }
  
// Validate phone number against the country code   
export const validatePhoneNumber = (phoneNumber: string): ValidationResult => {
    const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
    const regionDisplay = new Intl.DisplayNames(['en'], { type: 'region' });
  
    try {
      // Ensure the phone number starts with "+"
      if (!phoneNumber.startsWith("+")) {
        phoneNumber = `+${phoneNumber}`;
      }
  
      // Parse the phone number
      const parsedNumber = phoneUtil.parse(phoneNumber);
  
      // Get country code and region code
      const countryCode = parsedNumber.getCountryCode();
      const regionCode = phoneUtil.getRegionCodeForNumber(parsedNumber);
  
      const countryName = regionCode ? regionDisplay.of(regionCode) : "Unknown Country";
  
      // Check if the number is valid and possible
      const isValid = phoneUtil.isValidNumber(parsedNumber);
      const isPossible = phoneUtil.isPossibleNumber(parsedNumber);
      const reason = phoneUtil.isPossibleNumberWithReason(parsedNumber);
  
      if (reason === libphonenumber.PhoneNumberUtil.ValidationResult.TOO_SHORT ||
          reason === libphonenumber.PhoneNumberUtil.ValidationResult.TOO_LONG) {
        return {
          success: false,
          message: `The phone number length is incorrect for ${countryName}.`,
        };
      }
  
      if (!isPossible) {
        return {
          success: false,
          message: `The phone number length is incorrect for ${countryName}.`,
        };
      }
  
      if (!isValid) {
        return {
          success: false,
          message: `Invalid phone number for ${countryName}.`,
        };
      }
  
      return {
        success: true,
        phoneNumber,
        countryCode,
        region: regionCode,
        formatted: phoneUtil.format(parsedNumber, libphonenumber.PhoneNumberFormat.E164),
      };
  
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: "An unknown error occurred." };
    }
  };
  
  
// Turns a word or string to a Title case
export const toTitleCase = (str: string) => {
    return str.toLowerCase().split(" ").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };
  
// Generate a 6 digit OTP (One Time Passcode)
export const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };


// Generate a token with a payload and time-to-live (ttl).
export const generateToken = (payload: object, ttl: string): string => {
  // If ttl is a string, explicitly cast it to ms.StringValue.
  const expiresIn: number | StringValue = typeof ttl === 'string' ? ttl as StringValue : ttl;
  const options: SignOptions = { expiresIn, algorithm: 'HS256' };
  return jwt.sign(payload, SECRET_KEY, options);
  }
  

// Verify a token and always resolve to a result object instead of throwing an error
export const verifyToken = (token: string): Promise<VerifyTokenResult> => {
    return new Promise((resolve) => {
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          resolve({ valid: false, error: err });
        } else {
          resolve({ valid: true, decoded: decoded as string | JwtPayload });
        }
      });
    });
  }

// Generate password (e.g: Abcde12@#)
  export const generatePassword = (length: number = 8): string => {
    if (length < 8) {
      throw new Error("Password length must be at least 8 characters.");
    }
  
    const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const specialChars = "!@#$%^&*()_+[]{}|;:',.<>?/";
  
    const allChars = upperCaseChars + lowerCaseChars + numberChars + specialChars;
  
    // Ensure the password has at least one of each required character type
    let password = "";
    password += upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)];
    password += lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)];
    password += numberChars[Math.floor(Math.random() * numberChars.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
  
    // Fill the remaining length with random characters from all character types
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
  
    // Shuffle the password to ensure randomness
    const shuffledPassword = password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
  
    return shuffledPassword;
  };

// Generate alphanumeric code (for custom ID)
export const generateAlphanumericCode = (num: number = 6): string => {
    let code = "";
    while (code.length < num) {
      code += Math.random().toString(36).substring(2);
    }
    return code.substring(0, num).toUpperCase();
  };


// Hash the password
export const hashPassword = async (password: string, salt: number): Promise<string> => {
    const saltRounds = salt | 10;
    return await bcrypt.hash(password, saltRounds);
  }
  
  // Compare the plain text password with the hashed password
  export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
  }


// Function to upload or overwrite an image to cloudinary
export const uploadImageToCloudinary = async (image: string, publicId?: string) => {
    try {
      if (publicId) {
        // Overwrite existing image using public_id
        return await cloudinary.uploader.upload(image, {
          public_id: publicId,
          overwrite: true,
        });
      } else {
        // Upload new image
        return await cloudinary.uploader.upload(image, {
          folder: "Event-Parcel-Images",
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error)
      throw new Error("Error uploading photo to Cloudinary: " + error.message);
    }
  };


  export const uploadImage = async (filePath: string, publicId?: string): Promise<{ secure_url: string; public_id: string }> => {
    try {
      const result = await uploadImageToCloudinary(filePath, publicId);
      await fs.promises.unlink(filePath); // Remove local file after upload
      if (!result) {
        throw new Error("Failed to upload image to Cloudinary");
      }
      return result;
    } catch (error: any) {
      throw new Error(`Error uploading image: ${error.message}`);
    }
  };


  export const deleteImage = async (publicId: string): Promise<boolean> => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result.result === "ok";
    } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        return false;
    }
};