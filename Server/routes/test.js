const express = require('express');
const router = express.Router();


router.get('/test', (req, res) => {
  res.status(200).send('Server is up and running.');
});

module.exports = router;
