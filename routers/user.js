import express from 'express' ;
const router = express.Router();


import { home } from '../controllers/userControllers.js';

router.get('/',home);


export default router;