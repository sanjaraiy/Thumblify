import express from 'express';
import { getThumbnailsbyId, getUsersThumbnails } from '../controllers/UserControllers.js';
import protect from '../middlewares/auth.js';

const UserRouter = express.Router();

UserRouter.get('/thumbnails', protect, getUsersThumbnails);
UserRouter.get('/thumbnail/:id', protect, getThumbnailsbyId);


export default UserRouter;
