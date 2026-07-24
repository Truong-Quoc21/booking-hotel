import db from "../models/index.js";
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function uploadImages(req, res) {
    try {
        const { roomId } = req.params;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: 'Không có file nào được tải lên'
            })
        }

        const room = await db.Room.findByPk(roomId)
        if (!room) {
            return res.status(404).json({ message: 'Không tìm thấy phòng' })
        }

        const images = await Promise.all(
            req.files.map(file =>
                db.RoomImage.create({
                    room_id: roomId,
                    image_url: file.filename
                })
            )
        )

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
    const imagePath = path.join(__dirname, '../uploads/rooms/', fileName)
    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('Image not found');
        }
        res.sendFile(imagePath)
    })
}