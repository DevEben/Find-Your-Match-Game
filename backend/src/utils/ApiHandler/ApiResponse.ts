import express, { Request, Response } from "express";
import { IApiResponse } from "../../interfaces/interface";
  
  export const sendResponse = (res: Response, statusCode: number, message: string, data?: any) => {
    const response: IApiResponse = { success: statusCode >= 200 && statusCode < 300, message, data };
    return res.status(statusCode).json(response);
  };

 