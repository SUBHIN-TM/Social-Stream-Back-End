import express from 'express' ;
const router = express.Router();

import verify from '../midleware/jwtParcedToReq.js';
import authorization from '../midleware/jwtAuthorization.js';
import { home,login,signup,profile } from '../controllers/userControllers.js';

router.get('/',verify,home,);
router.post('/login',login);
router.post('/signup',signup);
router.get('/profile',authorization,verify,profile);




export default router