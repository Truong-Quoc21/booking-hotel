import db from "../models/index.js";
import path from 'path'
import fs from 'fs'

export async function uploadImages(req, res) {
    try {
        const { destinationId } = req.params; 

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: 'Không có file nào được tải lên'
            })
        }

        const destination = await db.Destination.findByPk(destinationId)
        if (!destination) {
            return res.status(404).json({ message: 'Không tìm thấy địa điểm' })
        }

        const images = await Promise.all(
            req.files.map(file =>
                db.DestinationImage.create({
                    destination_id: destinationId,
                    image_url: file.filename
                })
            )
        )

        if (!destination.thumbnail) {
            await destination.update({ thumbnail: images[0].image_url })
        }

        res.status(200).json({
            message: 'Tải ảnh lên thành công',
            data: images
        })
    } catch (error) {
        res.status(500).json({ message: 'Xảy ra lỗi khi tải ảnh', error: error.message })
    }
}