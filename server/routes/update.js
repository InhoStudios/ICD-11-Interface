var express = require('express');
var router = express.Router();
var multer = require('multer');
var uuidv4 = require('uuid/v4');
var sql = require('../utilities/SQLInterface');
var icd = require('../utilities/ICDInterface');

const DIR = "./public/images/"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        // TODO: Generate unique filename
        const ext = file.originalname.split(".").slice(-1)[0];
        cb(null, `${file.fieldname}.${ext}`);
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg, and .jpeg files allowed"));
        }
    }
});

router.post('/', upload.any(), async (req, res, next) => {
    console.log(req.files);
    if (!req.files) {
        console.log("No image received");
        return res.send({
            success: false
        });
    } else {
        let measurement_id = req.body.measurement_id;

        // insert all new version images
        let new_images = [];
        for (let image of req.files) {
            let img = {
                measurement_id: `"${measurement_id}"`,
                filepath: `"${image.path.replaceAll("\\", "/")}"`,
            };
            new_images.push(img);
        }
        sql.insertArray("VersionFile", new_images);

        return res.send({
            success: true
        });
    }
});

module.exports = router;