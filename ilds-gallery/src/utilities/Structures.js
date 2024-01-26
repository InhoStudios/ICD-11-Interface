import All_Sites from "../all_sites.json";

export const ICD = {
    TOKEN_HOST: "icdaccessmanagement.who.int",
    TOKEN_PATH: "/connect/token",
    TOKEN_URL: "https://icdaccessmanagement.who.int/connect/token",
    SCOPE: "icdapi_access",
    GRANT_TYPE: "client_credentials",
    QUERY_HOST: "id.who.int"
}

export const METHODS = {
    GET: "GET",
    POST: "POST"
}

export class Participant {
    participant_id;
    mob;
    gender;
    skin_type;
    ethnicity;

    constructor(pid, mob, gender, skintype, eth) {
        this.participant_id = pid;
        this.mob = mob;
        this.gender = gender;
        this.skin_type = skintype;
        this.ethnicity = eth;
    }
}

export class Lesion {
    lesion_id;
    diagnosis_entity;
    diagnosis_title;
    morphology;
    anatomic_site;
    severity;
    size;
    ancestors;

    constructor() {
        this.size = 0;
        this.severity = 'b';
        this.lesion_id = '';
        this.diagnosis_entity = '';
        this.diagnosis_title = '';
        this.morphology = '';
        this.anatomic_site = 0;
    }
}

export class Metadata {
    measurement_id;
    lesion_id;
    filetype;
    filepath;
    measurement_date;
    modality;
    attendant;
    
    iso;
    aperture;
    shutterspeed;
    polarization;

    constructor() {
        this.lesion_id = 'empty';
    }
}

export class Case {
    caseID;
    ancestors;
    image;
    title;
    age;
    sex;
    history;
    ethnicity;
    userEntity;
    clinicianEntity;
    pathologistEntity;
    anatomicSite;
    size;
    severity;
    fitzpatrickType;
    ita;
    tags;
}

export class ImageMetadata {
    filename;
    modality;
    camera;
    imaging_conditions;
    anatomicSite;
    operator;
    image_quality;
    illumination;
    color_constancy_applied;
    view;
}

export const SERVER_ENDPOINT = `http://128.189.163.168:7000`;
// export const SERVER_ENDPOINT = `http://localhost:9000`;

export const ANATOMIC_SITES = All_Sites