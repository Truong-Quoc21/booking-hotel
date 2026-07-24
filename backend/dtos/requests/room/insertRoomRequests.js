import Joi from 'joi'

const roomSchema = Joi.object({
    hotel_id: Joi.number().integer().required(),
    room_type_id: Joi.number().integer().required(),
    name: Joi.string().max(100).required(),
    price: Joi.number().precision(2).positive().required(),
    capacity: Joi.number().integer().positive().required(),
    total_rooms: Joi.number().integer().positive().required(),
    bed_count: Joi.number().integer().optional(),
    area: Joi.number().precision(2).optional(),
    description: Joi.string().allow("").optional(),
    status: Joi.string().valid('available', 'unavailable', 'maintenance').required()
})

class insertRoomRequests {
    constructor(data) {
        this.hotel_id = data.hotel_id
        this.room_type_id = data.room_type_id
        this.name = data.name
        this.price = data.price
        this.capacity = data.capacity
        this.total_rooms = data.total_rooms
        this.bed_count = data.bed_count
        this.area = data.area
        this.description = data.description
        this.status = data.status
    }

    static validate(data) {
        if (Array.isArray(data)) {
            const schema = Joi.array().items(roomSchema)
            return schema.validate(data)
        }
        return roomSchema.validate(data)
    }
}

export default insertRoomRequests