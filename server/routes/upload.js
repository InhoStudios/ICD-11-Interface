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
        cb(null, `${uuidv4()}.${ext}`);
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
        let promises = [];
        return res.send({
            success: true
        });

        let caseBody = JSON.parse(req.body.case);
        let caseID = uuidv4();

        let imageBody = JSON.parse(req.body.imageMetadata);
        let imageID = uuidv4();

        let ancestors = caseBody.ancestors;
        let caseCategories = [];
        let additionalEntities = [];

        for (let ancestor of ancestors) {
            let ancestorID = ancestor.replace("http://id.who.int/icd/entity/","");
            if (ancestorID === "979408586" || 
                ancestorID === "448895267" ||
                ancestorID === "455013390" ||
                ancestorID === "1920852714") {
                    continue;
                }
            let fullEntity = await icd.getEntity(ancestorID, "ancestor");
            console.log(JSON.stringify(fullEntity));

            let entity = {
                entity_title: `'${fullEntity.title["@value"].replace("<em class='found'>","").replace("</em>","")}'`,
                entity_id: `'${ancestorID}'`
            };
            additionalEntities.push(entity);

            caseAncestorPair = {
                case_id: `'${caseID}'`,
                entity_id: `'${ancestorID}'`,
            };
            caseCategories.push(caseAncestorPair);
        }

        console.log(req.file.path)
        img_file_path = req.file.path.replaceAll("\\", "/")

        let url = `${req.protocol}://${req.hostname}:8081/${img_file_path}`

        let uploadedCase = {
            case_id: `'${caseID}'`,
            age: caseBody.age,
            sex: `'${caseBody.sex}'`,
            history: caseBody.history == "t" ? 1 : 0,
            user_selected_entity: caseBody.userEntity,
            severity: `'${caseBody.severity}'`
        };
        let uploadedImage = {
            img_id: `'${imageID}'`,
            filename: `'${req.file.filename}'`,
            case_id: `'${caseID}'`,
            url: `'${url}'`,
            modality: `'${imageBody.modality}'`,
            anatomic_site: imageBody.anatomicSite
        }
        
        promises.push(sql.insert("Cases", uploadedCase));
        promises.push(sql.insert("Image", uploadedImage));
        promises.push(sql.insertArray("ICD_Entity", additionalEntities));

        await Promise.all(promises).then(() => {
            sql.insertArray("Case_Categories", caseCategories);
        });

        console.log(`Image received: ${req.file.filename}\nImage hosted at ${req.protocol}://${req.hostname}:9000/${img_file_path}`);
        return res.send({
            success: true
        });
    }
});

module.exports = router;