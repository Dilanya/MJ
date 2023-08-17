const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
require('dotenv').config(); 

const app = express();


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/", (req, res) => {
  const imageUrl = req.body.imageUrl; 

  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  const authToken = process.env.auth_token;
  const data = JSON.stringify({
    msg: imageUrl,
    ref: "",
    webhookOverride: ""
  });

  const config = {
    method: "post",
    url: "https://api.thenextleg.io/v2/imagine",
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json"
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
