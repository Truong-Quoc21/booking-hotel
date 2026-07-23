import db from "../models/index.js";
import path from 'path'
import fs from 'fs'

export async function uploadImages(req, res) {
    try {
        const { hotelId } = req.params;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: 'Không có file nào được tải lên'
            })
        }

        const hotel = await db.Hotel.findByPk(hotelId)
        if (!hotel) {
            return res.status(404).json({ message: 'Không tìm thấy khách sạn' })
        }

        const images = await Promise.all(
            req.files.map(file =>
                db.HotelImage.create({
                    hotel_id: hotelId,
                    image_url: file.filename
                })
            )
        )

        if (!hotel.thumbnail) {
            await hotel.update({ thumbnail: images[0].image_url })
        }

        res.status(200).json({
            message: 'Tải ảnh lên thành công',
            data: images
        })
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi khi tải ảnh', error: error.message })
    }
}

export async function viewImage(req, res) {
    const { fileName } = req.params
    const imagePath = path.join(__dirname, '../uploads/hotels/', fileName)
    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('Image not found');
        }
        res.sendFile(imagePath)
    })
}