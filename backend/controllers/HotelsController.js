import { Sequelize } from "sequelize";
const { Op } = Sequelize;
import db from "../models/index.js";
import insertHotelRequests from "../dtos/requests/hotel/insertHotelRequests.js";
import updateHotelRequests from "../dtos/requests/hotel/updateHotelRequests.js";

export async function getHotels(req, res) {
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
                    { country: { [Op.like]: `%${search}%` } },
                    { address: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const [hotels, totalHotels] = await Promise.all([
            db.Hotel.findAll({
                where: whereClause,
                limit: pageSize,
                offset: offset
            }),
            db.Hotel.count({ where: whereClause })
        ]);

        res.status(200).json({
            message: 'Lấy danh sách khách sạn thành công',
            data: hotels,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalHotels / pageSize),
            totalHotels
        });
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi', error: error.message });
    }
}

export async function getHotelById(req, res) {
    try {
        const { id } = req.params;
        const hotel = await db.Hotel.findByPk(id, {
            include: [
                { model: db.HotelImage, as: 'HotelImages' },
                { model: db.Room, as: 'Rooms' },
                { model: db.Review, as: 'Reviews' },
                { model: db.Amenity, as: 'Amenities', through: { attributes: [] } }
            ]
        });

        if (!hotel) {
            return res.status(404).json({ message: 'Không tìm thấy khách sạn' });
        }

        res.status(200).json({
            message: 'Lấy thông tin khách sạn thành công',
            data: hotel
        });
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi', error: error.message });
    }
}

export async function insertHotel(req, res) {
    try {
        console.log('BODY:', JSON.stringify(req.body));
        const { error } = insertHotelRequests.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: 'Dữ liệu không hợp lệ',
                error: error.details[0].message
            })
        }

        const data = Array.isArray(req.body) ? req.body : [req.body]

        const hotels = await Promise.all(
            data.map(item => db.Hotel.create({
                destination_id: item.destination_id,
                name: item.name,
                description: item.description,
                address: item.address,
                city: item.city,
                country: item.country,
                star_rating: item.star_rating,
                phone: item.phone,
                email: item.email,
                thumbnail: item.thumbnail,
                check_in_time: item.check_in_time,
                check_out_time: item.check_out_time
            }))
        )

        res.status(201).json({
            message: 'Thêm mới khách sạn thành công',
            data: hotels.length === 1 ? hotels[0] : hotels
        });
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi khi thêm khách sạn', error: error.message });
    }
}

export async function updateHotel(req, res) {
    try {
        const { error } = updateHotelRequests.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: 'Dữ liệu không hợp lệ',
                error: error.details[0].message
            })
        }

        const { id } = req.params;
        const updated = await db.Hotel.update(req.body, { where: { id } });

        if (updated[0] > 0) {
            return res.status(200).json({ message: 'Cập nhật khách sạn thành công' });
        } else {
            return res.status(404).json({ message: 'Không tìm thấy khách sạn' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi', error: error.message });
    }
}

export async function deleteHotel(req, res) {
    try {
        const { id } = req.params;
        const deleted = await db.Hotel.destroy({ where: { id } });

        if (deleted) {
            return res.status(200).json({ message: 'Xoá khách sạn thành công' });
        } else {
            return res.status(404).json({ message: 'Không tìm thấy khách sạn' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi', error: error.message });
    }
}