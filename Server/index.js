const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;



app.use(bodyParser.json());
// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));


app.use(cors());
const uploadRoutes = require('./routes/upload');
app.use(uploadRoutes);
const testRoute = require('./routes/test');
app.use(testRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
