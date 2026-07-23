import Joi from 'joi'

const hotelSchema = Joi.object({
    destination_id: Joi.number().integer().required(),
    name: Joi.string().required(),
    description: Joi.string().optional(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    star_rating: Joi.number().integer().min(1).max(5).required(),
    phone: Joi.string().allow('', null).optional(),
    email: Joi.string().email().allow(null).optional(),
    thumbnail: Joi.string().allow("").optional(),
    check_in_time: Joi.string().optional(),
    check_out_time: Joi.string().optional()
})

class insertHotelRequests {
    constructor(data) {
        this.destination_id = data.destination_id
        this.name = data.name
        this.description = data.description
        this.address = data.address
        this.city = data.city
        this.country = data.country
        this.star_rating = data.star_rating
        this.phone = data.phone
        this.email = data.email
        this.thumbnail = data.thumbnail
        this.check_in_time = data.check_in_time
        this.check_out_time = data.check_out_time
    }

    static validate(data) {
        if (Array.isArray(data)) {
            const schema = Joi.array().items(hotelSchema)
            return schema.validate(data)
        }
        return hotelSchema.validate(data)
    }
}

export default insertHotelRequests