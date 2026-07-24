import { Sequelize } from "sequelize";
const { Op } = Sequelize;
import db from "../models/index.js";
import insertRoomRequests from "../dtos/requests/room/insertRoomRequests.js";
import updateRoomRequests from "../dtos/requests/room/updateRoomRequests.js";

export async function getRooms(req, res) {
    try {
        const { search = '', hotel_id, room_type_id, status, page = 1, limit } = req.query;
        const pageSize = limit ? parseInt(limit) : 10;
        const offset = (page - 1) * pageSize;

        let whereClause = {};

        if (search.trim() !== '') {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        if (hotel_id) {
            whereClause.hotel_id = hotel_id;
        }

        if (room_type_id) {
            whereClause.room_type_id = room_type_id;
        }

        if (status) {
            whereClause.status = status;
        }

        const [rooms, totalRooms] = await Promise.all([
            db.Room.findAll({
                where: whereClause,
                limit: pageSize,
                offset: offset
            }),
            db.Room.count({ where: whereClause })
        ]);

        res.status(200).json({
            message: 'Lấy danh sách phòng thành công',
            data: rooms,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalRooms / pageSize),
            totalRooms
        });
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi', error: error.message });
    }
}

export async function getRoomById(req, res) {
    try {
        const { id } = req.params;
        const room = await db.Room.findByPk(id, {
            include: [
                { model: db.RoomImage, as: 'RoomImages' },
                { model: db.Hotel, as: 'Hotel' },
                { model: db.RoomType, as: 'RoomType' }
            ]
        });

        if (!room) {
            return res.status(404).json({ message: 'Không tìm thấy phòng' });
        }

        res.status(200).json({
            message: 'Lấy thông tin phòng thành công',
            data: room
        });
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi', error: error.message });
    }
}

export async function insertRoom(req, res) {
    try {
        console.log('BODY:', JSON.stringify(req.body));
        const { error } = insertRoomRequests.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: 'Dữ liệu không hợp lệ',
                error: error.details[0].message
            })
        }

        const data = Array.isArray(req.body) ? req.body : [req.body]

        const rooms = await Promise.all(
            data.map(item => db.Room.create({
                hotel_id: item.hotel_id,
                room_type_id: item.room_type_id,
                name: item.name,
                price: item.price,
                capacity: item.capacity,
                total_rooms: item.total_rooms,
                bed_count: item.bed_count,
                area: item.area,
                description: item.description,
                status: item.status
            }))
        )

        res.status(201).json({
            message: 'Thêm mới phòng thành công',
            data: rooms.length === 1 ? rooms[0] : rooms
        });
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi khi thêm phòng', error: error.message });
    }
}

export async function updateRoom(req, res) {
    try {
        const { error } = updateRoomRequests.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: 'Dữ liệu không hợp lệ',
                error: error.details[0].message
            })
        }

        const { id } = req.params;
        const updated = await db.Room.update(req.body, { where: { id } });

        if (updated[0] > 0) {
            return res.status(200).json({ message: 'Cập nhật phòng thành công' });
        } else {
            return res.status(404).json({ message: 'Không tìm thấy phòng' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi', error: error.message });
    }
}

export async function deleteRoom(req, res) {
    try {
        const { id } = req.params;
        const deleted = await db.Room.destroy({ where: { id } });

        if (deleted) {
            return res.status(200).json({ message: 'Xoá phòng thành công' });
        } else {
            return res.status(404).json({ message: 'Không tìm thấy phòng' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi', error: error.message });
    }
}