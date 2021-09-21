const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'A tour name has to be specified'],
        unique: true
    },
    rating:{
        type:Number,
        default: 4.5
    },
    price:{
        type:Number,
        required: [true, 'A tour price to be specified']
    }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;