const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer();
const streamifier = require('streamifier')

module.exports = async (req, res, next) => {
    if (req.file) {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET
        });

        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        let result = await streamUpload(req);
        req.body[req.file.fieldname] = result.secure_url;
    }
    next();

};
