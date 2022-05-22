const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { PORT } = require('./config');
const { showBody } = require('./middleware');
const userRoute = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(showBody);
app.use(cors());

app.get('/', (req, res) => {
  res.send({ msg: 'Server is running' });
});

// Routes
app.use('/', userRoute);

app.all('*', (req, res) => {
  res.status(400).send({ error: 'Page not found' });
});

app.listen(PORT, () => console.log('Listening on port', PORT));
