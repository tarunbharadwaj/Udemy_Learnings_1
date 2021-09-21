const Tour = require('./../models/tourModel');
// const fs = require('fs');

//to read the file and get send it to the route to return the data
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
//     );

//Param Middleware
// exports.checkID = ((req, res, next, val) => {
//     console.log(`ID is: ${val}`);
    
//     if(!tour){
//         return res.status(404).json({
//             status: 'Failed',
//             message: 'Invalid ID'
//         });
//     }

//     next();
// })


exports.getAllTours = async (req,res) => {

    try {
        /* --------------------- to get all the data from the DB -------------------- */
        const tours = await Tour.find();
    
        res.status(200).json({
            status:'success',
            // requestedAt: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err    
        })
    }
}

exports.getTour = async (req,res) => {
    
    try {
        //Tour.findOne({ _id: req.params.id })
        const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status:'Success',
            data: {
                tour
            }
        });

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err    
        })
    }
      
    
    
    
    // console.log(req.params);
    // const id = req.params.id * 1;
    // const tour = tours.find(el => el.id === id)

    // if(!tour){
    //     return res.status(404).json({
    //         status: 'Failed',
    //         message: 'Invalid ID'
    //     });
    // }

}

exports.createTour = async (req,res) => {

    try { 
        /* ------------------------ to save the data into DB ----------------------- */
        // const newTour = await new Tour({})
        // newTour.save();

        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status:'success',
            data: {
                tour: newTour
            }
        })
    } catch (err) {
        res.send(400).json({
            status: 'fail',
            message: err
        })
    }
    
    // console.log(req.body)
    // res.send('Done')

    //create a new ID
    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({ id: newId}, req.body);

    // //push the new assigned object to the exisitng file
    // tours.push(newTour);

    // fs.writeFile(
    //     `${__dirname}/starter/dev-data/data/tours-simple.json`,
    //     JSON.stringify(tours),
    //     err => {
            
    // })

}

exports.updateTour = async (req,res) => {

    try { 
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true, //this is to send new updated one to the client
            runValidators: true //validates the updated data against the given schema
        })

        res.status(200).json({
            status:'success',
            data: {
                tour
            }
        });

    } catch (err) {
        res.send(400).json({
            status: 'fail',
            message: err
        })
    }
    
}

exports.deleteTour = async (req,res) => {

    try { 
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status:'success',
            data: 'null'
        });

    } catch (err) {
        res.send(400).json({
            status: 'fail',
            message: err
        })
    }
    
}