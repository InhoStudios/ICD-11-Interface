var express = require("express");
const sql = require("../utilities/SQLInterface");
const AdmZip = require("adm-zip");
var router = express.Router();

router.get('/', async (req, res, next) => {
    // TODO: REMOVE STUB CODE
    let results = await getImagesFromRequest(req);
    res.send(results);
});

router.get('/download', async(req, res, next) => {
    let results = await getImagesFromRequest(req);
    try {
        let zip = AdmZip();
        for (let image of results) {
            zip.addLocalFile(`./public/images/${image.filename}`, `/images/`);
        }
        zip.addFile("metadata.json", Buffer.from(JSON.stringify(results)));
        let zipFileContents = zip.toBuffer();

        const fileName = "images.zip";
        const fileType = "application/zip";

        res.writeHead(200, {
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Type': fileType,
        });
        return res.end(zipFileContents);
    } catch (e) {
        console.error("err::/image/download, ", e);
        return res.send({
            success: false
        });
    }
});

async function getImagesFromRequest(req) {
    // TODO: entity code from query
    let entityCode = req.query.entity_code ? `l.diagnosis_entity='${req.query.entity_code}'` : "true";
    // TODO: view from query
    let view = 'true'; // req.query.view ? `i.view=${req.query.view}` : 'true';
    // TODO: severity from query
    let severity = req.query.severity ? `l.severity='${req.query.severity}'` : "true";
    // TODO: modality from image
    let modality = req.query.modality ? `m.modality='${req.query.modality}'` : "true";
    // TODO: sex from image
    let sex = req.query.sex ? `p.sex='${req.query.sex}'` : "true";
    // TODO: min-age from image
    let min_age = req.query.min_age ? `p.birth_date>=${req.query.min_age}` : "true";
    // TODO: max-age from image
    let max_age = req.query.max_age ? `p.birth_date<=${req.query.max_age}` : "true";
    // TODO: body site from image
    let site = req.query.site ? `l.anatomic_site=${req.query.site} and a.anatomic_site=l.anatomic_site` : "true";

    let verified = req.query.verified ? "true" : "m.verified = true";

    console.log(req.query);

    let query = `SELECT CONCAT('http://${process.env.IP}:${process.env.PORT}/', m.filepath) as url,` + 
    ` p.participant_id as participant_id, l.les_size as lesion_size, l.severity as severity, m.attendant as attendant,` + 
    ` ie.entity_title as entity_title, m.measurement_id as measurement_id, l.morphology as morphology,` + 
    ` m.modality as modality, l.anatomic_site as anatomic_site, ie.entity_id as entity_id, l.lesion_id as lesion_id, m.verified as verified` + 
    ` FROM Measurement m, Lesion l, Participant p, ICD_Entity ie` + 
    ` WHERE m.lesion_id = l.lesion_id AND l.participant_id = p.participant_id` + 
    ` AND l.diagnosis_entity = ie.entity_id AND ${entityCode} AND ${severity} AND ${modality} AND ${verified};`;
    // let query = `select p.participant_id, m.measurement_id, l.diagnosis_entity, e.entity_title, l.anatomic_site, m.filepath, 
    // p.birth_date, p.sex, l.severity, p.skin_type, p.tags, m.modality, a.anatomic_site
    // from Participant p, Measurement m, Lesion l, ICD_Entity e, Participates_in pi, Study s, Collected_Measurements cm, Anatomic_Site a
    // where m.measurement_id=cm.measurement_id and s.study_id=cm.study_id and pi.study_id=s.study_id and p.participant_id=pi.participant_id and 
    // ${entityCode} and ${view} and ${severity} and ${modality} 
    // and ${sex} and ${site};
    // `;
    console.log(query);
    let results = await sql.postQuery(query);
    return results;
}

module.exports = router;