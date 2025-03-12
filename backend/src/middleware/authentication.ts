import express, { Request, Response, NextFunction } from "express";
import UserMatch from "../models/userMatchModel";
import { ErrorHandler } from "../utils/errorHandler/errorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { errorHandler } from "utils/errorHandler/errorMiddleware";

dotenv.config();

// Extend the Request interface for authentication
export interface AuthenticatedRequest extends Request {
  user?: { userId: string } | any;
}

const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const hasAuthorization = req.headers.authorization;
    if (!hasAuthorization) {
      return ErrorHandler.unauthorized(res, "Authorization header is missing")
    }

    const token = hasAuthorization.split(" ")[1];
    if (!token) {
      return ErrorHandler.notFound(res, "Token not found");
    }

    const SECRET = process.env.JWT_SECRET;
    if (!SECRET) {
      console.error("SECRET key is not defined in the environment variables.");
      return ErrorHandler.validationError(res, "Internal Server Error");
    }

    // Verify the token
    const decodedToken = jwt.verify(token, SECRET) as JwtPayload & {
      userId: string;
    };

    // Find the user in the database
    const user = await UserMatch.findById(decodedToken.userId || decodedToken.id);
    if (!user) {
      return ErrorHandler.notFound(res, "User not found", { user: user });
    }

    // Attach the user ID to the request
    req.user = { userId: decodedToken.userId };

    next();
  } catch (error: any) {
    if (error instanceof jwt.JsonWebTokenError) {
      return ErrorHandler.unauthenticated(res, "Invalid or expired token, please log in again");
    }
    // console.error("Authentication error:", error);
    return ErrorHandler.internalServerError(res, `Authentication Error: ${error.message}`);
  }
};


// Middleware to authorize roles
const authorizeRole = (requiredRole: string) => {
  const roleHierarchy: Record<string, number> = {
      user: 1,
      admin: 2,
      superAdmin: 3,
  };

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const userRole = req.user?.role;

      // Check if the role exists and user has sufficient privileges
      if (!userRole || !(userRole in roleHierarchy)) {
          return ErrorHandler.validationError(res, "Invalid or missing role in the request.")
      }

      if (roleHierarchy[userRole] < roleHierarchy[requiredRole]) {
          return ErrorHandler.unauthorized(res, "You do not have permission to access this resource!")
      }

      // User has sufficient privileges
      next();
  };
};




export { authenticate, authorizeRole, };
