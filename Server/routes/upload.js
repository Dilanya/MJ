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
    console.log('Webhook Event:', eventData);

    if (eventData.progress === 100) {
      const fullResponse = await callGetAPI(eventData.messageId);
      res.status(200).json({ message: 'Webhook received and processed successfully', response: fullResponse });
    } else {
      res.status(200).json({ message: 'Webhook received', progress: eventData.progress });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});



// Configure storage for uploaded images
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

// Handle image upload
router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const hashId = uuid.v4(); 
  const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;
  const userPrompt = req.query.prompt || ''; 

  try {
    // Save the customer's hash ID and image URL to the database
    await saveImageToDatabase(hashId, imageUrl);

    // Call external API
    const postApiResponse = await callPostAPI(imageUrl, userPrompt);
    

    res.send(postApiResponse);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

async function saveImageToDatabase(hashId, imageUrl) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO customers (hash_id, image_url) VALUES (?, ?)';
    connection.query(query, [hashId, imageUrl], (err, results) => {
      if (err) {
        reject(err);
      } else {
        console.log('Image saved to the database');
        resolve();
      }
    });
  });
}




function callPostAPI(imageUrl,userPrompt) {
    const authToken = process.env.auth_token;
    const data = JSON.stringify({
      msg: imageUrl + ' ' + userPrompt,
      ref: "",
      webhookOverride: "http://localhost:3000/webhook"
    });
  
    const config = {
      method: "post",
      url: "https://api.thenextleg.io/v2/imagine",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
      },
      data: data
    };
  
    return axios(config)
    .then(response => {
      console.log("POST Response:", response.data); // Log the raw POST response
      const messageId = response.data.messageId;
      return callGetAPI(messageId); // Call the GET API with the messageId
    })
    .catch(error => {
      throw error;
    });
}


function callGetAPI(messageId) {
  const authToken = process.env.auth_token; 
  const config = {
    method: 'get',
    url: `https://api.thenextleg.io/v2/message/${messageId}`,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  };

  return axios(config)
    .then(response => {
      
      return response.data; 
    })
    .catch(error => {
      throw error;
    });
}

module.exports = router;
