import { Sequelize } from "sequelize";
const { Op } = Sequelize;
import db from "../models/index.js";
import insertDestinationRequests from "../dtos/requests/destination/insertDestinationRequests.js";
import updateDestinationRequests from "../dtos/requests/destination/updateDestinationRequests.js";
 
export async function getDestinations(req, res) {
    try {
        const { search = '', page = 1, limit } = req.query;
        const pageSize = limit ? parseInt(limit) : 10;
        const offset = (page - 1) * pageSize;
 
        let whereClause = {};
        if (search.trim() !== '') {
            whereClause = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } },
                    { city: { [Op.like]: `%${search}%` } },
                    { country: { [Op.like]: `%${search}%` } }
                ]
            };
        }
 
        const [destinations, totalDestinations] = await Promise.all([
            db.Destination.findAll({
                where: whereClause,
                limit: pageSize,
                offset: offset
            }),
            db.Destination.count({ where: whereClause })
        ]);
 
        res.status(200).json({
            message: 'Lấy danh sách địa điểm thành công',
            data: destinations,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalDestinations / pageSize),
            totalDestinations
        });
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi', error: error.message });
    }
}
 
export async function getDestinationById(req, res) {
    try {
        const { id } = req.params;
        const destination = await db.Destination.findByPk(id, {
            include: [
                { model: db.DestinationImage, as: 'DestinationImages' },
                { model: db.Hotel, as: 'Hotels' }
            ]
        });
 
        if (!destination) {
            return res.status(404).json({ message: 'Không tìm thấy địa điểm' });
        }
 
        res.status(200).json({
            message: 'Lấy thông tin địa điểm thành công',
            data: destination
        });
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi', error: error.message });
    }
}
 
export async function insertDestination(req, res) {
    try {
        console.log('BODY:', JSON.stringify(req.body));
        const { error } = insertDestinationRequests.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: 'Dữ liệu không hợp lệ',
                error: error.details[0].message
            })
        }
 
        const data = Array.isArray(req.body) ? req.body : [req.body]
 
        const destinations = await Promise.all(
            data.map(item => db.Destination.create({
                name: item.name,
                description: item.description,
                city: item.city,
                country: item.country,
                thumbnail: item.thumbnail
            }))
        )
 
        res.status(201).json({
            message: 'Thêm mới địa điểm thành công',
            data: destinations.length === 1 ? destinations[0] : destinations
        });
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi khi thêm địa điểm', error: error.message });
    }
}
 
export async function updateDestination(req, res) {
    try {
        const { error } = updateDestinationRequests.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: 'Dữ liệu không hợp lệ',
                error: error.details[0].message
            })
        }
 
        const { id } = req.params;
        const updated = await db.Destination.update(req.body, { where: { id } });
 
        if (updated[0] > 0) {
            return res.status(200).json({ message: 'Cập nhật địa điểm thành công' });
        } else {
            return res.status(404).json({ message: 'Không tìm thấy địa điểm' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi', error: error.message });
    }
}
 
export async function deleteDestination(req, res) {
    try {
        const { id } = req.params;
        const deleted = await db.Destination.destroy({ where: { id } });
 
        if (deleted) {
            return res.status(200).json({ message: 'Xoá địa điểm thành công' });
        } else {
            return res.status(404).json({ message: 'Không tìm thấy địa điểm' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi', error: error.message });
    }
}