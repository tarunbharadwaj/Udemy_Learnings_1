const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour name has to be specified'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal to 40 characters'],
      minlength: [10, 'A tour name must have minimum or equal to 10 characters']
      //   validate: [validator.isAlpha, 'Tour must contain only characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a dificulty'],
      enum: {
          values: ['easy','medium','difficult'],
          message: 'A difficulty must be either: easy,medium,difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A rating must be above or equal to 1.0'],
      max: [5.0, 'A rating must be below or equal to 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour price to be specified']
    },
    priceDiscount: {
       type: Number,
       validate: {
           validator: function(val) {
               return val < this.price;
           },
           message: 'Disocunt price ({VALUE}) should be below the regular price'
       } 
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, //to avoid any particular schema to be shown to the client
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Use of Virtual Properties
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
tourSchema.pre('/^find/', function (next) { //will  all the query related to find
  this.find({ secretTour: { $ne: true } });
//   this.start = Date.now();
  next();
});

tourSchema.post('/^find/', function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds`);
  console.log(docs);
  next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

    console.log(this.pipeline());
    next();
  });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
