import Joi from 'joi'

const updateRoomSchema = Joi.object({
    hotel_id: Joi.number().integer().optional(),
    room_type_id: Joi.number().integer().optional(),
    name: Joi.string().max(100).optional(),
    price: Joi.number().precision(2).positive().optional(),
    capacity: Joi.number().integer().positive().optional(),
    total_rooms: Joi.number().integer().positive().optional(),
    bed_count: Joi.number().integer().optional(),
    area: Joi.number().precision(2).optional(),
    description: Joi.string().allow("").optional(),
    status: Joi.string().valid('available', 'unavailable', 'maintenance').optional(),
    created_at: Joi.date().optional(),
    updated_at: Joi.date().optional(),
    deleted_at: Joi.date().allow(null).optional()
})

class updateRoomRequests {
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
        return updateRoomSchema.validate(data, { allowUnknown: true })
    }
}

export default updateRoomRequests