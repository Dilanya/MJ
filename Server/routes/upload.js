const express = require('express');
const multer = require('multer');
const path = require('path');
const connection = require('../connection')
const uuid = require('uuid');
const axios = require("axios");
const dotenv = require('dotenv');
const router = express.Router();
const fs = require('fs');
const heicConvert = require('heic-convert');
dotenv.config();



router.post('/webhook', async (req, res) => {
  try {
    const eventData = req.body; // You can process the incoming data as needed
    const urls = req.body.imageUrls
    console.log('Webhook Event:', eventData);
    const serializedUrls = JSON.stringify(urls);
    console.log(serializedUrls)
    const originatingMessageId = req.body.originatingMessageId;
    return new Promise((resolve, reject) => {
      const updateQuery = 'UPDATE prompt SET mj_Urls = ? WHERE message_ID = ?';
      connection.query(updateQuery, [serializedUrls, originatingMessageId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          console.log('webhook data received');
          resolve();
        }
      });
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


const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024}
   });

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
  const customerId = '906405506686'
  console.log('userPrompt:', userPrompt); 
  
  try {
    const customerTokens = await getCustomerTokens(customerId);
    const purchaseTokens = customerTokens.purchase_Tokens;
    const usedTokens = customerTokens.used_Tokens
    const remainingTokens = purchaseTokens - usedTokens;
    console.log('remain:',remainingTokens);
    
    if (remainingTokens > 0) {
      
      const postApiResponse = await callPostAPI(imageUrl,hashId, fileName, userPrompt, customerId);

      await updateCustomerTokens( (usedTokens+1), customerId);

      
      res.status(200).json({ hashId });
    } else {
      res.status(400).send('Insufficient tokens.');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred.');
  }
});
 

async function saveImageToDatabase(hashId, fileName, userPrompt, messageId, customerId ) {
  return new Promise((resolve, reject) => {
  const query = 'INSERT INTO prompt (hash_ID, upload_Image, prompt, message_ID, customer_ID ) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [hashId, fileName, userPrompt, messageId, customerId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        console.log('Image and Message ID saved to the database');
        resolve();
      }
    });
  });
}

const getCustomerTokens = (customerId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT purchase_Tokens, used_Tokens FROM customer WHERE customer_ID = ?';
    connection.query(query, [customerId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        const customerTokens = results[0];
        console.log(customerTokens)
        resolve(customerTokens); 
      }
    });
  });
};


const updateCustomerTokens = (newUsedTokens, customerId) => {
  return new Promise((resolve, reject) => {
    const updateQuery = 'UPDATE customer SET used_Tokens = ? WHERE customer_ID = ?';
    connection.query(updateQuery, [newUsedTokens, customerId], (updateError, updateResults) => {
      if (updateError) {
        reject(updateError);
      } else {
        resolve();
      }
    });
  });
};


async function callPostAPI(imageUrl, hashId, fileName, userPrompt, customerId) {
  try {
    const authToken = process.env.auth_token;
    let data;
  
    if (fileName.endsWith('.heic')) {
      const heicBuffer = fs.readFileSync(`uploads/${fileName}`);
      const pngBuffer = await heicConvert({
        buffer: heicBuffer,
        format: 'PNG'
      });
    
      const newFileName = fileName.replace('.heic', '.png');
      fs.writeFileSync(`uploads/${newFileName}`, pngBuffer);
    
      data = JSON.stringify({
        msg: `${imageUrl.replace('.heic', '.png')} ${userPrompt}`,
        ref: hashId,
        webhookOverride: "https://india.roosterapps.online/webhook"
      });
    } else {
      data = JSON.stringify({
        msg: imageUrl + ' ' + userPrompt,
        ref: hashId,
        webhookOverride: "https://india.roosterapps.online/webhook"
      });
    }

    const config = {
      method: "post",
      url: "https://api.thenextleg.io/v2/imagine",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
      },
      data: data
    };
  
    const response = await axios(config);
    console.log("POST Response:", response.data);
    const messageId = response.data.messageId;
    await saveImageToDatabase(hashId, fileName, userPrompt, messageId, customerId);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}


module.exports = router;