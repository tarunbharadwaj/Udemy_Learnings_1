const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');


console.log(process.env);

const port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`The app is running succesfully at port ${port}`)
})