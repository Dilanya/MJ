const express = require('express');
const router = express.Router();
const connection = require('../connection')

router.get('/generated-image/:hashId', async (req, res) => {
  try {
    const hashId = req.params.hashId;
    const selectQuery = 'SELECT mj_Urls FROM prompt WHERE hash_ID = ? LIMIT 1';
    connection.query(selectQuery, [hashId], (err, results) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        
        if (results.length > 0) {
          const firstUrlArray = JSON.parse(results[0].mj_Urls);
          if (Array.isArray(firstUrlArray) && firstUrlArray.length > 0) {
            const firstUrl = firstUrlArray[0];
            res.status(200).json({ firstUrl });
          } else {
            console.error("No URLs found or invalid data format.");
            res.status(504).json({ error: 'request timed out' });
          }
          
        } else {
          res.status(404).json({ error: 'No data found' });
        }
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
