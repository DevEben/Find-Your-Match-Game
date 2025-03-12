import { Router } from "express";
import {
  getUserZodiacs, 
  checkCompatibility

} from "../controllers/userMatchController";
import { authenticate } from "../middleware/authentication";
// import { upload } from '../middleware/multer';


const router = Router();

// Route to get zodiac signs
router.post("/get-zodiac", getUserZodiacs);

// Route to check lover's compactibility
router.post("/check-compatibility", checkCompatibility);


export default router;
