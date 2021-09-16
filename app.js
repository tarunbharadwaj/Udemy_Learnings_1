const express = require('express');
const fs = require('fs');
var app = express();
var port = 3500;


//use of MIDDLEWARES
app.use(express.json())

app.use((req,res,next) => {
    console.log('Hello from the middleware method');
    next();
});


//to read the file and get send it to the route to return the data
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/starter/dev-data/data/tours-simple.json`)
    );


    
//ROUTE HANDLERS
//Refactoring of the code
 const getAllTours = (req,res) => {
    res.status(200).json({
        status:'success',
        results: tours.length,
        data: {
            tours
        }
    })
}

const getTour = (req,res) => {
    console.log(req.params);
    const _id = req.params.id * 1;
    const tour = tours.find(el => el.id === _id)

    if(_id > tours.length){
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

const createTour = (req,res) => {
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

const getAllUsers = (req,res) => {
    res.status(500).json({
        status:'error',
        message: 'This route is not defined yet'
    })
}

const createUser = (req,res) => {
    res.status(500).json({
        status:'error',
        message: 'This route is not defined yet'
    })
}

const getUser = (req,res) => {
    res.status(500).json({
        status:'error',
        message: 'This route is not defined yet'
    })
}

const updateUser = (req,res) => {
    res.status(500).json({
        status:'error',
        message: 'This route is not defined yet'
    })
}

const deleteUser = (req,res) => {
    res.status(500).json({
        status:'error',
        message: 'This route is not defined yet'
    })
}



//VARIOUS ROUTES
//to get all tours
app.get('/api/v1/tours', getAllTours);

//to get tours based on params
app.get('/api/v1/tours/:id', getTour);

//to create a new tour
app.post('/api/v1/tours', createTour);

//to get all users
app.get('/api/v1/users', getAllUsers);

//to create user
app.post('/api/v1/users', createUser);

//to get a user based on param
app.get('/api/v1/users/:id', getUser);

//to update a user
app.patch('/api/v1/users', updateUser);

//to delete a user
app.delete('/api/v1/users', deleteUser);

// //Another Way of refactoring the routes
// app
// .route('/api/v1/tours')
// .get(getAllTours)
// .post(createTour);

// app
// .route('/api/v1/tours/:id')
// .get(getTour)




//START SERVER
app.listen(port, () => {
    console.log(`The app is running succesfully at port ${port}`)
})