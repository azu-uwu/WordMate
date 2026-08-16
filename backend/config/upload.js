const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Đường dẫn tới thư mục lưu file (relative to backend/src/config/)
const imageDir = path.join(__dirname, "../../frontend/public/uploads/images");
const audioDir = path.join(__dirname, "../../frontend/public/uploads/audio");

// Đảm bảo thư mục tồn tại
fs.mkdirSync(imageDir, { recursive: true });
fs.mkdirSync(audioDir, { recursive: true });

/**
 * Tạo tên file ngẫu nhiên theo format: {timestamp}-{random}.{ext}
 * Tránh trùng lặp tên file.
 */
const generateFilename = (file) => {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    return `${timestamp}-${random}${ext}`;
};

// Disk storage cho image
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imageDir);
    },
    filename: (req, file, cb) => {
        cb(null, generateFilename(file));
    }
});

// Disk storage cho audio
const audioStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, audioDir);
    },
    filename: (req, file, cb) => {
        cb(null, generateFilename(file));
    }
});

// File filter cho image: chỉ chấp nhận JPG/JPEG/PNG
const imageFileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
        cb(null, true);
    } else {
        cb(new Error("Chỉ chấp nhận file ảnh định dạng JPG, JPEG, PNG"), false);
    }
};

// File filter cho audio: chỉ chấp nhận MP3
const audioFileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".mp3") {
        cb(null, true);
    } else {
        cb(new Error("Chỉ chấp nhận file âm thanh định dạng MP3"), false);
    }
};

// Upload image: chỉ cho phép JPG/JPEG/PNG, tối đa 5MB
const uploadImage = multer({
    storage: imageStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Upload audio: chỉ cho phép MP3, tối đa 2MB
const uploadAudio = multer({
    storage: audioStorage,
    fileFilter: audioFileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

module.exports = {
    uploadImage,
    uploadAudio
};
