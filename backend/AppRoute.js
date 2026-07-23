import express from 'express'
import * as HotelsController from './controllers/HotelsController.js'
import * as UsersController from './controllers/UsersController.js'
import * as DestinationsController from './controllers/DestinationsController.js'
import * as DestinationImageController from './controllers/DestinationImageController.js'
import * as HotelImageController from './controllers/HotelImageController.js'
import insertHotelRequests from './dtos/requests/hotel/insertHotelRequests.js'
import updateHotelRequests from './dtos/requests/hotel/updateHotelRequests.js'
import insertUserRequests from './dtos/requests/user/insertUserRequests.js'
import updateUserRequests from './dtos/requests/user/updateUserRequests.js'
import insertDestinationRequests from './dtos/requests/destination/insertDestinationRequests.js'
import updateDestinationRequests from './dtos/requests/destination/updateDestinationRequests.js'

import asyncHandler from './middlewares/asyncHandler.js'
import validate from './middlewares/validate.js'
import { destinationImageUpload, hotelImageUpload } from './middlewares/imageUpload.js'

const router = express.Router()

export function AppRoute(app){
    //http:localhost:3000/api
    router.get('/hotels', asyncHandler(HotelsController.getHotels))
    router.get('/hotels/:id', asyncHandler(HotelsController.getHotelById))
    router.post('/hotels', validate(insertHotelRequests), asyncHandler(HotelsController.insertHotel))
    router.put('/hotels/:id', validate(updateHotelRequests), asyncHandler(HotelsController.updateHotel))
    router.delete('/hotels/:id', asyncHandler(HotelsController.deleteHotel))

    router.get('/users', asyncHandler(UsersController.getUsers))
    router.get('/users/:id', asyncHandler(UsersController.getUserById))
    router.post('/users', validate(insertUserRequests), asyncHandler(UsersController.insertUser))
    router.put('/users/:id', validate(updateUserRequests), asyncHandler(UsersController.updateUser))
    router.delete('/users/:id', asyncHandler(UsersController.deleteUser))
    router.post('/users/login', asyncHandler(UsersController.loginUser))

    router.get('/destinations', asyncHandler(DestinationsController.getDestinations))
    router.get('/destinations/:id', asyncHandler(DestinationsController.getDestinationById))
    router.post('/destinations', validate(insertDestinationRequests), asyncHandler(DestinationsController.insertDestination))
    router.put('/destinations/:id', validate(updateDestinationRequests), asyncHandler(DestinationsController.updateDestination))
    router.delete('/destinations/:id', asyncHandler(DestinationsController.deleteDestination))
    router.post('/destinations/:destinationId/images', destinationImageUpload.array('images'), asyncHandler(DestinationImageController.uploadImages))
    router.post('/hotels/:hotelId/images', hotelImageUpload.array('images'), asyncHandler(HotelImageController.uploadImages))

    app.use('/api/', router)
}