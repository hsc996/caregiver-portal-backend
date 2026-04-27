const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const profileImageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'profile-images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
    }
});

module.exports = { cloudinary, profileImageStorage };
