const fs = require('fs');


//to read the file and get send it to the route to return the data
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
    );

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



exports.getAllTours = (req,res) => {
    res.status(200).json({
        status:'success',
        results: tours.length,
        data: {
            tours
        }
    })
}

exports.getTour = (req,res) => {
    console.log(req.params);
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id)

    if(!tour){
        return res.status(404).json({
            status: 'Failed',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status:'Success',
        data: {
            tour
        }
    });
}

exports.createTour = (req,res) => {
    // console.log(req.body)
    // res.send('Done')

    //create a new ID
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId}, req.body);

    //push the new assigned object to the exisitng file
    tours.push(newTour);

    fs.writeFile(
        `${__dirname}/starter/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        err => {
            res.status(201).json({
                status:'success',
                data: {
                    tour: newTour
                }
            })
    })
}