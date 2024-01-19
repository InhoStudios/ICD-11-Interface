-- select lesions based on patient ID (fill in participant id)
SELECT *
FROM Lesion l
WHERE l.participant_id="participant_id";
-- select participant information based on participant id
SELECT *
FROM Participant p
WHERE p.participant_id="participant_id";

/*

INSERTING A SINGLE MEASUREMENT

*/

-- new participant
INSERT IGNORE INTO Participant (participant_id, birth_date, sex, eye_colour, skin_type, ethnicity, hair_colour)
VALUES ("YYMMDDA", STR_TO_DATE(date, "%m-%Y"), 's', "colour", 4, "ethnicity", "hair_colour");

-- select all images and join with other metadata --

SELECT 'https://128.189.163.168:8081/' + m.filepath as url, p.participant_id as participant_id, ie.entity_title as entity_title, m.measurement_id as measurement_id, m.modality as modality, l.anatomic_site as anatomic_site
FROM Measurement m, Lesion l, Participant p, ICD_Entity ie
WHERE m.lesion_id = l.lesion_id AND l.participant_id = p.participant_id AND l.diagnosis_entity = ie.entity_id