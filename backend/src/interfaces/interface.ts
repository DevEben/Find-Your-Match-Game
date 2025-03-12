import { JwtPayload } from "jsonwebtoken";

// The result type for token verification
export interface VerifyTokenResult {
    valid: boolean;
    decoded?: string | JwtPayload;
    error?: any;
  }


export interface IApiResponse {
    success: boolean;
    message: string;
    data?: any;
  }