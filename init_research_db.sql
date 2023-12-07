CREATE DATABASE IF NOT EXISTS ildsdb;
USE ildsdb;

CREATE TABLE IF NOT EXISTS Participant (
    participant_id varchar(15) not null,
    birth_date date not null,
    gender varchar(63),
    skin_type tinyint(7),
    ethnicity varchar(127),
    tags varchar(511),
    primary key (participant_id)
);

CREATE TABLE IF NOT EXISTS ICD_Entity (
	entity_id varchar(31) not null,
    entity_title varchar(255),
    primary key (entity_id)
);

CREATE TABLE IF NOT EXISTS Anatomic_Site (
	anatomic_id int not null,
    anatomic_site varchar(127),
    as_level int not null,
    parent int,
    primary key (anatomic_id)
);

CREATE TABLE IF NOT EXISTS Lesion (
    lesion_id varchar(15) not null,
    participant_id varchar(15) not null,
    diagnosis_entity varchar(31) not null,
    morphology varchar(2047),
    anatomic_site int not null,
    severity char(1),
    les_size int,
    primary key (lesion_id),
    foreign key (participant_id) references Participant(participant_id) on delete cascade,
    foreign key (diagnosis_entity) references ICD_Entity(entity_id),
    foreign key (anatomic_site) references Anatomic_Site(anatomic_id)
);

CREATE TABLE IF NOT EXISTS Measurement (
    measurement_id varchar(63) not null,
    lesion_id varchar(15) not null,
    filetype varchar(50) not null,
    filepath varchar(1023) not null,
    measurement_date date not null,
    modality varchar(63) not null,
    attendant varchar(255),

    iso int not null,
    aperture decimal(3, 1) not null,
    shutterspeed varchar(15) not null,
    polarization varchar(31) not null,

    primary key (measurement_id),
    foreign key (lesion_id) references Lesion(lesion_id)
);

CREATE TABLE IF NOT EXISTS Clinical (
    measurement_id varchar(63) not null,
    view int,
    detectability float,
    primary key (measurement_id),
    foreign key (measurement_id) references Measurement(measurement_id)
);

CREATE TABLE IF NOT EXISTS VersionFile (
    version_number int not null auto_increment,
    measurement_id varchar(15) not null,
    filetype varchar(50) not null,
    filepath varchar(1023) not null,
    version_type varchar(63) not null,
    primary key (version_number, measurement_id),
    foreign key (measurement_id) references Measurement(measurement_id)
);

CREATE TABLE IF NOT EXISTS Lesion_Categories (
	lesion_id varchar(15),
    entity_id varchar(31),
    foreign key (lesion_id) references Lesion(lesion_id) on delete cascade,
    foreign key (entity_id) references ICD_Entity(entity_id) on delete cascade
);

CREATE TABLE IF NOT EXISTS Lesion_Alt_Diagnoses (
	lesion_id varchar(15),
	entity_id varchar(31),
    foreign key (lesion_id) references Lesion(lesion_id) on delete cascade,
    foreign key (entity_id) references ICD_Entity(entity_id) on delete cascade
);