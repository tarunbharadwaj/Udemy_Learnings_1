const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./starter/utils/appError');
const globalErrorHandler = require('./starter/controllers/errorController');

const tourRouter = require('./starter/routes/tourRoutes');
const userRouter = require('./starter/routes/userRoutes');
const reviewRouter = require('./starter/routes/reviewRoutes');

/* --------------------------- use of MIDDLEWARES --------------------------- */
// Set security HTTP headers
app.use(helmet())

// Development logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

// Limit requests from the same API
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP. Please try again after 1 hour'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS(Cross-Side-Scripting Attack)
app.use(xss());

// Prevent paramater pollution
app.use(hpp({
	whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price']
}));

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	// console.log(req.headers);

	next();
});

/* --------------------------------- Routes --------------------------------- */
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

/* ------------------------------------ Error Handling ----------------------------------- */
app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Implementing Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
