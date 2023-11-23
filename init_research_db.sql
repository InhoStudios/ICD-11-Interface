CREATE DATABASE IF NOT EXISTS ildsdb;
USE ildsdb;

CREATE TABLE IF NOT EXISTS Cases (
	case_id varchar(255),
    age int,
    sex varchar(1),
    history tinyint(1),
    ethnicity varchar(100),
    user_selected_entity varchar(255) not null,
    clinician_entity varchar(255),
    pathologist_entity varchar(255),
    size int,
    severity varchar(100),
    fitzpatrick_type int,
    ita int,
    tags varchar(1023),
    primary key (case_id)
);

CREATE TABLE IF NOT EXISTS ICD_Entity (
	entity_id varchar(255),
    entity_title varchar(255),
    primary key (entity_id)
);

CREATE TABLE IF NOT EXISTS Image (
	img_id varchar(63) not null,
    filename varchar(255) not null,
    case_id varchar(255) not null,
    modality varchar(255) not null,
    camera varchar(255),
    imaging_conditions varchar(255),
    operator varchar(255),
    image_quality varchar(255),
    illumination varchar(255),
    color_constancy_applied varchar(150),

    view int,
    anatomic_site varchar(150),

    resolved boolean,
    detectability float,

    url varchar(511),

    primary key (img_id),
    foreign key (case_id) references Cases(case_id) on delete cascade
);

CREATE TABLE IF NOT EXISTS Case_Categories (
	case_id varchar(255),
    entity_id varchar(255),
    foreign key (case_id) references Cases(case_id) on delete cascade,
    foreign key (entity_id) references ICD_Entity(entity_id) on delete cascade
);

CREATE TABLE IF NOT EXISTS Case_Alt_Diagnoses (
	case_id varchar(255),
	entity_id varchar(255),
    foreign key (case_id) references Cases(case_id) on delete cascade,
    foreign key (entity_id) references ICD_Entity(entity_id) on delete cascade
);