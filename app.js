const express = require('express');
const app = express();
// const morgan = require('morgan');
const AppError = require('./starter/utils/appError');
const globalErrorHandler = require('./starter/controllers/errorController');

const tourRouter = require('./starter/routes/tourRoutes');
const userRouter = require('./starter/routes/userRoutes');

/* --------------------------- use of MIDDLEWARES --------------------------- */
// if(process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
// }

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

/* --------------------------------- Routes --------------------------------- */
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

/* ------------------------------------ Error Handling ----------------------------------- */
app.all('*', (req, res, next) => {
	// res.status(404).json({
	//     status: 'fail',
	//     message: `Can't find ${req.originalUrl} on this server`
	// })

	//For Global Error Handling Middleware
	// const err = new Error(`Can't find ${req.originalUrl} on this server`);
	// err.status = 'fail';
	// err.statusCode = 404;

	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Implementing Global Error Handling Middleware
app.use(
	globalErrorHandler
	// (err, req, res, next) => {
	// err.statusCode = err.statusCode || 500;
	// err.status = err.status || 'error';

	// res.status(err.statusCode).json({
	//     status: err.status,
	//     message: err.message
	// })
	// }
);

module.exports = app;
