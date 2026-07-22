import Joi from 'joi'

const destinationSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    thumbnail: Joi.string().allow("").optional()
})

class insertDestinationRequests {
    constructor(data) {
        this.name = data.name
        this.description = data.description
        this.city = data.city
        this.country = data.country
        this.thumbnail = data.thumbnail
    }

    static validate(data) {
        if (Array.isArray(data)) {
            const schema = Joi.array().items(destinationSchema)
            return schema.validate(data)
        }
        return destinationSchema.validate(data)
    }
}

export default insertDestinationRequests