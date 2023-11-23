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

