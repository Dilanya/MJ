const express = require('express');
const router = express.Router();

// Define a test route
router.get('/test', (req, res) => {
  res.status(200).send('Server is up and running.');
});

module.exports = router;
