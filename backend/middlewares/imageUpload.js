import path from 'path'
import fs from 'fs'
import multer from 'multer'

const fileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true);
    } else {
        callback(new Error('Chỉ được phép tải file ảnh!'), false);
    }
}

function createUploader(folderName) {
    const storage = multer.diskStorage({
        destination: function (req, res, callback) {
            const destinationPath = path.join(__dirname, `../uploads/${folderName}/`)
            if (!fs.existsSync(destinationPath)) {
                fs.mkdirSync(destinationPath, { recursive: true })
            }
            callback(null, destinationPath)
        },
        filename: function (req, file, callback) {
            const uniqueName = `${Date.now()}-${file.originalname}`
            callback(null, uniqueName)
        },
    })

    return multer({
        storage,
        fileFilter,
        limits: { fileSize: 1024 * 1024 * 5 }
    })
}

export const destinationImageUpload = createUploader('destinations')
export const hotelImageUpload = createUploader('hotels')
export const roomImageUpload = createUploader('rooms')