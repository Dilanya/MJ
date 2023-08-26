const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;


const corsOptions = {
  origin: 'https://pawlific-shop.myshopify.com', // Replace with your React app's URL
  optionsSuccessStatus: 200,
  credentials: true, // Enable cookies
};

app.use(cors(corsOptions));
app.use(bodyParser.json({limit: '20mb'}));
 //Serve uploaded files statically
app.use('/uploads', express.static('uploads'));



const uploadRoutes = require('./routes/upload');
app.use(uploadRoutes);
const testRoute = require('./routes/test');
app.use(testRoute);
const getRoute = require('./routes/getData')
app.use(getRoute)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
