const express = require('express');
var app = express();
const tourRouter = require('./starter/routes/tourRoutes');
const userRouter = require('./starter/routes/userRoutes');


/* --------------------------- use of MIDDLEWARES --------------------------- */
app.use(express.json())

app.use((req,res,next) => {
    console.log('Hello from the middleware method');
    next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;