import {v2 as cloudinary} from 'cloudinary';
          



import env from "dotenv"
env.config()
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

// cloudinary.config({ 
//     cloud_name: 'dsgctlkzt', 
//     api_key: '764986656521813', 
//     api_secret: 'V0EFNneZElocCS6uUnX8-22khew' 
//   });

export default cloudinary;

