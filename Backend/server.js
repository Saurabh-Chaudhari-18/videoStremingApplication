const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const videoRoutes = require('./routes/videoRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to log incoming requests with status
app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(`MongoDB connection error: ${err.message}`));

// Root route to display a message on the screen
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Backend Server</title>
      </head>
      <body style="font-family: Arial, sans-serif;">
        <h1 style="color: green;">Backend Server is Running!</h1>
        <p>You can access the API at <strong>${req.protocol}://${req.get('host')}/api</strong></p>
      </body>
    </html>
  `);
});

// API routes
app.use('/api', videoRoutes);

// 404 handler for non-existing routes
app.use((req, res) => {
  res.status(404).send(`
    <html>
      <head>
        <title>404 Not Found</title>
      </head>
      <body style="font-family: Arial, sans-serif; color: red;">
        <h1>404: Page Not Found</h1>
        <p>The page you're looking for doesn't exist. Please check the URL.</p>
      </body>
    </html>
  `);
});

// Server setup
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
