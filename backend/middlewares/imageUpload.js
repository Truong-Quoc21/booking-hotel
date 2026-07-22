import path from 'path'
import multer from 'multer'
const storage = multer.diskStorage({
    destination: function(req, res, callback) {
        const destinationPath = path.join(__dirname, '../uploads/')
        callback(null, destinationPath)
    },
    filename: function(req, file, callback) {
        const uniqueName = `${Date.now()}-${file.originalname}`
        callback(null, uniqueName)
    },
})

const fileFilter = (req, file, callback) => {
    if(file.mimetype.startsWith('image')){
        callback(null, true);
    } else {
        callback(new Error('Chỉ được phép tải file ảnh!'), false);
    }
}

const upload = multer({
    storage,
    fileFilter, 
    limits: {
        fileSize: 1024 * 1024 * 5
    }
})
export default upload