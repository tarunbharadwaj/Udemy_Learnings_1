const mongoose = require('mongoose');
const dotenv = require('dotenv');

/* -------------------------- UnCaught Exceptions -------------------------- */
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTIONS!, Shutting Down');
    console.log(err.name, err.message);
    process.exit(1);
    // server.close(() => {
        //     process.exit(1);
        // });
    });

    
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD
);

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(() => console.log('DB is connected Succesfully'));

console.log(process.env);

const port = process.env.PORT || 3500;
app.listen(port, () => {
	console.log(`The app is running succesfully at port ${port}`);
});

/* -------------------------- Unhandled Rejections -------------------------- */
process.on('unhandledRejection', (err) => {
	console.log('UNHANDLED REJECTION!, Shutting Down...');
    
	//We shut down the application: 0 for sucess and 1 for uncaught exception
	//It's better to close the server first then the application
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});

