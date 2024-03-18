import express from 'express' ;
const router = express.Router();
import multer from 'multer';
const uploads =multer({dest:"uploads/"})
import verify from '../midleware/jwtParcedToReq.js';
import authorization from '../midleware/jwtAuthorization.js';
import { home,login,signup,profile,uploadPost } from '../controllers/userControllers.js';

router.get('/',verify,home,);
router.post('/login',login);
router.post('/signup',signup);
router.get('/profile',authorization,verify,profile);
router.post('/upload',verify,uploads.single('image'),uploadPost);




export default router