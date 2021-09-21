const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('DB is connected Succesfully'));


// const testTour = new Tour({
//     name: 'The terrace',
//     rating: 4.9,
//     price: 500
// });

// testTour
// .save()
// .then(doc => {
//     console.log(doc)
// })
// .catch(err => {
//     console.log(err);
// })



console.log(process.env);

const port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`The app is running succesfully at port ${port}`)
})