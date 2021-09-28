const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // /* --------------------- Filtering the DB query -------------------- */
    // //BUILD QUERY
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach(el => delete queryObj[el]);

    // // console.log(req.query, queryObj);

    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)   //Regular Expression
    // // console.log(JSON.parse(queryStr));

    // let query = Tour.find(JSON.parse(queryStr));

    // //SORTING
    // if(req.query.sort){
    //     const sortBy = req.query.sort.split(',').join(' ');
    //     console.log(sortBy);
    //     query = query.sort(sortBy);
    // }else {
    //     query = query.sort('-createdAt');    //default sorting when sending the basic routing api
    // }

    // //FIELD LIMITING
    // if(req.query.fields){
    //     const fields = req.query.fields.split(',').join(' ');
    //     query = query.select(fields)
    // } else{
    //     query = query.select('-__v');   //default field limiting when sending the basic routing api
    // }

    // //PAGINATION
    // // it is to convert the string into a number and then keep the defualt value page 1
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if(req.query.page){
    //     const numTours = await Tour.countDocuments();
    //     if(skip >= numTours) throw new Error ('The page does not exist');
    // }

    //QUERY METHOD 1
    //EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const tours = await features.query;

    //query.sort().select().skip().limit()
    //{ difficulty: 'easy', duration: { $gte: '5' } }

    //QUERY METHOD 2
    // const tours = await Tour
    // .find()
    // .where('duration')
    // .equals(5)
    // .where('difficulty')
    // .equals('easy')

    res.status(200).json({
      status: 'success',
      // requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    /* ------------------------ to save the data into DB ----------------------- */
    // const newTour = await new Tour({})
    // newTour.save();

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: 'null',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

//Use of Aggreagrate Pipeline
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          // _id: '$ratingsAverage',
          // _id: null,
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 }, //to sort by one based on ascending order
      },
      // {
      //     $match: { _id: { $ne: 'EASY' }}
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: { 
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numTourStarts: -1 }
        },
        {
            $limit: 12
        }
    ])

    res.status(200).json({
        status: 'success',
        data: plan
      });

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
