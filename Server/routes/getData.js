const express = require('express');
const router = express.Router();
const connection = require('../connection')

router.get('/generated-image', async (req, res) => {
  try {
    const selectQuery = 'SELECT mj_Urls FROM prompt LIMIT 1';
    connection.query(selectQuery, (err, results) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        if (results.length > 0) {
          const firstUrlArray = JSON.parse(results[0].mj_Urls);
          const firstUrl = firstUrlArray[0];
          res.status(200).json({ firstUrl });
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
