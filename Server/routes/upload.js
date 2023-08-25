const express = require('express');
const multer = require('multer');
const path = require('path');
const connection = require('../connection')
const uuid = require('uuid');
const axios = require("axios");
const dotenv = require('dotenv');
const router = express.Router();
dotenv.config();



router.post('/webhook', async (req, res) => {
  try {
    const eventData = req.body; // You can process the incoming data as needed
    const urls = req.body.imageUrls
    console.log('Webhook Event:', eventData);
    const serializedUrls = JSON.stringify(urls);
      console.log(serializedUrls)
      const insertQuery = 'INSERT INTO prompt (mj_Urls) VALUES ?';
      connection.query(insertQuery, serializedUrls, (err, results) => {
        if (err) {
          reject(err);
        } else {
          console.log('Image and Message ID saved to the database');
          resolve();
        }
      });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
      const timestamp = Date.now();
      const extension = path.extname(file.originalname);
      const filename = `image-${timestamp}${extension}`;
      cb(null, filename);
  }
  
});


const upload = multer({ storage: storage });

// Handle image upload
router.post('/upload', upload.single('image'), async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const hashId = uuid.v4(); 
  const fileName = req.file.filename; 
  const imageUrl = `https://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
  const userPrompt = req.body.prompt || req.query.prompt; 
  console.log('userPrompt:', userPrompt); 
  
  try {
    
    const postApiResponse = await callPostAPI(imageUrl,hashId, fileName, userPrompt);
    //const postApiResponse = await saveImageToDatabase(hashId, fileName, userPrompt)
    res.send(postApiResponse);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

async function saveImageToDatabase(hashId, fileName, userPrompt, messageId) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO prompt (hash_ID, upload_Image, prompt, message_ID) VALUES (?, ?, ?, ?)';
    connection.query(query, [hashId, fileName, userPrompt, messageId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        console.log('Image and Message ID saved to the database');
        resolve();
      }
    });
  });
}


function callPostAPI(imageUrl,hashId, fileName, userPrompt) {
    const authToken = process.env.auth_token;
    const data = JSON.stringify({
      msg: imageUrl + ' ' + userPrompt,
      ref: hashId,
      webhookOverride: "https://india.roosterapps.online/webhook"
    });
    console.log(data)
  
    const config = {
      method: "post",
      url: "https://api.thenextleg.io/v2/imagine",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
      },
      data: data
    };
  
     axios(config)
    .then(response => {
      console.log("POST Response:", response.data);
      const messageId = response.data.messageId;
      return saveImageToDatabase(hashId, fileName, userPrompt, messageId)
        
    });
}

module.exports = router;
