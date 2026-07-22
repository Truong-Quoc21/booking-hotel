import Joi from 'joi'

const updateDestinationSchema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    city: Joi.string().optional(),
    country: Joi.string().optional(),
    thumbnail: Joi.string().allow("").optional(),
    created_at: Joi.date().optional(),
    updated_at: Joi.date().optional()
})

class updateDestinationRequests {
    constructor(data) {
        this.name = data.name
        this.description = data.description
        this.city = data.city
        this.country = data.country
        this.thumbnail = data.thumbnail
    }

    static validate(data) {
        return updateDestinationSchema.validate(data, { allowUnknown: true })
    }
}

export default updateDestinationRequests