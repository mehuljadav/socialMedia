const express = require('express');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: 'config/config.env' });

const app = express();
//
//
// Importing Routes
//
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');

//
//
//
//

app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//
//
// Route Middleware
//
// app.get('/api/v1/posts', () => {
//   console.log('hello');
// });

app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

app.use(globalErrorHandler);
module.exports = app;
