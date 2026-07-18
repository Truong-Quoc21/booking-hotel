import express from 'express'
import * as HotelsController from './controllers/HotelsController.js'
import * as UsersController from './controllers/UsersController.js'
import insertHotelRequests from './dtos/requests/hotel/insertHotelRequests.js'
import updateHotelRequests from './dtos/requests/hotel/updateHotelRequests.js'
import insertUserRequests from './dtos/requests/user/insertUserRequests.js'
import updateUserRequests from './dtos/requests/user/updateUserRequests.js'
import asyncHandler from './middlewares/asyncHandler.js'
import validate from './middlewares/validate.js'

const router = express.Router()

export function AppRoute(app){
    //http:localhost:3000/api
    router.get('/hotels', asyncHandler(HotelsController.getHotels))
    router.get('/hotels/:id', asyncHandler(HotelsController.getHotelById))
    router.post('/hotels', validate(insertHotelRequests), asyncHandler(HotelsController.insertHotel))
    router.put('/hotels', validate(updateHotelRequests), asyncHandler(HotelsController.updateHotel))
    router.delete('/hotels/:id', asyncHandler(HotelsController.deleteHotel))

    router.get('/users', asyncHandler(UsersController.getUsers))
    router.get('/users/:id', asyncHandler(UsersController.getUserById))
    router.post('/users', validate(insertUserRequests), asyncHandler(UsersController.insertUser))
    router.put('/users', validate(updateUserRequests), asyncHandler(UsersController.updateUser))
    router.delete('/users/:id', asyncHandler(UsersController.deleteUser))
    router.post('/users/login', asyncHandler(UsersController.loginUser))



    app.use('/api/', router)
}