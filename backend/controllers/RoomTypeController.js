import db from "../models/index.js";
import { Sequelize } from "sequelize";
const { Op } = Sequelize;

export async function getRoomTypes(req, res) {
    try {
        const { search = '', page = 1, limit } = req.query;
        const pageSize = limit ? parseInt(limit) : 10;
        const offset = (page - 1) * pageSize;

        let whereClause = {};
        if (search.trim() !== '') {
            whereClause = {
                [Op.or]: [
                    { type_name: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const [roomTypes, totalRoomTypes] = await Promise.all([
            db.RoomType.findAll({
                where: whereClause,
                limit: pageSize,
                offset: offset
            }),
            db.RoomType.count({ where: whereClause })
        ]);

        res.status(200).json({
            message: 'Lấy danh sách loại phòng thành công',
            data: roomTypes,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalRoomTypes / pageSize),
            totalRoomTypes
        });
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi', error: error.message });
    }
}

export async function getRoomTypeById(req, res) {
    try {
        const { id } = req.params;
        const roomType = await db.RoomType.findByPk(id);

        if (!roomType) {
            return res.status(404).json({ message: 'Không tìm thấy loại phòng' });
        }

        res.status(200).json({
            message: 'Lấy thông tin loại phòng thành công',
            data: roomType
        });
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi', error: error.message });
    }
}

export async function insertRoomType(req, res) {
    try {
        const data = Array.isArray(req.body) ? req.body : [req.body];

        const invalidItem = data.find(item => !item.type_name || item.type_name.trim() === '');
        if (invalidItem) {
            return res.status(400).json({
                message: 'Dữ liệu không hợp lệ',
                error: '"type_name" là bắt buộc'
            });
        }

        const roomTypes = await Promise.all(
            data.map(item => db.RoomType.create({
                type_name: item.type_name,
                description: item.description
            }))
        );

        res.status(201).json({
            message: 'Thêm mới loại phòng thành công',
            data: roomTypes.length === 1 ? roomTypes[0] : roomTypes
        });
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi khi thêm loại phòng', error: error.message });
    }
}

export async function updateRoomType(req, res) {
    try {
        const { id } = req.params;

        if ('type_name' in req.body && req.body.type_name.trim() === '') {
            return res.status(400).json({
                message: 'Dữ liệu không hợp lệ',
                error: '"type_name" không được để trống'
            });
        }

        const updated = await db.RoomType.update(req.body, { where: { id } });

        if (updated[0] > 0) {
            return res.status(200).json({ message: 'Cập nhật loại phòng thành công' });
        } else {
            return res.status(404).json({ message: 'Không tìm thấy loại phòng' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi', error: error.message });
    }
}

export async function deleteRoomType(req, res) {
    try {
        const { id } = req.params;
        const deleted = await db.RoomType.destroy({ where: { id } });

        if (deleted) {
            return res.status(200).json({ message: 'Xoá loại phòng thành công' });
        } else {
            return res.status(404).json({ message: 'Không tìm thấy loại phòng' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi', error: error.message });
    }
}