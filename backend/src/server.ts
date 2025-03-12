import 'express-async-errors';
import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors, { CorsOptions } from "cors";
import { connectDB } from "./config/dbConfig";
import cookieParser from "cookie-parser";
import userMatchRoute from './routes/userMatchRoute';
import dotenv from "dotenv";
import { errorHandler } from "./utils/errorHandler/errorMiddleware";


dotenv.config();

const app: Application = express();

const allowedOrigins: string[] = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174"
];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: string | boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // ✅ Allow the request
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true
};

// Use CORS Middleware
app.use(cors(corsOptions));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());


app.get('/', async (req: Request, res: Response): Promise<Response> => {
    return res.send("Welcome to Match Maker Game API");
});


// RESTful API Routes
app.use('/api/v1', userMatchRoute);


// Error handling middleware
app.use(errorHandler);


const PORT = process.env.PORT || 4000;

async function initServer() {
  try {
    // Connect to the Database
    connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

// Start the server
initServer();
