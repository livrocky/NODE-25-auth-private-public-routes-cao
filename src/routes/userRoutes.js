const express = require('express');

const router = express.Router();

userRoute.post('/register', (req, res) => {
  res.send('prisijungei');
});

module.exports = router;
