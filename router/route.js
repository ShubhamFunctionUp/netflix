const express = require('express');
const router = express();
const UserController = require('../controller/userController')
const MovieController = require('../controller/moviecontroller')
const middleware = require('../middleware/auth')
router.get('/',async ()=>(console.log("router")))

// User Route
router.post('/register',UserController.register)
router.post('/login',UserController.login)
router.get('/getMovie/:userId',middleware.auth,middleware.autho,UserController.getDetails);
router.put('/addSubscription/:userId',UserController.addSubscription);

// Movie Route
router.post('/addMovie/:userId',MovieController.movieCreate)
router.get('/getMovie/:userId',MovieController.getMovie)
router.delete('/deleteMovie/:userId/:movieId',MovieController.deleteMovie)

module.exports = router