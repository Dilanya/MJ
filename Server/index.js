const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;


const allowedOrigins = [
  'https://pawlific-shop.myshopify.com',
  'https://demo-mid-journey-api.myshopify.com'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json({limit: '10mb'}));
 //Serve uploaded files statically
app.use('/uploads', express.static('uploads'));


const shopifyRoute = require('./routes/shopify');
app.use(shopifyRoute);
const uploadRoute = require('./routes/upload');
app.use(uploadRoute);
const testRoute = require('./routes/test');
app.use(testRoute);
const getRoute = require('./routes/getData')
app.use(getRoute);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
