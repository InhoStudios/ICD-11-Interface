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
        let promises = [];
        let lesion_categories = [];
        let additional_entities = [];

        let measurements = JSON.parse(req.body.measurements);
        let participant = JSON.parse(req.body.participant);
        let lesions = JSON.parse(req.body.lesions);
        let attendant = req.body.attendant;

        console.log(req.files, measurements, participant, attendant);

        // construct filepath reference table
        let files = {}
        for (let file of req.files) {
            files[file.fieldname] = file.path;
        }

        let participantToUpload = {
            participant_id: `${participant.participant_id}`,
            birth_date: `${participant.mob}`,
            gender: `${participant.gender}`,
            skin_type: `${participant.skin_type}`,
            ethnicity: `${participant.ethnicity}`,
        }
        promises.push(sql.insertParticipant(participantToUpload));

        for (let [id, lesion] of Object.entries(lesions)) {
            let ancestors = lesion.ancestors;
            let lesionToUpload = {
                lesion_id: `"${id}"`,
                participant_id: `"${participant.participant_id}"`,
                diagnosis_entity: `"${lesion.diagnosis_entity}"`,
                anatomic_site: `"${lesion.anatomic_site}"`,
                morphology: `"${lesion.morphology}"`,
                severity: `"${lesion.severity}"`,
                les_size: `"${lesion.size}"`,
            }
            promises.push(sql.insert("Lesion", lesionToUpload));

            for (let ancestor of ancestors) {
                let ancestorID = ancestor.replace("http://id.who.int/icd/entity/","");
                if (ancestorID === "979408586" || 
                    ancestorID === "448895267" ||
                    ancestorID === "455013390" ||
                    ancestorID === "1920852714") {
                        continue;
                    }
                let fullEntity = await icd.getEntity(ancestorID, "ancestor");
    
                let entity = {
                    entity_id: `'${ancestorID}'`,
                    entity_title: `'${fullEntity.title["@value"].replace("<em class='found'>","").replace("</em>","")}'`,
                };
                additional_entities.push(entity);
    
                lesion_ancestor = {
                    lesion_id: `'${id}'`,
                    entity_id: `'${ancestorID}'`,
                };
                lesion_categories.push(lesion_ancestor);
            }
        }

        for (let measurement of Object.values(measurements)) {
            let metadata = measurement.metadata;
            let metadataToUpload = {
                measurement_id: `"${metadata.measurement_id}"`,
                lesion_id: `"${metadata.lesion_id}"`,
                filetype: `"${metadata.filetype}"`,
                filepath: `"${files[metadata.measurement_id].replaceAll("\\","/")}"`,
                modality: `"${metadata.modality}"`,
                attendant: `"${attendant}"`,
            }
            promises.push(sql.insert("Measurement", metadataToUpload));
        }

        promises.push(sql.insertArray("ICD_Entity", additional_entities));

        await Promise.all(promises).then(() => {
            sql.insertArray("Lesion_Categories", lesion_categories);
        });

        return res.send({
            success: true
        });
    }
});

module.exports = router;